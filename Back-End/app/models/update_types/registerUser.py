from flask import current_app as app

from app.models.app import *


class RegisterUser:
    validationSchema = {
        "title": "registerUser",
        "type": "object",
        "properties": {
            "updateType": {"type": "string", "const": "registerUser"},
            "username": {"type": "string"},
            "name": {"type": "string"},
            "password": {"type": "string"},
            "jobTitle": {"type": "string"},
            "officeNumber": {"type": "string"},
            "officeHours": {"type": "string"},
            "assignedDepartment": {"type": "string"},
            "phoneNumber": {"type": "string"},
            "address": {"type": "string"},
            "dateOfBirth": {"type": "string"},
            "major": {"type": "string"},
            "minor": {"type": "string"},
            "permissions": {"type": "string"}
        },
        "required": ["sessionId", "username", "name", "jobTitle", "password", "permissions"],
        "dependentSchemas": {
            "faculty": {"required": ["officeNumber", "officeHours", "assignedDepartment"]},
            "student": {"required": ["phoneNumber", "address", "dateOfBirth", "major", "minor"]}
        }
    }

    def execute_query(self, request_json):
        with app.app_context():
            permission = request_json["permissions"]
            job_title = request_json["jobTitle"]
            username = request_json["username"]
            name = request_json["name"]
            password = request_json["password"]
            if Users.query.filter_by(username=username).first() is not None:
                return jsonify({"error": "There is already a user with the username {}".format(username)})
            else:
                if permission == "admin":
                    return Users.create(username, name, password, job_title, permission)
                elif permission == "student":
                    phone_number = request_json["phoneNumber"]
                    address = request_json["address"]
                    date_of_birth = request_json["dateOfBirth"]
                    major = request_json["major"]
                    minor = request_json["minor"]
                    new_student = Student.create(name, phone_number, address, date_of_birth, major, minor)

                    # program with the same name and grab id
                    program_name = '%' + major + '%'
                    program = db.session.query(Programs.id).filter(Programs.name.like(program_name)).first()
                    faculty = Faculty.query.first()
                    ProgramOutline.create(new_student.id, program[0], faculty.id)
                    return Users.create_from_id(new_student.id, username, password)
                else:
                    return
