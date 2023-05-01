from flask import current_app as app, jsonify
from sqlalchemy import or_

from app.models.app import *

department_list_fields = ["departmentId", "departmentName"]
course_list_fields = ["courseId", "courseTitle", "courseName", "courseDescription", "courseUnits"]


def create_response_json(course_list, department_list):
    response = {"departmentList": []}

    courses_by_department = {}
    for course in course_list:
        department_id = course[-1]
        course_object = {key: val for key, val in zip(course_list_fields, course[:-1])}
        if department_id in courses_by_department:
            courses_by_department[department_id].append(course_object)
        else:
            courses_by_department[department_id] = [course_object]

    for department in department_list:
        department_id = department[0]
        department_object = {key: val for key, val in zip(department_list_fields, department)}
        if department_id in courses_by_department:
            department_object["courseList"] = courses_by_department[department_id]
        else:
            department_object["courseList"] = ["None"]
        response["departmentList"].append(department_object)
    return response


class CourseInfo:
    validationSchema = {
        "title": "courseInfo",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "courseInfo"},
            "sessionId": {"type": "string"},
            "reportFilters": {
                "type": "string",
                "enum": [
                    "allCoursesAllDepartments",
                    "allCoursesByDepartment",
                    "specificCourse"
                ]
            },
            "department": {"type": "string"},
            "course": {"type": "string"}
        },
        "required": ["sessionId", "reportFilters"],
        "dependentSchemas": {
            "specificCourse": {"required": ["course"]},
            "allCoursesAllDepartments": {"required": ["department"]},
            "allCoursesByDepartment": {"required": ["department"]}
        }
    }

    def execute_query(self, requestJson):
        with app.app_context():
            filter_type = requestJson["reportFilters"]

            if filter_type == "specificCourse":
                return get_specific_course_data(requestJson)
            else:
                if filter_type == "allCoursesByDepartment":
                    return get_courses_by_department(requestJson)
                elif filter_type == "allCoursesAllDepartments":
                    course_list = db.session.query(Courses.id, Courses.title, Courses.name,
                                                   Courses.description, Courses.description,
                                                   Courses.department_id) \
                        .all()
                    department_list = db.session.query(Departments.id, Departments.name).all()
                    return create_response_json(course_list, department_list)


def get_specific_course_data(requestJson):
    course = requestJson["course"]

    if course.isdigit():
        specific_course = db.session.query(Courses.id, Courses.title, Courses.name,
                                           Courses.description, Courses.description,
                                           Departments.id, Departments.name) \
            .join(Departments, Courses.department_id == Departments.id) \
            .filter(Courses.id == int(course)) \
            .first()
        department = {key: val for key, val in zip(department_list_fields, specific_course[-2:])}
        course = {key: val for key, val in zip(course_list_fields, specific_course[:-2])}
        department["courseList"] = course
        return {"departmentList": [department]}
    else:
        course_name = '%' + course + '%'
        filter_by_name_or_title = or_(Courses.name.like(course_name), Courses.title.like(course_name))
        course_list = db.session.query(Courses.id, Courses.title, Courses.name,
                                       Courses.description, Courses.description,
                                       Departments.id) \
            .join(Departments, Courses.department_id == Departments.id) \
            .filter(filter_by_name_or_title) \
            .all()

        department_id_list = [course[-1] for course in course_list]
        department_list = db.session.query(Departments.id, Departments.name) \
            .filter(Departments.id.in_(department_id_list)) \
            .all()
        return create_response_json(course_list, department_list)


def get_courses_by_department(requestJson):
    department = requestJson["department"]

    if department.isdigit():
        department_list = db.session.query(Departments.id, Departments.name) \
            .filter(Departments.id == int(department)) \
            .first()
        courses_list = db.session.query(Courses.id, Courses.title, Courses.name,
                                        Courses.description, Courses.description,
                                        Courses.department_id)\
            .filter(Courses.department_id == department_list[0]) \
            .all()
        return create_response_json(courses_list, [department_list])
    else:
        department_name = '%' + department + '%'
        department_list = db.session.query(Departments.id, Departments.name) \
            .filter(Departments.name.like(department_name)) \
            .all()

        department_id_list = [dept[0] for dept in department_list]
        courses_list = db.session.query(Courses.id, Courses.title, Courses.name,
                                        Courses.description, Courses.description,
                                        Courses.department_id) \
            .filter(Courses.department_id.in_(department_id_list)) \
            .all()
        return create_response_json(courses_list, department_list)
