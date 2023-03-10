from flask import Blueprint
from get_secrets import _get_db_secret

secrets = Blueprint('secrets', __name__)

@secrets.route('/db_access_key')
def db_access_key():
    db_access_key = _get_db_secret()
    if db_access_key is None:
        return {
            'db_secret': 'error',
            'status': 401
        }
    return {
        'db_secret': db_access_key,
        'status': 200
    }