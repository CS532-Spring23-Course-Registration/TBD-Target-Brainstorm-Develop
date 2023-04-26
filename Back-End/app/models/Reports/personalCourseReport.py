from flask import current_app as app

from app.models.app import *


class PersonalCourseReport:
    validationSchema = {
        "title": "personalCourseReport",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "personalCourseReport"},
            "sessionId": {"type": "string"}
        }
    }

    def execute_query(self, requestJson):
        with app.app_context():
            return "We're here", 200

    def create_response_json(self):
        return
