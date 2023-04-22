from flask import request, jsonify
from app import create_app
from app.utils import db_service
from app.models.app import Users, app
from flask_cors import CORS

import secrets

(app, cache, db) = create_app()
CORS(app)

# Define a function to generate a new session key using the secrets module
def generate_session_key():
    return secrets.token_hex(16)

# Define a memoized function that retrieves or generates a session key for a user and caches it using Flask-Caching
@cache.memoize(timeout=6000)
def get_user_session_key(user_id):
    session_key = generate_session_key()
    # Store the session key in the cache with the user_id as the key
    cache.set(session_key, user_id)
    return session_key

# Define the login endpoint that authenticates a user and returns a session key
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    print()
    # user = Users.get_user_by_username(username)
    if username == "adminFaculty" and password == "admin":
        return jsonify({'sessionId': get_user_session_key(123), \
                        'userId': get_user_session_key(0), \
                        'userName': 'userStudent', \
                        'permission': 'faculty'}), 200
    elif username == "adminStudent" and password == "admin":
        return jsonify({'sessionId': get_user_session_key(1234), \
                        'userId': get_user_session_key(1), \
                        'userName': 'userStudent', \
                        'permission': 'student'}), 200
    elif username == "adminAdmin" and password == "admin":
        return jsonify({'sessionId': get_user_session_key(1235), \
                        'userId': get_user_session_key(2), \
                        'userName': 'userAdmin', \
                        'permission': 'admin'}), 200
    # Retrieve or generate a session key for the user and return it to the client
    # session_key = get_user_session_key(user.id)
    return jsonify({'session_key': "test_key"}), 200

@app.route('/query', methods=['POST'])
def query():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        request_json = request.get_json()
        session_key = request_json['sessionId']
        if not session_key:
            return jsonify({'message': 'Session key is missing'}), 401
        user_id = cache.get(session_key)
        if not user_id:
            return jsonify({'message': 'Invalid session key'}), 401
        return db_service.getData(request_json)
    else:
        return jsonify({'message': 'Content-Type not supported!'}), 401

# Define the PUT endpoint that requires a valid session key
@app.route('/', methods=['PUT'])
def put():
    session_key = request.headers.get('Authorization')
    if not session_key:
        return jsonify({'message': 'Session key is missing'}), 401
    user_id = cache.get(session_key)
    if not user_id:
        return jsonify({'message': 'Invalid session key'}), 401
    cache.set(session_key, user_id, timeout=600)
    return "Put complete"

# Define the DELETE endpoint that requires a valid session key
@app.route('/', methods=['DELETE'])
def delete():
    session_key = request.headers.get('Authorization')
    if not session_key:
        return jsonify({'message': 'Session key is missing'}), 401
    user_id = cache.get(session_key)
    if not user_id:
        return jsonify({'message': 'Invalid session key'}), 401
    cache.set(session_key, user_id, timeout=600)
    return "Delete complete"

# Define a default route that returns a 400 error
@app.route('/')
def index():
    return "Record not found", 400

def generate_test_session_key(user_id):
    session_key = generate_session_key()
    cache.set(session_key, user_id)
    return session_key

def test():
    db_service.executeQuery({})

if __name__ == '__main__':
    app.run(debug=True)
    test()
