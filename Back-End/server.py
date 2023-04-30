import secrets
from datetime import timedelta

import requests
from flask import jsonify, session
from flask_cors import CORS
from werkzeug.routing import BuildError

from app import create_app
from app.models.app import *

(app, db) = create_app()
CORS(app)

@app.before_request
def before_request():
    app.permanent_session_lifetime = timedelta(minutes=10)

# Define a function to generate a new session key using the secrets module
def generate_session_key():
    return secrets.token_hex(16)


# Define a memoized function that retrieves or generates a session key for a user and caches it using Flask-Caching
def get_user_session_key(user_id):
    session_key = generate_session_key()
    session.clear()
    # Store the session key in the cache with the user_id as the value
    session[session_key] = user_id
    return session_key


# Define the login endpoint that authenticates a user and returns a session key
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    with app.app_context():
        user = db.session.query(Users).filter_by(name=username, password=password).first()
        session_key = get_user_session_key(user.id)
        return jsonify({'sessionId': session_key, \
                        'userId': user.id, \
                        'userName': user.name, \
                        'permission': user.permissions}), 200


@app.route('/query', methods=['POST'])
def query():
    content_type = request.headers.get('Content-Type')
    if content_type == 'application/json':
        request_json = request.get_json()

        # Check that we received a sessionId with request
        session_key = request_json['sessionId']
        if not session_key:
            return jsonify({'message': 'Session has expired'}), 440

        # Validate session key
        if not session[session_key]:
            return jsonify({'message': 'Invalid session key'}), 401

        # Reroute report to appropriate endpoint
        report_endpoint_url = request.host_url[:-1] + app.url_for("reports." + request_json['reportName'])
        data_response = requests.post(report_endpoint_url, json=request_json)
        return data_response.json(), 200
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
