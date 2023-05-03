from flask import current_app as app

from app.models.app import *


class ChangeOutline:
    validationSchema = {
        "title": "changeOutline",
        "type": "object",
        "properties": {
            "updateType": {"type": "string", "const": "changeOutline"},
            "sessionId": {"type": "string"},
            "newStatus": {
                "type": "string",
                "enum": [
                    "Approved",
                    "Dropped",
                    "Waived"
                ]
            },
            "studentId": {"type": "integer"},
            "courseId": {"type": "integer"}
        },
        "required": ["sessionId", "newStatus", "studentId", "courseId"]
    }

    def execute_query(self, request_json):
        with app.app_context():
            course_id = request_json["courseId"]
            new_status = request_json["newStatus"]
            outline = ProgramOutline.query.filter_by(student_id=request_json["studentId"]).first()
            return CourseByOutline.change_course_status(outline.id, course_id, new_status)
