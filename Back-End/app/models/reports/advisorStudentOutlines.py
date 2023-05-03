from flask import current_app as app, jsonify

from app.models.app import *
from app.models.reports.studentMajorOutline import StudentMajorOutline

class AdvisorStudentOutlines:
    validationSchema = {
        "title": "advisorStudentOutlines",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "advisorStudentOutlines"},
            "userId": {"type": "integer"},
            "sessionId": {"type": "string"}
        },
        "required": ["sessionId", "userId"]
    }

    def execute_query(self, requestJson):
        with app.app_context():
            # Get list of students that faculty advises
            student_list = db.session.query(ProgramOutline.student_id) \
                .join(Faculty, ProgramOutline.approver_id == Faculty.id) \
                .filter(Faculty.id == requestJson["userId"]) \
                .all()

            # Generate studentMajorOutline for each student
            extracted_student_list = [student[0] for student in student_list]
            student_outline_list = []
            for student in extracted_student_list:
                student_outline = StudentMajorOutline().execute_query({"userId": student})
                student_outline_list.append(student_outline)

            if len(student_outline_list) == 0:
                return {"studentList": ["None"]}
            else:
                return {"studentList": student_outline_list}

