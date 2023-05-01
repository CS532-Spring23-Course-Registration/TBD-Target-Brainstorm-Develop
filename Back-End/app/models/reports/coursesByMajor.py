from flask import current_app as app, jsonify

from app.models.app import *


def create_response_json(courses_for_major):
    major_fields_list = ["majorId", "majorName"]
    course_fields_list = ["courseId", "courseTitle", "courseName", "courseDescription"]
    response = {"majorList": []}

    # Separate courses by major
    major_list = []
    courses_list_by_major = {}
    for course in courses_for_major:
        major_id = course[0]
        course_object = {key: val for key, val in zip(course_fields_list, course[2:])}
        if major_id in courses_list_by_major:
            courses_list_by_major[major_id].append(course_object)
        else:
            major_list.append({"majorId": major_id, "majorName": course[1]})
            courses_list_by_major[major_id] = [course_object]

    # Build majors list
    for major in major_list:
        major["requiredCourses"] = courses_list_by_major[major["majorId"]]
        response["majorList"].append(major)
    return response


class CoursesByMajor:
    validationSchema = {
        "title": "coursesByMajor",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "coursesByMajor"},
            "major": {"type": "string"},
            "sessionId": {"type": "string"}
        },
        "required": ["sessionId", "major"]
    }

    def execute_query(self, requestJson):
        with app.app_context():
            major = requestJson["major"]
            courses_for_major = []
            if major.isdigit():
                courses_for_major = db.session.query(Programs.id, Programs.name,
                                                     Courses.id, Courses.title,
                                                     Courses.name, Courses.description) \
                    .join(ProgramCourses, Courses.id == ProgramCourses.course_id) \
                    .join(Programs, ProgramCourses.program_id == Programs.id) \
                    .filter(Programs.id == int(major)) \
                    .filter(ProgramCourses.is_required) \
                    .all()
            else:
                program_name = '%' + major + '%'
                courses_for_major = db.session.query(Programs.id, Programs.name,
                                                     Courses.id, Courses.title,
                                                     Courses.name, Courses.description) \
                    .join(ProgramCourses, Courses.id == ProgramCourses.course_id) \
                    .join(Programs, ProgramCourses.program_id == Programs.id) \
                    .filter(Programs.name.like(program_name)) \
                    .filter(ProgramCourses.is_required) \
                    .all()
            return create_response_json(courses_for_major)
