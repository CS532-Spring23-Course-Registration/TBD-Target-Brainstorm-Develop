from flask import current_app as app

from app.models.app import *


class ChangePassword:
    validationSchema = {
        "title": "changePassword",
        "type": "object",
        "properties": {
            "updateType": {"type": "string", "const": "changePassword"},
            "userBeingModified": {"type": "integer"},
            "sessionId": {"type": "string"},
            "newPassword": {"type": "string"},
        },
        "required": ["sessionId", "userBeingModified", "newPassword"]
    }

    def execute_query(self, request_json):
        with app.app_context():
            user_id = request_json["userBeingModified"]
            new_password = request_json["newPassword"]
            return Users.change_password(user_id, new_password)
