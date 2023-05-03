from flask import current_app as app

from app.models.app import *


class ChangeGrade:
    validationSchema = {
        "title": "changeGrade",
        "type": "object",
        "properties": {
            "updateType": {"type": "string", "const": "changeGrade"},
            "sessionId": {"type": "string"},
            "newStatus": {
                "type": "string",
                "enum": [
                    "A",
                    "B",
                    "C",
                    "D",
                    "F"
                ]
            },
            "newNote": {"type": "string"},
            "studentId": {"type": "integer"},
            "courseSemesterId": {"type": "integer"},
        },
        "required": ["sessionId", "newStatus", "newNote", "studentId", "courseSemesterId"]
    }

    def execute_query(self, request_json):
        with app.app_context():
            student_id = request_json["studentId"]
            course_id = request_json["courseSemesterId"]
            new_status = request_json["newStatus"]
            new_note = request_json["newNote"]
            return StudentGrades.change_student_grade(student_id, course_id, new_status, new_note)
