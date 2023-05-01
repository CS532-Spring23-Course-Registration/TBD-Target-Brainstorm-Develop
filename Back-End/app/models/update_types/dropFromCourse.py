from flask import current_app as app, jsonify
from sqlalchemy import text
from app.models.app import *


def is_enrolled(student_id, course_semester_id):
    with app.app_context():
        enrollment = db.session.execute(text("select * from enrollment "
                                             " where student_id = " + str(student_id) +
                                             " and course_sem_id = " + str(course_semester_id) +
                                             ";")
                                        ).all()
        return len(enrollment) != 0


class DropFromCourse:
    validationSchema = {
        "title": "dropFromCourse",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "dropFromCourse"},
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
            return Enrollment.drop_student_from_course(request_json["studentId"], course_semester.id)






