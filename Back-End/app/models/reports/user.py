from flask import current_app as app, jsonify

from app.models.app import *


def create_response_json(user_list):
    user_list_fields = ["userId", "username", "jobTitle", "permissions"]
    return {"userList": {key: val for key, val in zip(user_list_fields, user)} for user in user_list}


class User:
    validationSchema = {
        "title": "users",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "users"},
            "sessionId": {"type": "string"},
            "granularity": {
                "type": "string",
                "enum": [
                    "user",
                    "admin",
                    "faculty",
                    "student"
                ]
            }
        },
        "required": ["sessionId", "granularity"]
    }

    def execute_query(self, requestJson):
        with app.app_context():
            user_type = requestJson["granularity"]
            user_list = []
            if user_type == "user":
                user_list = db.session.query(Users.id, Users.name, Users.job_title, Users.permissions).all()
            else:
                user_list = db.session.query(Users.id, Users.name, Users.job_title, Users.permissions) \
                    .filter(Users.permissions == user_type) \
                    .all()

            return create_response_json(user_list)
