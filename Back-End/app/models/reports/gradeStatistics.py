from flask import current_app as app
from sqlalchemy import or_

from app.models.app import *


class GradeStatistics:
    validationSchema = {
        "title": "gradeStatistics",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "gradeStatistics"},
            "sessionId": {"type": "string"},
            "granularity": {
                "type": "string",
                "enum": [
                    "course",
                    "department",
                    "university"
                ]
            },
            "department": {"type": "string"},
            "course": {"type": "string"},
            "semester": {"type": "string"}
        },
        "required": ["sessionId", "granularity", "semester"],
        "dependentSchemas": {
            "course": {"required": ["course"]},
            "department": {"required": ["department"]}
        }
    }

    def execute_query(self, requestJson):
        with app.app_context():
            granularity = requestJson["granularity"]

            if granularity == "course":
                return get_course_statistics(requestJson["course"], requestJson["semester"])
            elif granularity == "department":
                return get_department_statistics(requestJson["department"], requestJson["semester"])
            else:
                return get_university_statistics(requestJson["semester"])


def get_course_statistics(course, semester):
    base_grades_query = db.session.query(StudentGrades.grade)
    if course.isdigit():
        base_grades_query = base_grades_query \
            .select_from(StudentGrades) \
            .join(StudentGrades, CoursePerSemester.id == StudentGrades.course_sem_id) \
            .filter(CoursePerSemester.course_id == int(course))

    else:
        course_name = '%' + course + '%'
        filter_by_name_or_title = or_(Courses.name.like(course_name), Courses.title.like(course_name))
        base_grades_query = base_grades_query \
            .select_from(StudentGrades) \
            .join(StudentGrades, CoursePerSemester.id == StudentGrades.course_sem_id) \
            .join(Courses, CoursePerSemester.course_id == Courses.id) \
            .filter(filter_by_name_or_title)

    if semester == "All":
        return generate_stats(base_grades_query.all())
    else:
        return generate_stats(base_grades_query.filter(CoursePerSemester.course_semester == semester).all())


def get_department_statistics(department, semester):
    base_grades_query = db.session.query(StudentGrades.grade)
    if department.isdigit():
        base_grades_query = base_grades_query \
            .select_from(StudentGrades) \
            .join(CoursePerSemester, CoursePerSemester.id == StudentGrades.course_sem_id) \
            .join(Courses, CoursePerSemester.course_id == Courses.id) \
            .filter(Courses.department_id == int(department))

    else:
        department_name = '%' + department + '%'
        base_grades_query = base_grades_query \
            .select_from(StudentGrades) \
            .join(StudentGrades, CoursePerSemester.id == StudentGrades.course_sem_id) \
            .join(Courses, CoursePerSemester.course_id == Courses.id) \
            .join(Departments, Courses.department_id == Departments.id) \
            .filter(Departments.name.like(department_name))

    if semester == "All":
        return generate_stats(base_grades_query.all())
    else:
        return generate_stats(base_grades_query.filter(CoursePerSemester.course_semester == semester).all())


def get_university_statistics(semester):
    if semester == "All":
        return generate_stats(db.session.query(StudentGrades.grade).all())
    else:
        grades_list = db.session.query(StudentGrades.grade) \
            .select_from(StudentGrades) \
            .join(StudentGrades, CoursePerSemester.id == StudentGrades.course_sem_id) \
            .filter(CoursePerSemester.course_semester == semester) \
            .all()
        return generate_stats(grades_list)


def generate_stats(grades_list):
    # Group grades together for ease of counting
    group_by_grade = {}
    for grade_object in grades_list:
        grade = grade_object[0]
        if grade in group_by_grade:
            group_by_grade[grade] += 1
        else:
            group_by_grade[grade] = 1

    # Mapping for grades to numerical value for the sake of averages
    grade_mapping = {"A": 95, "B": 85, "C": 75, "D": 65, "F": 55}

    # Get total grades and passing grades
    registered_students = len(grades_list) if len(grades_list) > 0 else 1
    passing_grades = sum([group_by_grade[grade] for grade in group_by_grade if grade in ("A", "B", "C")])

    # Map grades to numerical values and get average
    grade_sum = [grade_mapping[grade] * group_by_grade[grade]
                 for grade in group_by_grade
                 if grade != "IP"]
    average_grade = sum(grade_sum) / registered_students

    # Calculate percentage of each letter grade
    percentageByGrade = {"percent" + grade: (group_by_grade[grade] / registered_students) * 100
                         for grade in group_by_grade}
    return {"registeredStudents": registered_students,
                "passingGrades": passing_grades,
                "averageGrade": average_grade,
                "percentageByGrade": percentageByGrade
            }
