from flask import current_app as app

from app.models.app import *


class CoursesByMajor:
    validationSchema = {
        "title": "coursesByMajor",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "coursesByMajor"},
            "major": {"type": "string"},
            "sessionId": {"type": "string"}
        }
    }

    def execute_query(self, requestJson):
        with app.app_context():
            return "We're here", 200

    def create_response_json(self):
        return
