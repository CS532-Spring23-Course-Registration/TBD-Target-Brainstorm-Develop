from flask import current_app as app
from sqlalchemy import text

from app.models.app import *


class Courses:
    validationSchema = {
        "title": "courses",
        "type": "object",
        "properties": {
            "reportName": {"type": "string", "const": "courses"},
            "sessionId": {"type": "string"},
            "reportFilters": {
                "type": "string",
                "enum": [
                    "allClassesByDepartment",
                    "openClassesByDepartment",
                    "openClassesAllDepartments",
                    "allClassesAllDepartments"
                ]
            },
            "department": {"type": "string"},
            "courseSemester": {"type": "string"},
            "course": {"type": "string"}
        },
        "required": ["sessionId", "reportFilters", "courseSemester", "course"]
    }

    def execute_query(self, requestJson):
        with app.app_context():
            reportType = requestJson["reportFilters"]

            # Create three levels of response : [departments: [courses: [prerequisites] ] ]
            department_list = get_departments(reportType, requestJson)
            courses_by_department = get_courses(department_list, reportType, requestJson)
            prerequisites_list = get_prerequisites(courses_by_department)

            return create_response_json(department_list, courses_by_department, prerequisites_list)


def get_departments(report_type, requestJson):
    with app.app_context():
        department_list = []
        # Get the department list
        base_department_query = "select * from departments"
        if "AllDepartments" in report_type:
            department_list = db.session.execute(text(base_department_query + ";")).all()
        elif "ByDepartment" in report_type:
            department = requestJson["department"]
            single_department_query = base_department_query + " where "
            if department.isdigit():
                single_department_query += "id = " + department
            else:
                single_department_query += "name like '%" + department + "%'"
            department_list = db.session.execute(text(single_department_query + ";")).all()
        return department_list


def get_courses(department_list, report_type, requestJson):
    with app.app_context():
        courses_by_department = []

        # Get the course list for the departments requested
        department_id_list = [str(department[0]) for department in department_list]
        base_courses_query = "select cps.course_id, cps.title, cps.name, cps.description, " \
                             " cps.course_semester, f.name, cps.course_date_time, cps.course_location, " \
                             " cps.max_seats, cps.seats_available, department_id from courses c" \
                             " inner join coursepersemester cps on c.id = cps.course_id" \
                             " inner join faculty f on cps.faculty_id = f.id" \
                             " where department_id in" \
                             " (" + ",".join(department_id_list) + ")" \
                             " and cps.course_semester like" \
                             " '%" + requestJson["courseSemester"] + "%'"

        if "openClasses" in report_type:
            base_courses_query += " and seats_available != 0"

        # Filter by course if passed in
        course = requestJson["course"]
        if course != "":
            if course.isdigit():
                base_courses_query += " and c.id = " + course
            else:
                base_courses_query += " and (c.name like '" + course + "%' or c.title like '" + course + "%')"

        courses_by_department = db.session.execute(text(base_courses_query + ";")).all()

        return courses_by_department


def get_prerequisites(courses_by_department):
    with app.app_context():
        # Get the prerequisite list for each course
        course_id_list = [str(course[0]) for course in courses_by_department]
        course_prerequisites_query = "select course_id, c.title from courses c" \
                                     " inner join courseprereqs c_req on c.id = c_req.prereq_id" \
                                     " where c_req.course_id in " \
                                     " (" + ",".join(course_id_list) + ");"
        return db.session.execute(text(course_prerequisites_query)).all()


def create_response_json(department_list, course_list, prerequisites_list):
    # Declare fields in response
    department_fields = ["id", "name"]
    course_fields = ["courseId", "title", "name", "description",
                     "courseSemester", "instructorName", "courseDateTime",
                     "courseLocation", "maxSeats", "seatsAvailable"]

    # Add each department object to departments list
    response = {"departments": [{key: val for key, val in zip(department_fields, department)}
                                for department in department_list
                                ]
                }

    # Build prerequisites list for each course
    prerequisites_by_course = {}
    for course in prerequisites_list:
        course_id = course[0]
        if course_id in prerequisites_by_course:
            prerequisites_by_course[course_id].append(course[1])
        else:
            prerequisites_by_course[course_id] = [course[1]]

    # Build course objects and group under department_id
    course_by_department = {}
    for course in course_list:
        dept_id = course[-1]
        courseObject = {key: val for key, val in zip(course_fields, course)}

        # Append prerequisites for that course
        if course[0] in prerequisites_by_course:
            courseObject["coursePrerequisites"] = prerequisites_by_course[course[0]]
        else:
            courseObject["coursePrerequisites"] = ["None"]

        # Append course to corresponding department
        if dept_id in course_by_department:
            course_by_department[dept_id].append(courseObject)
        else:
            course_by_department[dept_id] = [courseObject]

    # Add course list to corresponding department in response
    for department in response["departments"]:
        department_id = department["id"]
        if department_id in course_by_department:
            department["coursesInDepartment"] = course_by_department[department_id]
        else:
            department["coursesInDepartment"] = ["None"]

    return response
