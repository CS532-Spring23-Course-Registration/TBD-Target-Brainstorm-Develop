from flask import current_app as app

from app.models.app import *


class RegisterForCourse:
    validationSchema = {
        "title": "registerForCourse",
        "type": "object",
        "properties": {
            "updateType": {"type": "string", "const": "registerForCourse"},
            "studentId": {"type": "integer"},
            "sessionId": {"type": "string"},
            "courseId": {"type": "integer"},
            "courseSemester": {"type": "string"}
        },
        "required": ["sessionId", "studentId", "courseSemester", "courseId"]
    }

    def execute_query(self, request_json):
        with app.app_context():
            course_semester = CoursePerSemester.query.filter_by(course_id=request_json["courseId"],
                                                                course_semester=request_json["courseSemester"]
                                                                ).first()
            return Enrollment.add_student_to_course(request_json["studentId"], course_semester.id)
