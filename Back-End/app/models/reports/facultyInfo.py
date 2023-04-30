from flask import current_app as app, jsonify

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
            "department": {"type": "string"},
            "faculty": {"type": "string"}
        },
        "required": ["sessionId", "reportFilters"]
    }

    def execute_query(self, requestJson):
        with app.app_context():
            return jsonify({"message": "We're here"})

    def create_response_json(self):
        return
