from flask import current_app as app, jsonify

from app.models.app import *


class CoursesByMajor:
    validationSchema = {
        "title": "coursesByMajor",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "coursesByMajor"},
            "major": {"type": "string"},
            "sessionId": {"type": "string"}
        },
        "required": ["sessionId", "major"]
    }

    def execute_query(self, requestJson):
        with app.app_context():
            return jsonify({"message": "We're here"})

    def create_response_json(self):
        return
