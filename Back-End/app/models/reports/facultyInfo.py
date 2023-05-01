from flask import current_app as app, jsonify
from sqlalchemy import or_

from app.models.app import *

department_list_fields = ["departmentId", "departmentName"]
faculty_list_fields = ["facultyId", "facultyTitle", "facultyName", "phoneNumber", "officeNumber", "officeHours"]


def create_response_json(faculty_list, department_list, teaching_department_list):
    response = {"departmentList": []}

    faculty_teaching_department = {}
    for td in teaching_department_list:
        faculty_id = td[0]
        if faculty_id in faculty_teaching_department:
            faculty_teaching_department[faculty_id].append(td[1])
        else:
            faculty_teaching_department[faculty_id] = [td[1]]

    faculty_by_department = {}
    for faculty in faculty_list:
        department_id = faculty[-1]
        faculty_id = faculty[0]
        faculty_object = {key: val for key, val in zip(faculty_list_fields, faculty[:-1])}

        # Add teaching departments to each faculty member
        if faculty_id in faculty_teaching_department:
            faculty_object["teachingDepartments"] = faculty_teaching_department[faculty_id]
        else:
            faculty_object["teachingDepartments"] = ["None"]

        # Group faculty up by departments
        if department_id in faculty_by_department:
            faculty_by_department[department_id].append(faculty_object)
        else:
            faculty_by_department[department_id] = [faculty_object]

    for department in department_list:
        department_id = department[0]
        department_object = {key: val for key, val in zip(department_list_fields, department)}
        if department_id in faculty_by_department:
            department_object["facultyList"] = faculty_by_department[department_id]
        else:
            department_object["facultyList"] = ["None"]
        response["departmentList"].append(department_object)
    return response


class FacultyInfo:
    validationSchema = {
        "title": "facultyInfo",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "facultyInfo"},
            "sessionId": {"type": "string"},
            "reportFilters": {
                "type": "string",
                "enum": [
                    "allFacultyAllDepartments",
                    "allFacultyByDepartment",
                    "specificFaculty"
                ]
            },
            "department": {"type": "string"},
            "faculty": {"type": "string"}
        },
        "required": ["sessionId", "reportFilters"],
        "dependentSchemas": {
            "specificFaculty": {"required": ["faculty"]},
            "allFacultyByDepartment": {"required": ["department"]}
        }
    }

    def execute_query(self, requestJson):
        with app.app_context():
            filter_type = requestJson["reportFilters"]

            if filter_type == "specificFaculty":
                return get_specific_faculty_data(requestJson)
            else:
                if filter_type == "allFacultyByDepartment":
                    return get_faculty_by_department(requestJson)
                elif filter_type == "allFacultyAllDepartments":
                    department_list = db.session.query(Departments.id, Departments.name).all()
                    faculty_list = db.session.query(Faculty.id, Faculty.position_title, Faculty.name,
                                                    Faculty.phone_number, Faculty.office_number,
                                                    Faculty.office_hours, Departments.id) \
                        .join(Departments, Faculty.assigned_department == Departments.id).all()
                    teaching_department_list = db.session.query(FacultyTeachingDepartments.faculty_id,
                                                                Departments.name) \
                        .join(Departments, FacultyTeachingDepartments.department_id == Departments.id) \
                        .all()
                    return create_response_json(faculty_list, department_list, teaching_department_list)


def get_specific_faculty_data(requestJson):
    faculty = requestJson["faculty"]

    if faculty.isdigit():
        specific_faculty = db.session.query(Faculty.id, Faculty.position_title, Faculty.name,
                                            Faculty.phone_number, Faculty.office_number,
                                            Faculty.office_hours, Departments.id, Departments.name) \
            .join(Departments, Faculty.assigned_department == Departments.id) \
            .filter(Faculty.id == int(faculty)) \
            .first()

        teaching_departments_list = db.session.query(Departments.name) \
            .select_from(FacultyTeachingDepartments) \
            .join(Departments, FacultyTeachingDepartments.department_id == Departments.id) \
            .filter(FacultyTeachingDepartments.faculty_id == specific_faculty[0]) \
            .all()
        department = {key: val for key, val in zip(department_list_fields, specific_faculty[-2:])}
        faculty = {key: val for key, val in zip(faculty_list_fields, specific_faculty[:-2])}
        teaching_departments = [department[0] for department in teaching_departments_list]
        faculty["teachingDepartments"] = teaching_departments
        department["facultyList"] = faculty
        return {"departmentList": [department]}
    else:
        faculty_name = '%' + faculty + '%'
        faculty_list = db.session.query(Faculty.id, Faculty.position_title, Faculty.name,
                                        Faculty.phone_number, Faculty.office_number,
                                        Faculty.office_hours, Departments.id) \
            .join(Departments, Faculty.assigned_department == Departments.id) \
            .filter(Faculty.name.like(faculty_name)) \
            .all()

        department_id_list = [faculty[-1] for faculty in faculty_list]
        department_list = db.session.query(Departments.id, Departments.name) \
            .filter(Departments.id.in_(department_id_list)) \
            .all()

        faculty_id_list = [faculty[0] for faculty in faculty_list]
        teaching_department_list = db.session.query(FacultyTeachingDepartments.faculty_id, Departments.name) \
            .join(Departments, FacultyTeachingDepartments.department_id == Departments.id) \
            .filter(FacultyTeachingDepartments.faculty_id.in_(faculty_id_list)) \
            .all()

        return create_response_json(faculty_list, department_list, teaching_department_list)


def get_faculty_by_department(requestJson):
    department = requestJson["department"]

    if department.isdigit():
        department_list = db.session.query(Departments.id, Departments.name) \
            .filter(Departments.id == int(department)) \
            .first()
        faculty_list = db.session.query(Faculty.id, Faculty.position_title, Faculty.name,
                                        Faculty.phone_number, Faculty.office_number,
                                        Faculty.office_hours, Departments.id) \
            .filter(Faculty.assigned_department == department_list[0]) \
            .all()
        faculty_id_list = [faculty[0] for faculty in faculty_list]
        teaching_department_list = db.session.query(FacultyTeachingDepartments.faculty_id, Departments.name) \
            .join(Departments, FacultyTeachingDepartments.department_id == Departments.id) \
            .filter(FacultyTeachingDepartments.faculty_id.in_(faculty_id_list)) \
            .all()
        return create_response_json(faculty_list, [department_list], teaching_department_list)
    else:
        department_name = '%' + department + '%'
        department_list = db.session.query(Departments.id, Departments.name) \
            .filter(Departments.name.like(department_name)) \
            .all()

        department_id_list = [dept[0] for dept in department_list]
        faculty_list = db.session.query(Faculty.id, Faculty.position_title, Faculty.name,
                                        Faculty.phone_number, Faculty.office_number,
                                        Faculty.office_hours, Departments.id) \
            .filter(Faculty.assigned_department.in_(department_id_list)) \
            .all()

        faculty_id_list = [faculty[0] for faculty in faculty_list]
        teaching_department_list = db.session.query(FacultyTeachingDepartments.faculty_id, Departments.name) \
            .join(Departments, FacultyTeachingDepartments.department_id == Departments.id) \
            .filter(FacultyTeachingDepartments.faculty_id.in_(faculty_id_list)) \
            .all()

        return create_response_json(faculty_list, department_list, teaching_department_list)
