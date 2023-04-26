from flask import current_app as app
from app.models.app import *


class Courses:
    validationSchema = {
        "title": "courses",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "courses"},
            "sessionId": {"type": "string"},
            "reportFilters": {
                "type": "string",
                "enum": [
                    "allClassesByDepartment",
                    "openClassesByDepartment",
                    "openClassesAllDepartments",
                    "allClassesAllDepartments",
                    "currentlyEnrolled"
                ]
            },
            "department": {"type": "string"},
            "studentId": {"type": "integer"}
        }
    }

    def execute_query(self, requestJson):
        with app.app_context():
            return "We're here", 200

    def create_response_json(self):
        return
