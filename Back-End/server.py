from flask import request, jsonify
from .utils import create_app

app = create_app()

@app.route('/', methods=['GET'])
def get():
    return "Get has been completed"

@app.route('/', methods=['PUT'])
def put():
    return "Put complete"

@app.route('/', methods=['DELETE'])
def delete():
    return "Delete complete"

@app.route('/')
def index():
    return "Record not found", 400

