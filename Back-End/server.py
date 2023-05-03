import secrets
from datetime import timedelta

import requests
from flask import jsonify, session, current_app, request
from flask_cors import CORS
from requests import JSONDecodeError
from werkzeug.routing import BuildError
from flask_migrate import Migrate

from app import create_app
from app.models.app import *

(app, cache, db, migrate) = create_app()
CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "supports_credentials": True}})


def validate_session_key(session_key):
    # Validate session key
    user_id = cache.get(session_key)
    if not user_id:
        return jsonify({"error": "Session id has expired"}), 440
    else:
        # Reset session key timeout
        cache.set(session_key, user_id, timeout=600)


# Define a function to generate a new session key using the secrets module
def generate_session_key():
    return secrets.token_hex(16)


# Define a memoized function that retrieves or generates a session key for a user and caches it using Flask-Caching
@cache.memoize(timeout=600)
def get_user_session_key(user_id):
    session_key = generate_session_key()
    # Store the session key in the cache with the user_id as the key
    cache.set(session_key, user_id, timeout=600)

    return session_key


# Define the login endpoint that authenticates a user and returns a session key
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    with app.app_context():
        user = db.session.query(Users).filter_by(name=username, password=password).first()
        session_key = get_user_session_key(user.id)
        response = jsonify({'sessionId': session_key,
                            'userId': user.id,
                            'userName': user.name,
                            'permission': user.permissions})
        return response, 200


@cache.memoize(timeout=2400)
@app.route('/query', methods=['POST'])
def query():
    content_type = request.headers.get('Content-Type')
    if content_type == 'application/json':
        request_json = request.get_json()

        # Check that we received a sessionId with request
        session_key = request_json['sessionId']
        if not session_key:
            return jsonify({'message': 'No session key found'}), 400

        # Validate session key
        validation_response = validate_session_key(session_key)
        if validation_response is not None:
            return validation_response

        # Reroute report to appropriate endpoint
        report_endpoint_url = request.host_url[:-1] + app.url_for("reports." + request_json['reportName'])
        try:
            data_response = requests.post(report_endpoint_url, json=request_json).json()
        except JSONDecodeError:
            return jsonify({"error": "Error when attempting to redirect query request to " + report_endpoint_url}), 404

        # If error occur, return error details
        if "error" in data_response:
            return data_response, 401
        else:
            return data_response, 200
    else:
        return jsonify({'message': 'Content-Type not supported!'}), 401


@app.route('/signup', methods=['POST'])
def signup():
    name = request.json.get('name')
    phone_number = 'placeholder'
    address = request.json.get('address')
    dob = request.json.get('dateOfBirth')
    major = request.json.get('major')
    minor = request.json.get('minor')
    
    with app.app_context():
        s = Student.create(name, phone_number, address, dob, major, minor)
        return jsonify({'id': s.id, \
                        'student_name' : s.name}), 200

@app.route('/departments', methods=['POST'])
def departments():
    with app.app_context():
        department_list = Departments.query().all()
        return jsonify({'departments': department_list}), 200

# Define the PUT endpoint that requires a valid session key
@app.route('/update', methods=['PUT'])
def update():
    content_type = request.headers.get('Content-Type')
    if content_type == 'application/json':
        request_json = request.get_json()

        # Check that we received a sessionId with request
        session_key = request_json['sessionId']
        if not session_key:
            return jsonify({'message': 'No session key found'}), 400

        # Validate session key
        validation_response = validate_session_key(session_key)
        if validation_response is not None:
            return validation_response

        # Reroute report to appropriate endpoint
        update_endpoint_url = request.host_url[:-1] + app.url_for("updates." + request_json['updateType'])
        try:
            data_response = requests.put(update_endpoint_url, json=request_json).json()
        except JSONDecodeError:
            return jsonify({"error": "Error when attempting to redirect update request to " + update_endpoint_url}), 404

        # If error occur, return error details
        if "error" in data_response:
            return data_response, 401
        else:
            return data_response, 200
    else:
        return jsonify({'message': 'Content-Type not supported!'}), 401


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


@app.errorhandler(BuildError)
def catch_server_errors(e):
    if "query" in e.endpoint:
        return jsonify({"error": e.endpoint.replace("query/", "") + " is not a valid report name."}), 404
    else:
        return jsonify({"error": e}), 404


def generate_test_session_key(user_id):
    session_key = generate_session_key()
    session[session_key] = user_id
    return session_key



if __name__ == '__main__':
    app.run(debug=True)
    test()
