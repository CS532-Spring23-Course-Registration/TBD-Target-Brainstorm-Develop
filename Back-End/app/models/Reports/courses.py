from flask import current_app as app
from sqlalchemy import text

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
        },
        "required": ["sessionId", "reportFilters"]
    }

    def execute_query(self, requestJson):
        with app.app_context():
            department_list = []
            courses_by_department = []

            # Get the department list
            base_department_query = "select * from departments"
            if "AllDepartments" in requestJson["reportFilters"]:
                department_list = db.session.execute(text(base_department_query + ";")).all()
            elif "ByDepartment" in requestJson["reportFilters"]:
                department = requestJson["department"]
                single_department_query = base_department_query +  " where id = "
                if department.isDigit():
                    single_department_query += department
                else:
                    single_department_query += "'" + department + "'"
                department_list = db.session.execute(text(single_department_query)).all()

            # Get the course list for the departments requested
            department_id_list = [department[0] for department in department_list]


    def create_response_json(self):
        return
