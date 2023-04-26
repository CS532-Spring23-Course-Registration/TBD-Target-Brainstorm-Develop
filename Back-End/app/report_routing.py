from flask import Blueprint, request
from flask import jsonify
from jsonschema import validate, ValidationError

from app.models.reports.courseGradesList import CourseGradesList
from app.models.reports.courseInfo import CourseInfo
from app.models.reports.courses import Courses
from app.models.reports.coursesByMajor import CoursesByMajor
from app.models.reports.facultyInfo import FacultyInfo
from app.models.reports.gradeStatistics import GradeStatistics
from app.models.reports.personalCourseReport import PersonalCourseReport
from app.models.reports.studentInfo import StudentInfo
from app.models.reports.studentMajorOutline import StudentMajorOutline
from app.models.reports.users import Users

reports = Blueprint('reports', __name__)

def getData(requestJson, reportToExecute):
    try:
        errorsInJson = validate(requestJson, reportToExecute.validationSchema)
        if errorsInJson is None:
            # return reportToExecute.execute_query(requestJson), 200
            return jsonify({'message': "Validation done"}), 401
    except ValidationError as e:
        return jsonify({'error': e.message}), 401

@reports.route('/query/courseGradesList', methods=['POST'])
def courseGradesList():
    return getData(request.get_json(), CourseGradesList())

@reports.route('/query/courseInfo', methods=['POST'])
def courseInfo():
    return getData(request.get_json(), CourseInfo())

@reports.route('/query/courses', methods=['POST'])
def courses():
    return getData(request.get_json(), Courses())

@reports.route('/query/coursesByMajor', methods=['POST'])
def coursesByMajor():
    return getData(request.get_json(), CoursesByMajor())

@reports.route('/query/facultyInfo', methods=['POST'])
def facultyInfo():
    return getData(request.get_json(), FacultyInfo())

@reports.route('/query/gradeStatistics', methods=['POST'])
def gradeStatistics():
    return getData(request.get_json(), GradeStatistics())

@reports.route('/query/personalCourseReport', methods=['POST'])
def personalCourseReport():
    return getData(request.get_json(), PersonalCourseReport())

@reports.route('/query/studentInfo', methods=['POST'])
def studentInfo():
    return getData(request.get_json(), StudentInfo())

@reports.route('/query/studentMajorOutline', methods=['POST'])
def studentMajorOutline():
    return getData(request.get_json(), StudentMajorOutline())

@reports.route('/query/users', methods=['POST'])
def users():
    return getData(request.get_json(), Users())
