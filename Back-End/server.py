from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache
import secrets

#This is a test DB. Change after actual DB has been created
from test import User

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'flask_caching.backends.SimpleCache'})# Initialize Flask-Caching

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = secrets.token_hex(16) # Secret key used to sign session cookies

db = SQLAlchemy(app) # Initialize SQLAlchemy


# Define a function to generate a new session key using the secrets module
def generate_session_key():
    return secrets.token_hex(16)

# Define a memoized function that retrieves or generates a session key for a user and caches it using Flask-Caching
@cache.memoize(timeout=600)
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
    user = User.get_user_by_username(username)
    if not user or user.password != password:
        return jsonify({'message': 'Invalid credentials'}), 401
    # Retrieve or generate a session key for the user and return it to the client
    session_key = get_user_session_key(user.id)
    return jsonify({'session_key': session_key}), 200

# Define the GET endpoint that requires a valid session key
@app.route('/', methods=['GET'])
def get():
    session_key = request.headers.get('Authorization')
    if not session_key:
        return jsonify({'message': 'Session key is missing'}), 401
    user_id = cache.get(session_key)
    if not user_id:
        return jsonify({'message': 'Invalid session key'}), 401
    cache.set(session_key, user_id, timeout=600)
    return "Get has been completed"

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


if __name__ == '__main__':
    app.run(debug=True)