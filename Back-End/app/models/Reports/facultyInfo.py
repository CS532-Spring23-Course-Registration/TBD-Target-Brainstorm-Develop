from flask import current_app as app

from app.models.app import *


class FacultyInfo:
    validationSchema = {
        "title": "facultyInfo",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "facultyInfo"},
            "sessionId": {"type": "string"},
            "reportFilters": {
                "type": "string",
                "enum": [
                    "allFacultyAllDepartments",
                    "allFacultyByDepartment",
                    "specificFaculty"
                ]
            },
            "departmentId": {"type": "integer"},
            "facultyId": {"type": "string"}
        },
        "required": ["sessionId", "reportFilters"]
    }

    def execute_query(self, requestJson):
        with app.app_context():
            return "We're here", 200

    def create_response_json(self):
        return
