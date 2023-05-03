import os
import random
from flask_migrate import Migrate
from datetime import datetime
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

db = SQLAlchemy()


# Function to generate a random 4-digit ID number #
def generate_id(min, max):
    return random.randint(min, max)

def generate_username(name):
    firstLetter = name.split()[0][0]
    lastName = name.split()[1]
    randNum = str(random.randint(0, 999))
    
    return ''.join([firstLetter, lastName, randNum]).lower()


class Student(db.Model):
    __tablename__ = 'student'
    id = db.Column(db.Integer, primary_key=True, default=generate_id(10000, 14000))
    name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    major = db.Column(db.String(100), nullable=False)
    minor = db.Column(db.String(100), nullable=True)

    outline = db.relationship('ProgramOutline', backref='student')

    grades = db.relationship('StudentGrades', backref='student')
    misc_notes = db.relationship('StudentMiscNotes', backref='student')

    # Many-to-Many
    enrolled_courses = db.relationship('CoursePerSemester', secondary='enrollment', back_populates='students',
                                       overlaps='enrolled_courses,student')

    # Function to create a student in table
    # Ex. Student.create('Robert', '85851112222', '555 Main St', date(1998,6,27), 'Computer Science')

    @classmethod
    def create(cls, name, phone_number, address, dob, major, minor=None):
        s = Student(name=name, phone_number=phone_number,
                    address=address, dob=datetime.fromisoformat(dob), major=major, minor=minor)

        db.session.add(s)
        db.session.commit()

        return s


class StudentGrades(db.Model):
    __tablename__ = 'studentgrades'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    course_sem_id = db.Column(db.Integer, db.ForeignKey('coursepersemester.id'),
                              nullable=False)  # Coursepersemester foreign key
    grade = db.Column(db.String(2), nullable=False)
    earned_credits = db.Column(db.Integer, nullable=False)
    course_notes = db.Column(db.String, nullable=True)

    @classmethod
    def add_grade_for_student(cls, student_id, course_sem_id, grade, earned_credits, course_notes=None):
        q_student = Student.query.filter_by(id=student_id).first()
        q_course = CoursePerSemester.query.filter_by(id=course_sem_id).first()

        if q_student is None:
            return jsonify({"error": "Student not found with ID {:n}.".format(student_id)})

        if q_course is None:
            return jsonify({"error": "CoursePerSemester ID {:n} not found.".format(course_sem_id)})

        # Detect duplicate grade entry for specified course #
        q_grades = StudentGrades.query.filter_by(student_id=student_id, course_sem_id=course_sem_id).first()
        if q_grades is not None:
            return jsonify({"error": "Duplicate found: Student ID {:n} already has an "
                                     "entry for CoursePerSemester ID {:n}.".format(student_id,
                                                                                   q_grades.course_sem_id)
                            })

        g = StudentGrades(student_id=student_id, course_sem_id=course_sem_id, grade=grade,
                          earned_credits=earned_credits, course_notes=course_notes)
        db.session.add(g)
        db.session.commit()

        return jsonify({"message": "Grade {} added to student {} ID {:n} "
                                   "for course {} ID {:n} in "
                                   "semester {}.".format(grade, q_student.name,
                                                         q_student.id, q_course.name,
                                                         q_course.id, q_course.course_semester)
                        })

    @classmethod
    def change_student_grade(cls, student_id, course_sem_id, new_grade, new_note):
        q_enrollment = Enrollment.query.filter_by(student_id=student_id, course_sem_id=course_sem_id).first()
        q_grade = StudentGrades.query.filter_by(student_id=student_id, course_sem_id=course_sem_id).first()

        if q_enrollment is None and q_grade is None:
            return jsonify({"error": "Student with id {:n} is not enrolled in course "
                                     "with courseSemesterId {:n}".format(student_id, course_sem_id)})

        q_grade.grade = new_grade
        q_grade.course_notes = new_note

        db.session.commit()

        return jsonify({"message": "Successfully changed grade and/or notes of student with id {:n} with courseSemesterId {:n}".format(student_id, course_sem_id)})

class StudentMiscNotes(db.Model):
    __tablename__ = 'studentmiscnotes'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    edit_time = db.Column(db.DateTime, default=datetime.utcnow)
    editor_id = db.Column(db.Integer, db.ForeignKey('faculty.id'), nullable=False)  # Faculty foreign key
    description = db.Column(db.String(500), nullable=True)

    @classmethod
    def create_note(cls, student_id, editor_id, description):
        q = Student.query.filter_by(id=student_id).first()

        if q is not None:
            mn = StudentMiscNotes(student_id=student_id,
                                  editor_id=editor_id, description=description)
            db.session.add(mn)
            db.session.commit()

            return jsonify({"message": "Note created for student {:s}.".format(q.name)})
        else:
            return jsonify({"error": "Student not found with ID {:n}.".format(student_id)})


class Faculty(db.Model):
    __tablename__ = 'faculty'
    id = db.Column(db.Integer, primary_key=True, default=generate_id(15000, 19000))
    name = db.Column(db.String(100), nullable=False)
    position_title = db.Column(db.String(50), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    office_number = db.Column(db.String(20), nullable=False)
    office_hours = db.Column(db.DateTime, nullable=True)
    assigned_department = db.Column(db.Integer, db.ForeignKey('departments.id'))  # Departments foreign key

    teaching_departments = db.relationship('FacultyTeachingDepartments', backref='faculty')  # One to Many
    note_edits = db.relationship('StudentMiscNotes', backref='editor')

    # One to many for coursepersemester, receive the faculty's current courses taught
    courses = db.relationship('CoursePerSemester', backref='faculty')
    programs_advising = db.relationship('ProgramAdvisors', backref='faculty')
    outlines_approved = db.relationship('ProgramOutline', backref='approver')

    # Function to create a faculty member in table. Prints error if the assigned_department ID is not within Departments database
    # Ex. Faculty.create('name','title','phone','H-246','5')
    @classmethod
    def create(cls, name, position_title, phone_number, office_number, assigned_department, office_hours=None):
        # Query if department is valid
        q = Departments.query.filter_by(id=assigned_department).first()

        if q is not None:
            f = Faculty(name=name, position_title=position_title, phone_number=phone_number,
                        office_number=office_number, office_hours=office_hours, assigned_department=assigned_department)

            db.session.add(f)
            db.session.commit()

            return f
        else:
            return jsonify({"error": "Department ID {:s} not found.".format(assigned_department)})


class FacultyTeachingDepartments(db.Model):
    __tablename__ = 'facultyteachingdepartments'
    id = db.Column(db.Integer, primary_key=True)
    faculty_id = db.Column(db.Integer, db.ForeignKey('faculty.id'), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=False)

    # Function to add a teaching department to a faculty member.
    # Error handling added if department/faculty member not found, or if a duplicate entry will be added.
    # Ex. FacultyTeachingDepartments(1, 1)
    @classmethod
    def add(cls, faculty_id, department_id):
        f = Faculty.query.filter_by(id=faculty_id).first()
        d = Departments.query.filter_by(id=department_id).first()

        # If department query returns no values
        if d is None:
            return jsonify({"error": "Invalid department ID."})

        # If faculty query returns values
        if f is not None:
            for t in f.teaching_departments:
                if t.id == d.id:
                    # Return error if department_id is already within faculty's teaching departments
                    return jsonify({"error": "Department {:s} is already "
                                             "added to faculty member {:s}.".format(d.name, f.name)
                                    })

            ft = FacultyTeachingDepartments(faculty_id=f.id, department_id=d.id)
            db.session.add(ft)
            db.session.commit()
            return jsonify({"message": "Successfully added {:s} to Faculty member {:s}.".format(d.name, f.name)})
        else:
            return jsonify({"error": "Invalid faculty ID."})


class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    job_title = db.Column(db.String(50), nullable=False)
    permissions = db.Column(db.String(10), nullable=False)

    # Function to create a user within the system.
    # Ex. Users.create('name', 'passwordhash','jobtitle','admin')
    @classmethod
    def create(cls, username, name, password, job_title, permissions):
        # TODO - Add catch for duplicate name?

        u = Users(username=username, name=name, password=password, job_title=job_title, permissions=permissions)
        db.session.add(u)
        db.session.commit()

        return jsonify({"message": "User {:s} created with ID {:n}".format(name, u.id)})
    
    @classmethod
    def create_from_id(cls, id, password):
        # TODO - Add catch for duplicate name?

        q = Faculty.query.filter_by(id=id).first()
        s = Student.query.filter_by(id=id).first()
        users = Users.query.filter_by(id=id).first()
        
        if users is not None:
            return jsonify({"message": "ID {:n} already within Users.".format(id)})
        
        if q is None and s is None:
            return jsonify({"message": "ID {:n} not found in Faculty and Student.".format(id)})
        elif q is None and s is not None:
            u = Users(id=id, name=generate_username(s.name), password=password, job_title='student', permissions='student')
        elif q is not None and s is None:
            u = Users(id=id, name=generate_username(q.name), password=password, job_title=q.position_title, permissions='faculty')
        else:
            return jsonify({"message": "ID {:n} is a duplicate in Faculty and Student".format(id)})
        
        
        db.session.add(u)
        db.session.commit()

        return jsonify({"message": "User {:s} created with ID {:n}".format(u.name, u.id)})

    @classmethod
    def change_password(cls, user_id, new_password):
        user = Users.query.filter_by(id=user_id).first()

        if user is None:
            return jsonify({"message": "There is no registered user with ID {:n}".format(user_id)})

        user.password = new_password
        db.session.commit()

        return jsonify({"message": "Successfully changed password for user {} with id {:n}".format(user.name, user_id)})

    # def get_user_by_username(name):
    #     Session = sessionmaker(bind=db.engine)
    #     session = Session()
    #     user = session.query(Users).filter_by(name=name).first()
    #     session.close()
    #     return


class Departments(db.Model):
    __tablename__ = 'departments'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

    faculty_members = db.relationship('Faculty', backref='assigneddepartment')  # Establish many to one
    courses = db.relationship('Courses', backref='department')
    programs = db.relationship('Programs', backref='department')

    # Function to add a department to the Departments table. Error handling if a duplicate department is detected.
    # Ex. Departments.add('English')
    @classmethod
    def add(cls, name):
        q = Departments.query.filter_by(name=name).first()

        if q is not None:
            if q.name == name:
                return jsonify({"error": "Duplicate department found with ID {:n}.".format(q.id)})

        d = Departments(name=name)
        db.session.add(d)
        db.session.commit()

        return jsonify({"message": "Department {:s} created with ID {:n}.".format(name, d.id)})


class Courses(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)  # Course subject, ex. PHYS195
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    is_external_course = db.Column(db.Boolean, nullable=False)
    num_units = db.Column(db.Float, nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=False)

    programs_included = db.relationship('ProgramCourses', backref='course')

    # Function to add a course to the Courses table. If external course is True, description can contain information about accredited university.
    # Ex. Courses.add('MATH151', 'Calculus 2', 3.0, '3')
    @classmethod
    def add(cls, title, name, num_units, department_id, description=None, is_external_course=False):
        # Query if department ID is valid
        q = Departments.query.filter_by(id=department_id).first()

        if q is None:
            return jsonify({"error": "Department not found with given ID."})

        c = Courses(title=title, name=name, description=description, is_external_course=is_external_course,
                    num_units=num_units, department_id=department_id)
        db.session.add(c)
        db.session.commit()

        return jsonify({"message": "Course {:s} added with id {:n}.".format(name, c.id)})


class CoursePerSemester(db.Model):
    __tablename__ = 'coursepersemester'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)  # Courses foreign key
    title = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)

    course_semester = db.Column(db.String(20), nullable=False)
    faculty_id = db.Column(db.Integer, db.ForeignKey('faculty.id'), nullable=False)  # Faculty foreign key
    course_date_time = db.Column(db.String, nullable=False)  # Format Ex. MW 1200-1315
    course_location = db.Column(db.String(20), nullable=False)  # 'Online' or Campus room number
    max_seats = db.Column(db.Integer, nullable=False)  # 4 digit number
    seats_available = db.Column(db.Integer, nullable=False)  # 4 digit number

    students = db.relationship('Student', secondary='enrollment', back_populates='enrolled_courses', viewonly=True)
    grades = db.relationship('StudentGrades', backref='course_sem')

    # many to one to Courses
    course = db.relationship('Courses', backref='coursepersemester', viewonly=True)

    # Function to add a course to a given semester. Columns 'title', 'name', and 'description' can be left blank as it will pull the information from
    #   the Courses table.
    # Ex. CoursePerSemester.add_course_to_semester(1,2023,'Fall',3,1,'W 1200-1315', 'Online', 20, 11)

    @classmethod
    def add_course_to_semester(cls, course_id, course_semester, faculty_id, course_date_time, course_location,
                               max_seats, seats_available):
        q_course = Courses.query.filter_by(id=course_id).first()
        q_faculty = Faculty.query.filter_by(id=faculty_id).first()

        if q_course is None:
            return jsonify({"error": "Course ID {:n} not found.".format(course_id)})
        if q_faculty is None:
            return jsonify({"error": "Faculty ID {:n} not found.".format(faculty_id)})

        # Detect duplicates within given semester
        q_c = CoursePerSemester.query.filter_by(course_id=course_id, course_semester=course_semester).first()

        if q_c is not None:
            return jsonify({"error": "Duplicate course found within given semester: {:s}.".format(course_semester)})

        # max_seats and seats_available validation
        if max_seats < seats_available:
            return jsonify({"error": "max_seats inputted is less than seats_available."})

        c = CoursePerSemester(course_id=course_id, title=q_course.title, name=q_course.name,
                              description=q_course.description,
                              course_semester=course_semester, faculty_id=faculty_id,
                              course_date_time=course_date_time, course_location=course_location, max_seats=max_seats,
                              seats_available=seats_available)

        db.session.add(c)
        db.session.commit()

        return jsonify({"message": "Added course {:s} to {:s} semester.".format(q_course.name, course_semester)})


class Enrollment(db.Model):
    __tablename__ = 'enrollment'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    course_sem_id = db.Column(db.Integer, db.ForeignKey('coursepersemester.id'), nullable=False)
    enrollment_date = db.Column(db.DateTime, default=db.func.now())  # Get current dateTime

    enrolled_student = db.relationship('Student', backref='enrollment', viewonly=True)  # Establish many to one
    # Establish many to one
    course = db.relationship('CoursePerSemester', backref='enrollment', viewonly=True)

    # Function to create a student in table
    # Ex. Enrollment.add_student_to_course('1','2')
    @classmethod
    def add_student_to_course(cls, student_id, course_sem_id):
        q = Enrollment.query.filter_by(student_id=student_id, course_sem_id=course_sem_id).first()
        q2 = StudentGrades.query.filter_by(student_id=student_id, course_sem_id=course_sem_id).first()
        course = CoursePerSemester.query.filter_by(id=course_sem_id).first()

        if q is not None and q2 is not None:
            return jsonify({"error": "Student ID {:n} is already enrolled"
                                     " for CoursePerSemester ID {:n}"
                           .format(student_id, course_sem_id)
                            })
        elif course.seats_available == 0:
            return jsonify({"error": "Class {:n} is already full".format(course_sem_id)})

        # Create new Enrollment table entry
        enroll = Enrollment(student_id=student_id, course_sem_id=course_sem_id)

        # Decrease amount of seats available in class
        course.seats_available -= 1

        # Add StudentGrades entry
        commit_response = StudentGrades.add_grade_for_student(student_id, course_sem_id, "IP", 0).get_json()

        if 'error' in commit_response:
            db.session.rollback()
            return commit_response

        db.session.add(enroll)
        db.session.commit()

        return jsonify({"message": "Student ID {:n} has successfully enrolled for "
                                   "CoursePerSemester ID {:n}.".format(student_id, course_sem_id)
                        })

    @classmethod
    def drop_student_from_course(cls, student_id, course_sem_id):
        q = Enrollment.query.filter_by(student_id=student_id, course_sem_id=course_sem_id).first()
        q2 = StudentGrades.query.filter_by(student_id=student_id, course_sem_id=course_sem_id).first()
        course = CoursePerSemester.query.filter_by(id=course_sem_id).first()

        if q is None and q2 is None:
            return jsonify({"error": "Can't drop Student ID {:n} "
                                     "from CoursePerSemester ID {:n} as "
                                     "they are not currently enrolled in that course."
                           .format(student_id, course_sem_id)
                            })

        # Delete student from Enrollment and StudentGrades table
        Enrollment.query.filter_by(student_id=student_id, course_sem_id=course_sem_id).delete()
        StudentGrades.query.filter_by(student_id=student_id, course_sem_id=course_sem_id).delete()

        # Increase amount of seats available in class
        course.seats_available += 1

        db.session.commit()

        return jsonify({"message": "Student ID {:n} has been successfully removed from "
                                   "CoursePerSemester ID {:n}.".format(student_id, course_sem_id)
                        })


class CoursePrerequisites(db.Model):
    __tablename__ = 'courseprereqs'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    prereq_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)  # Foreign key of class pre-req

    course = db.relationship('Courses', foreign_keys='CoursePrerequisites.course_id')
    prereq_course = db.relationship('Courses', foreign_keys='CoursePrerequisites.prereq_id', backref='prerequisites')

    # Placeholder function

    @classmethod
    def add_course_prereq(cls, course_id, prereq_id):
        q_prereq = CoursePrerequisites.query.filter_by(course_id=course_id, prereq_id=prereq_id).first()

        if (q_prereq != None):
            return jsonify({"error": "Duplicate prerequisite course found for course ID {:n}.".format(course_id)})

        prereq = CoursePrerequisites(course_id=course_id, prereq_id=prereq_id)
        db.session.add(prereq)
        db.session.commit()
        return jsonify({"message": "Prerequisite course ID {:n} added to course ID {:n}.".format(prereq_id, course_id)})


class Programs(db.Model):
    __tablename__ = 'programs'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=False)  # Departments foreign key
    num_units = db.Column(db.Integer, nullable=False)

    courses = db.relationship('ProgramCourses', backref='program')  # One to Many
    advisors = db.relationship('ProgramAdvisors', backref='program')  # One to Many

    @classmethod
    def create(cls, name, department_id, num_units):
        q_department = Departments.query.filter_by(id=department_id).first()

        if q_department is None:
            return jsonify({"error": "Department ID {:n} not found.".format(department_id)})

        p = Programs(name=name, department_id=department_id, num_units=num_units)
        db.session.add(p)
        db.session.commit()

        return jsonify({"message": "Program name {} created with ID {:n}".format(p.name, p.id)})


class ProgramCourses(db.Model):
    __tablename__ = 'programcourses'
    id = db.Column(db.Integer, primary_key=True)
    program_id = db.Column(db.Integer, db.ForeignKey('programs.id'), nullable=False)  # Programs foreign key
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)  # Courses foreign key

    # True = required, False = elective
    is_required = db.Column(db.Boolean, default=True, nullable=False)

    @classmethod
    def add_course_to_program(cls, program_id, course_id, is_required=True):
        q = ProgramCourses.query.filter_by(
            program_id=program_id, course_id=course_id).first()

        if q is not None:
            return jsonify({"error": "Course ID {:n} is already within program ID {:n}.".format(course_id, program_id)})

        a = ProgramCourses(program_id=program_id, course_id=course_id, is_required=is_required)
        db.session.add(a)
        db.session.commit()

        return jsonify({"message": "Course ID {:n} added to program ID {:n}.".format(course_id, program_id)})


class ProgramAdvisors(db.Model):
    __tablename__ = 'programadvisors'
    id = db.Column(db.Integer, primary_key=True)
    program_id = db.Column(db.Integer, db.ForeignKey('programs.id'), nullable=False)
    faculty_id = db.Column(db.Integer, db.ForeignKey('faculty.id'), nullable=False)

    @classmethod
    def add_advisor_to_program(cls, program_id, faculty_id):
        q = ProgramAdvisors.query.filter_by(
            program_id=program_id, faculty_id=faculty_id).first()

        if q is not None:
            return jsonify({'error': 'Faculty ID {} already exists for program ID {}.'.format(faculty_id, program_id)})

        p = ProgramAdvisors(program_id=program_id, faculty_id=faculty_id)
        db.session.add(p)
        db.session.commit()

        return jsonify({'message': 'Successfully added faculty ID {} to program ID {}.'.format(faculty_id, program_id)})


class ProgramOutline(db.Model):
    __tablename__ = 'programoutline'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    program_id = db.Column(db.Integer, db.ForeignKey('programs.id'), nullable=False)  # Programs foreign key
    approver_id = db.Column(db.Integer, db.ForeignKey('faculty.id'), nullable=False)  # Faculty foreign key

    program = db.relationship('Programs', backref='outlines')

    # StudentGrades can query for the courses that are already completed for the student
    # Can be compared with ProgramCourses to find what courses are still required

    @classmethod
    def create(cls, student_id, program_id, approver_id):
        q_program = Programs.query.filter_by(id=program_id).first()
        q_student = Student.query.filter_by(id=student_id).first()

        if q_program is None:
            return jsonify({"error": "Program ID {} not found.".format(program_id)})

        if q_student is None:
            return jsonify({"error": "Student ID {} not found.".format(student_id)})

        outline = ProgramOutline(student_id=student_id, program_id=program_id, approver_id=approver_id)
        db.session.add(outline)
        db.session.commit()

        return jsonify({"message": "Program outline for student ID {} "
                                   "created with ID {}".format(student_id, outline.id)
                        })


class CourseByOutline(db.Model):
    __tablename__ = 'coursebyoutline'
    id = db.Column(db.Integer, primary_key=True)
    outline_id = db.Column(db.Integer, db.ForeignKey('programoutline.id'),
                           nullable=False)  # Foreign key to reference list of program courses
    course_id = db.Column(db.Integer, db.ForeignKey('programcourses.course_id'), nullable=False)
    course_status = db.Column(db.String, nullable=False, default="Waiting Approval")  # "Approved", "Dropped", "Waived". If "Approved", cannot be deleted BUT can be modified
    change_date = db.Column(db.DateTime(timezone=True), server_default=text("(now() at time zone 'pst')"))
    previous_version = db.Column(db.Integer, default=0)

    course = db.relationship('ProgramCourses', backref='outlines_present')
    program_outline = db.relationship('ProgramOutline', backref='courses')

    @classmethod
    def change_course_status(cls, outline_id, course_id, new_status):
        q_outline = ProgramOutline.query.filter_by(id=outline_id).first()
        q_course = ProgramCourses.query.filter_by(course_id=course_id).all()
        q_outline_courses = CourseByOutline.query \
                                           .filter_by(course_id=course_id, outline_id=outline_id) \
                                           .order_by(CourseByOutline.id.desc()) \
                                           .all()

        if q_outline is None:
            return jsonify({'error': 'ProgramOutline ID {} not found.'.format(outline_id)})

        if q_course is None:
            return jsonify({'error': 'Course ID {} not found within program courses.'.format(course_id)})

        if q_outline_courses is None:
            return jsonify({'error': 'Course ID {} is not currently in outline. '
                                     'Please add to outline before trying to change '
                                     'status.'.format(course_id)})

        for course_index in range(len(q_outline_courses[:-1])):
            course = q_outline_courses[course_index]
            previous_version = q_outline_courses[course_index + 1]
            course.previous_version = previous_version.id

        last_course_change = q_outline_courses[0]
        new_status = CourseByOutline(outline_id=outline_id, course_id=course_id,
                                     course_status=new_status, previous_version=last_course_change.id)

        db.session.add(new_status)
        db.session.commit()
        return jsonify({'message': 'Successfully change status of Course ID {} '
                                   'from outline ID {} to {} .'.format(course_id, outline_id, new_status)})

    @classmethod
    def add_course_to_outline(cls, outline_id, course_id):
        q_outline = ProgramOutline.query.filter_by(id=outline_id).first()
        q_course = ProgramCourses.query.filter_by(course_id=course_id).first()

        if q_outline is None:
            return jsonify({'error': 'ProgramOutline ID {} not found.'.format(outline_id)})

        if q_course is None:
            return jsonify({'error': 'Course ID {} not found within program courses.'.format(course_id)})

        q_outline_courses = CourseByOutline.query.filter_by(outline_id=outline_id, course_id=course_id).first()
        if q_outline_courses is not None:
            return jsonify({'error': 'Course ID {} has already '
                                     'been added to outline ID {}.'.format(course_id, outline_id)
                            })

        c = CourseByOutline(outline_id=outline_id, course_id=course_id)
        db.session.add(c)
        db.session.commit()

        return jsonify({'message': 'Course ID {} added to outline ID {}.'.format(course_id, outline_id)})
