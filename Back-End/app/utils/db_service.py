import json
import os
from jsonschema import validate, ValidationError
from flask import jsonify
from sqlalchemy import select, func, desc, asc

from app.models.app import app as db_session
from app.models.app import *

path = os.path.realpath(__file__)
dir = os.path.dirname(path).replace('utils', 'models/Reports')
os.chdir(dir)

def getData(requestJson):
    # Check if report is valid
    try:
        validationSchema = json.loads(open(requestJson["reportName"] + ".json", 'r').read())
        validate(requestJson, validationSchema)
    except ValidationError as e:
        return jsonify({'error': e.message}), 401
    except FileNotFoundError as e:
        return jsonify({'error': "Incorrect report name " + requestJson.get('reportName')}), 401

    # dbQuery = generateSql(requestJson)
    return jsonify({'message': 'Json was correctly validated'})


def generateSql(reportJson):
    # Validate sessionId
    # with db_session.app_context():
    #     students = Test.query.all()
    #     print(students)
    return None


def executeQuery(query):
    return None
