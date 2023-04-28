from flask import current_app as app

from app.models.app import *


class Users:
    validationSchema = {
        "title": "users",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "users"},
            "sessionId": {"type": "string"},
            "granularity": {
                "type": "string",
                "enum": [
                    "user",
                    "admin",
                    "faculty",
                    "student"
                ]
            }
        },
        "required": ["sessionId", "granularity"]
    }

    def execute_query(self, requestJson):
        with app.app_context():
            return "We're here", 200

    def create_response_json(self):
        return
