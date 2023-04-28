from flask import current_app as app
from sqlalchemy import text

from app.models.app import *


class StudentInfo:
    validationSchema = {
        "title": "studentInfo",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "studentInfo"},
            "sessionId": {"type": "string"},
            "studentId": {"type": "integer"}
        },
        "required": ["sessionId", "studentId"]
    }

    def execute_query(self, requestJson):
        with app.app_context():
            courses_query = "select c.id, c.name, c.title, grades.grade, c.is_external_course from studentgrades grades" + \
                                " inner join coursepersemester cps on grades.course_sem_id = cps.id" + \
                                " inner join courses c on cps.course_id = c.id" + \
                            " where c.id = cps.course_id" + \
                            " and student_id = {studentId:n};"
            student_info_query = "select * from student where id = {studentId:n};"
            user_id = requestJson["studentId"]
            course_data = db.session.execute(text(courses_query.format(studentId=user_id))).all()
            student_data = db.session.execute(text(student_info_query.format(studentId=user_id))).all()
            return self.create_response_json(course_data, student_data[0]), 200

    def create_response_json(self, course_data, student_data):
        student_data_fiels = ["id", "name", "phoneNumber", "address", "dateOfBirth", "major", "minor"]
        course_data_fields = ["id", "name", "title", "grade", "is_external_course"]
        response = {student_data_fiels[x]: student_data[x] for x in range(len(student_data))}
        course_list = [{course_data_fields[x]: course[x] for x in range(len(course))} for course in course_data]
        response["courses"] = course_list
        return response
