from flask import current_app as app, jsonify

from app.models.app import *


class CourseInfo:
    validationSchema = {
        "title": "courseInfo",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "courseInfo"},
            "sessionId": {"type": "string"},
            "reportFilters": {
                "type": "string",
                "enum": [
                    "allCoursesAllDepartments",
                    "allCoursesByDepartment",
                    "specificCourse"
                ]
            },
            "department": {"type": "string"},
            "course": {"type": "string"}
        },
        "required": ["sessionId", "reportFilters"]
    }

    def execute_query(self, requestJson):
        with app.app_context():
            return jsonify({"message": "We're here"})

    def create_response_json(self):
        return
