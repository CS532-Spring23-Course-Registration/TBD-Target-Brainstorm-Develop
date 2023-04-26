from flask import current_app as app
from sqlalchemy import text

from app.models.app import *


class StudentInfo:
    validationSchema = {
        "title": "studentInfo",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "studentInfo"},
            "sessionId": {"type": "string"}
        }
    }

    def execute_query(self, requestJson):
        with app.app_context():
            db_data = db.session.execute(text("""select s.*, s2.id, c.name, c.title ,s2.grade, c.is_external_course,s2.course_notes 
                                            from student s 
                                            inner join studentgrades s2 
                                                on s.id = s2.student_id, 
                                            courses c 
                                            where s2.id = c.id and s.id = 1;"""))
            return db_data, 200

    def create_response_json(self):
        return
