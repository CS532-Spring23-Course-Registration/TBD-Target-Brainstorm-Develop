from flask import current_app as app, jsonify
from app.models.app import *


class CourseGradesList:
    validationSchema = {
        "title": "courseGradesList",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "courseGradesList"},
            "sessionId": {"type": "string"},
            "course": {"type": "string"}
        },
        "required": ["sessionId", "course"]
    }

    def executeQuery(self, requestJson):
        with app.app_context():
            return jsonify({"message": "We're here"})

    def createResponseJson(self):
        return
