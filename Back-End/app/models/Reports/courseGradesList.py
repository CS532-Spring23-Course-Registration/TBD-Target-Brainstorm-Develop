from flask import current_app as app
from app.models.app import *


class CourseGradesList:
    validationSchema = {
        "title": "courseGradesList",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "courseGradesList"},
            "sessionId": {"type": "string"},
            "course": {"type": "string"}
        }
    }

    def executeQuery(self, requestJson):
        with app.app_context():
            return "We're here", 200

    def createResponseJson(self):
        return
