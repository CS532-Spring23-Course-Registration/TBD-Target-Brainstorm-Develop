from flask import current_app as app
from sqlalchemy import func

from app.models.app import *


def create_response_json(major_department, major_completed_units, required_courses, course_prerequisites):
    # Declare fields for object mapping
    response_top_fields = ["studentId", "studentName", "majorTitle", "departmentId", "departmentName"]
    outline_history_fields = ["courseId", "courseTitle", "changeDate", "status"]
    course_fields = ["courseId", "courseTitle", "changeDate", "status", "courseName", "is_required"]

    response = {key: val for key, val in zip(response_top_fields, major_department)}
    response["studentOutline"] = {"majorCompletedUnits": major_completed_units[0],
                                  "requiredCourses": [],
                                  "electiveCourses": []}

    prerequisites_by_course = {}
    for course in course_prerequisites:
        course_id = course[0]
        if course_id in prerequisites_by_course:
            prerequisites_by_course[course_id].append(course[1])
        else:
            prerequisites_by_course[course_id] = [course[1]]

    change_history = []
    encountered_courses = {}
    for course in required_courses:
        course_object = {key: val for key, val in zip(course_fields, course)}

        if course[0] in encountered_courses:
            history_object = {key: val for key, val in zip(outline_history_fields, course[0:4])}
            change_history.append(history_object)
            continue
        else:
            encountered_courses[course[0]] = True

        # Add prerequisites
        if course[0] in prerequisites_by_course:
            course_object["coursePrerequisites"] = prerequisites_by_course[course[0]]
        else:
            course_object["coursePrerequisites"] = ["None"]

        # Add to corresponding list
        if course[-1] is True:
            response["studentOutline"]["requiredCourses"].append(course_object)
        else:
            response["studentOutline"]["electiveCourses"].append(course_object)


    response["changeHistory"] = change_history
    return response


class StudentMajorOutline:
    validationSchema = {
        "title": "studentMajorOutline",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "studentMajorOutline"},
            "userId": {"type": "integer"},
            "sessionId": {"type": "string"}
        },
        "required": ["sessionId", "userId"]
    }

    def execute_query(self, requestJson):
        with app.app_context():
            # Get all the querying elements
            student_id = requestJson["userId"]
            major_department = db.session.query(Student.id, Student.name, Student.major, Departments.id, Departments.name) \
                .join(ProgramOutline, Student.id == ProgramOutline.student_id) \
                .join(Programs, ProgramOutline.program_id == Programs.id) \
                .join(Departments, Programs.department_id == Departments.id) \
                .filter(Student.id == student_id) \
                .first()

            # Get major completed units
            major_completed_units = db.session.query(func.sum(StudentGrades.earned_credits)) \
                .join(CoursePerSemester, StudentGrades.course_sem_id == CoursePerSemester.id) \
                .join(CourseByOutline, CoursePerSemester.course_id == CourseByOutline.course_id) \
                .filter(StudentGrades.student_id == student_id) \
                .first()

            # Get all courses on outline
            required_courses = db.session.query(Courses.id, Courses.title,
                                                CourseByOutline.change_date,
                                                CourseByOutline.course_status,
                                                Courses.name, ProgramCourses.is_required) \
                .select_from(ProgramOutline) \
                .join(CourseByOutline, ProgramOutline.id == CourseByOutline.outline_id) \
                .join(ProgramCourses, CourseByOutline.course_id == ProgramCourses.course_id) \
                .join(Courses, ProgramCourses.course_id == Courses.id) \
                .filter(ProgramOutline.student_id == student_id) \
                .order_by(CourseByOutline.id.desc()) \
                .all()

            course_ids = [ids[0] for ids in required_courses]

            # Get prerequs for each course type
            course_prerequisites = db.session.query(CoursePrerequisites.course_id, Courses.title) \
                .select_from(CoursePrerequisites) \
                .join(Courses, CoursePrerequisites.prereq_id == Courses.id) \
                .filter(CoursePrerequisites.course_id.in_(course_ids)) \
                .all()

            return create_response_json(major_department, major_completed_units, required_courses, course_prerequisites)
