from flask import current_app as app, jsonify

from app.models.app import *


class StudentMajorOutline:
    validationSchema = {
        "title": "studentMajorOutline",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "studentMajorOutline"},
            "studentId": {"type": "integer"},
            "sessionId": {"type": "string"}
        },
        "required": ["sessionId", "studentId"]
    }

    def execute_query(self, requestJson):
        with app.app_context():
            return jsonify({"message": "We're here"})

    def create_response_json(self):
        return
