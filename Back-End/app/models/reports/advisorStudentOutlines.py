from flask import current_app as app, jsonify

from app.models.app import *


class AdvisorStudentOutlines:
    validationSchema = {
        "title": "advisorStudentOutlines",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "advisorStudentOutlines"},
            "userId": {"type": "integer"},
            "sessionId": {"type": "string"}
        },
        "required": ["sessionId", "userId"]
    }

    def execute_query(self, requestJson):
        with app.app_context():
            return jsonify({"message": "We're here"})

    def create_response_json(self):
        return
