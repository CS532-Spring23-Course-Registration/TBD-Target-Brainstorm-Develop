from flask import current_app as app, jsonify

from app.models.app import *


class PersonalCourseReport:
    validationSchema = {
        "title": "personalCourseReport",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "personalCourseReport"},
            "sessionId": {"type": "string"}
        },
        "required": ["sessionId"]
    }

    def execute_query(self, requestJson):
        with app.app_context():
            return jsonify({"message": "We're here"})

    def create_response_json(self):
        return
