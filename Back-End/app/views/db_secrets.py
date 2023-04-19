from flask import Blueprint
from  ..utils import get_secrets

db_secrets = Blueprint('secrets', __name__)

@db_secrets.route('/db_access_key')
def db_access_key():
    db_access_key = get_secrets.get_db_secret()
    if db_access_key is None:
        return {
            'db_secret': 'error',
            'status': 401
        }
    return {
        'db_secret': db_access_key,
        'status': 200
    }