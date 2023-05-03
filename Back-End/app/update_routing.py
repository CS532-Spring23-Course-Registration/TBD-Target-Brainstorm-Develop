from flask import Blueprint, request
from flask import jsonify
from jsonschema import validate, ValidationError
from flask import current_app as app
from app.models.app import *

from app.models.update_types.dropFromCourse import DropFromCourse
from app.models.update_types.registerForCourse import RegisterForCourse
from app.models.update_types.changePassword import ChangePassword

updates = Blueprint('updates', __name__)


def getData(requestJson, reportToExecute):
    try:
        errorsInJson = validate(requestJson, reportToExecute.validationSchema)
        if errorsInJson is None:
            return reportToExecute.execute_query(requestJson)
    except ValidationError as e:
        return jsonify({'error': e.message})
    except KeyError as e:
        return jsonify({'error': "KeyError occurred with field " + str(e)})
    except Exception as e:
        return jsonify({'error': str(e)})


@updates.route('/update/registerForCourse', methods=['PUT'])
def registerForCourse():
    return getData(request.get_json(), RegisterForCourse())


@updates.route('/update/dropFromCourse', methods=['PUT'])
def dropFromCourse():
    return getData(request.get_json(), DropFromCourse())

@updates.route('/update/changePassword', methods=['PUT'])
def changePassword():
    return getData(request.get_json(), ChangePassword())

