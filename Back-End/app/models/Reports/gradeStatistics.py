from flask import current_app as app, jsonify

from app.models.app import *


class GradeStatistics:
    validationSchema = {
        "title": "gradeStatistics",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "gradeStatistics"},
            "sessionId": {"type": "string"},
            "granularity": {
                "type": "string",
                "enum": [
                    "course",
                    "department",
                    "university"
                ]
            },
            "department": {"type": "string"},
            "course": {"type": "string"}
        },
        "required": ["sessionId", "granularity"]
    }

    def execute_query(self, requestJson):
        with app.app_context():
            return jsonify({"message": "We're here"})

    def create_response_json(self):
        return
