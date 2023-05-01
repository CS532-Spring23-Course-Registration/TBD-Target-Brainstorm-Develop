from flask import current_app as app, jsonify
from app.models.app import *


def create_response_json(faculty_courses_list, student_list):
    course_list_fields = ["courseId", "courseTitle", "courseName", "courseSchedule", "courseUnits"]
    student_list_fields = ["studentId", "studentName", "major", "minor", "courseGrade"]

    # Organize students by course
    student_by_course = {}
    for student in student_list:
        student_object = {key: val for key, val in zip(student_list_fields, student[:-1])}
        course_id = student[-1]
        if course_id in student_by_course:
            student_by_course[course_id].append(student_object)
        else:
            student_by_course[course_id] = [student_object]

    # Package students by course into response json
    response = {"courseList": []}
    for course in faculty_courses_list:
        course_list_object = {key: val for key, val in zip(course_list_fields, course[:-1])}
        course_id = course[-1]
        if course_id in student_by_course:
            course_list_object["studentList"] = student_by_course[course_id]
        else:
            course_list_object["studentList"] = ["None"]
        response["courseList"].append(course_list_object)

    return response


class CourseGradesList:
    validationSchema = {
        "title": "courseGradesList",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "courseGradesList"},
            "sessionId": {"type": "string"},
            "facultyId": {"type": "integer"},
            "courseSemester": {"type": "string"}
        },
        "required": ["sessionId", "facultyId", "courseSemester"]
    }

    def execute_query(self, requestJson):
        with app.app_context():
            # Get courses professor teaches
            faculty_courses_list = db.session.query(Courses.id, Courses.title, Courses.name,
                                                    CoursePerSemester.course_date_time,
                                                    Courses.num_units, CoursePerSemester.id) \
                .join(CoursePerSemester, Courses.id == CoursePerSemester.course_id) \
                .filter(CoursePerSemester.faculty_id == requestJson["facultyId"]) \
                .filter(CoursePerSemester.course_semester == requestJson["courseSemester"]) \
                .all()

            # Get students signed up for those courses
            course_sem_id_list = [course[-1] for course in faculty_courses_list]
            student_list = db.session.query(Student.id, Student.name, Student.major, Student.minor,
                                            StudentGrades.grade, Enrollment.course_sem_id) \
                .join(Enrollment, Student.id == Enrollment.student_id) \
                .join(StudentGrades, Enrollment.student_id == StudentGrades.student_id) \
                .filter(Enrollment.course_sem_id.in_(course_sem_id_list)) \
                .group_by(Student.id, Enrollment.course_sem_id) \
                .all()
            return create_response_json(faculty_courses_list, student_list)
