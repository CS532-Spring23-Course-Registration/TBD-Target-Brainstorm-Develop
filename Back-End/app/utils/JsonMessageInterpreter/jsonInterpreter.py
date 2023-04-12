import json
import os
from jsonschema import validate
from enum import Enum

class JsonSchema(Enum):
    QUERY = "TestJson/query.json"

def convertJsonToObject(jsonString, schema):
    path = os.path.realpath(__file__)
    dir = os.path.dirname(path)

    jsonToValidate = json.loads(jsonString)
    validationSchema = json.loads(open(dir + schema.name, 'r').read())

    try:
        print(validate(jsonToValidate, validationSchema))
        return jsonToValidate
    except:
        print("Error uh oh")
    return {}