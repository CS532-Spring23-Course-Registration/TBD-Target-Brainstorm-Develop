from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy.orm import sessionmaker

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///registration.db'

# Init database
db = SQLAlchemy(app)


class Student(db.Model):
    __tablename__ = 'student'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    # Possible convert to DateTime rather than string
    dob = db.Column(db.Date, nullable=False)
    major = db.Column(db.String(100), nullable=False)
    minor = db.Column(db.String(100), nullable=True)

    outline = db.relationship('ProgramOutline', backref='student')

    # Many-to-Many
    enrolled_courses = db.relationship(
        'CoursePerSemester', secondary='enrollment', back_populates='students', overlaps='enrolled_courses,student')

    # One-to-One
    grades = db.relationship('StudentGrades', backref='student', uselist=False)
    misc_notes = db.relationship(
        'StudentMiscNotes', backref='student', uselist=False)

    # Function to create a student in table
    # Ex. Student.create('Robert', '85851112222', '555 Main St', date(1998,6,27), 'Computer Science')

    @classmethod
    def create(cls, name, phone_number, address, dob, major, minor=None):
        s = Student(name=name, phone_number=phone_number,
                    address=address, dob=dob, major=major, minor=minor)
        db.session.add(s)
        db.session.commit()

        return print("Student %s created with ID %d" % (name, s.id))


class StudentGrades(db.Model):
    __tablename__ = 'studentgrades'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(
        db.Integer, db.ForeignKey('student.id'), unique=True)
    course_id = db.Column(db.Integer, db.ForeignKey(
        'coursepersemester.course_id'))  # CoursePerSemester foreign key
    grade = db.Column(db.String(2), nullable=False)
    earned_credits = db.Column(db.Integer, nullable=False)
    is_external_course = db.Column(db.Boolean, default=False)
    course_notes = db.Column(db.Boolean, default=False)
    general_notes = db.Column(db.Boolean, default=False)


class StudentMiscNotes(db.Model):
    __tablename__ = 'studentmiscnotes'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(
        db.Integer, db.ForeignKey('student.id'), unique=True)
    edit_time = db.Column(db.DateTime, default=datetime.utcnow)
    editor_id = db.Column(db.Integer, db.ForeignKey(
        'users.id'))  # Users foreign key
    description = db.Column(db.String(500), nullable=True)

    @classmethod
    def create_note(student_id, editor_id, description):
        q = Student.query.filter_by(id=student_id).first()

        if (q != None):
            mn = StudentMiscNotes(student_id=student_id,
                                  editor_id=editor_id, description=description)
            db.session.add(mn)
            db.session.commit(mn)

            return print("Note created for student %s." % q.name)
        else:
            return print('Student not found with ID %d.' % student_id)


class Faculty(db.Model):
    __tablename__ = 'faculty'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    position_title = db.Column(db.String(50), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    office_number = db.Column(db.String(20), nullable=False)
    office_hours = db.Column(db.DateTime, nullable=True)
    assigned_department = db.Column(db.Integer, db.ForeignKey(
        'departments.id'))  # Departments foreign key

    teaching_departments = db.relationship(
        'FacultyTeachingDepartments', backref='faculty')  # One to Many
    # One to many for coursepersemester, receive the faculty's current courses taught
    courses = db.relationship('CoursePerSemester', backref='faculty')
    programs_advising = db.relationship('ProgramAdvisors', backref='faculty')

    # Function to create a faculty member in table. Prints error if the assigned_department ID is not within Departments database
    # Ex. Faculty.create('name','title','phone','H-246','5')
    @classmethod
    def create(cls, name, position_title, phone_number, office_number, assigned_department, office_hours=None):
        # Query if department is valid
        q = Departments.query.filter_by(id=assigned_department).first()

        if (q != None):
            f = Faculty(name=name, position_title=position_title, phone_number=phone_number,
                        office_number=office_number, office_hours=office_hours, assigned_department=assigned_department)

            db.session.add(f)
            db.session.commit()

            return print("Faculty member %s created with ID %d" % (name, f.id))
        else:
            return print("Department ID %s not found." % assigned_department)


class FacultyTeachingDepartments(db.Model):
    __tablename__ = 'facultyteachingdepartments'
    id = db.Column(db.Integer, primary_key=True)
    faculty_id = db.Column(db.Integer, db.ForeignKey('faculty.id'))
    department_id = db.Column(db.Integer, db.ForeignKey(
        'departments.id'))  # one to many

    # Function to add a teaching department to a faculty member.
    # Error handling added if department/faculty member not found, or if a duplicate entry will be added.
    # Ex. FacultyTeachingDepartments(1, 1)
    @classmethod
    def add(cls, faculty_id, department_id):
        f = Faculty.query.filter_by(id=faculty_id).first()
        d = Departments.query.filter_by(id=department_id).first()

        # If department query returns no values
        if (d == None):
            return print("Invalid department ID.")

        # If faculty query returns values
        if (f != None):
            for t in f.teaching_departments:
                if (t.id == d.id):
                    # Print error if department_id is already within faculty's teaching departments
                    return print("Department %s is already added to faculty member %s." % (d.name, f.name))

            ft = FacultyTeachingDepartments(
                faculty_id=f.id, department_id=d.id)
            db.session.add(ft)
            db.session.commit()
            return print("Successfully added %s to Faculty member %s." % (d.name, f.name))
        else:
            return print("Invalid faculty ID.")


class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    # Store hash possibly?
    password = db.Column(db.String(100), nullable=False)
    job_title = db.Column(db.String(50), nullable=False)
    permissions = db.Column(db.String(10), nullable=False)

    note_edits = db.relationship('StudentMiscNotes', backref='editor')

    # Function to create a user within the system.
    # Ex. Users.create('name', 'passwordhash','jobtitle','admin')
    @classmethod
    def create(cls, name, password, job_title, permissions):

        # TODO - Add catch for duplicate name?

        u = Users(name=name, password=password,
                  job_title=job_title, permissions=permissions)
        db.session.add(u)
        db.session.commit()

        return print("User %s created with ID %d" % (name, u.id))

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

    faculty_members = db.relationship(
        'Faculty', backref='assigneddepartment')  # Establish many to one
    courses = db.relationship('Courses', backref='department')
    programs = db.relationship('Programs', backref='department')

    # Function to add a department to the Departments table. Error handling if a duplicate department is detected.
    # Ex. Departments.add('English')
    @classmethod
    def add(cls, name):
        q = Departments.query.filter_by(name=name).first()

        if (q != None):
            if (q.name == name):
                return print("Duplicate department found with ID %d." % q.id)

        d = Departments(name=name)
        db.session.add(d)
        db.session.commit()

        return print("Department %s created with ID %d" % (name, d.id))


class Courses(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)  # Course subject, ex. PHYS195
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    num_units = db.Column(db.Float, nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'))

    programs_included = db.relationship('ProgramCourses', backref='course')
    # prerequisites = db.relationship(
    #     'CoursePrerequisites', backref='course') # Needs fixing

    # Function to add a course to the Courses table.
    # Ex. Courses.add('MATH151', 'Calculus 2', 3.0, '3')
    @classmethod
    def add(cls, title, name, num_units, department_id, description=None):
        # Query if department ID is valid
        q = Departments.query.filter_by(id=department_id).first()

        if (q == None):
            return print("Department not found with given ID.")

        c = Courses(title=title, name=name, description=description,
                    num_units=num_units, department_id=department_id)
        db.session.add(c)
        db.session.commit()

        return print("Course %s added with id %d" % (name, c.id))


class CoursePerSemester(db.Model):
    __tablename__ = 'coursepersemester'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey(
        'courses.id'))  # Courses foreign key
    title = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)

    course_semester = db.Column(db.String(20), nullable=False)
    course_year = db.Column(db.Integer, nullable=False)  # Year, ex. 2023
    faculty_id = db.Column(db.Integer, db.ForeignKey(
        'faculty.id'))  # Faculty foreign key
    course_date_time = db.Column(
        db.String, nullable=False)  # Format Ex. MW 1200-1315
    # 'Online' or Campus room number
    course_location = db.Column(db.String(20), nullable=False)
    max_seats = db.Column(db.Integer, nullable=False)  # 4 digit number
    seats_available = db.Column(db.Integer, nullable=False)  # 4 digit number

    students = db.relationship(
        'Student', secondary='enrollment', back_populates='enrolled_courses', viewonly=True)

    # many to one to Courses
    course = db.relationship(
        'Courses', backref='coursepersemester', viewonly=True)

    # Function to add a course to a given semester.
    # Ex. CoursePerSemester.add_course_to_semester(1,2023,'Fall',3,1,'W 1200-1315', 'Online', 20, 11)

    @classmethod
    def add_course_to_semester(cls, course_id, course_year, course_semester, faculty_id, course_date_time, course_location, max_seats, seats_available):
        q_course = Courses.query.filter_by(id=course_id).first()
        q_faculty = Faculty.query.filter_by(id=faculty_id).first()

        if (q_course == None):
            return print("Course ID %d not found." % course_id)
        if (q_faculty == None):
            return print("Faculty ID %d not found." % faculty_id)

        # Detect duplicates within given semester
        q_c = CoursePerSemester.query.filter_by(
            course_id=course_id, course_year=course_year, course_semester=course_semester).first()

        if (q_c != None):
            return print("Duplicate course found within given semester: %s %d." % (course_semester, course_year))

        # max_seats and seats_available validation
        if (max_seats < seats_available):
            return print("max_seats inputted is less than seats_available.")

        c = CoursePerSemester(course_id=course_id, title=q_course.title, name=q_course.name, description=q_course.description, course_year=course_year, course_semester=course_semester,
                              faculty_id=faculty_id, course_date_time=course_date_time, course_location=course_location, max_seats=max_seats, seats_available=seats_available)

        db.session.add(c)
        db.session.commit()

        return print("Added course %s to %s %d semester." % (q_course.name, course_semester, course_year))


class Enrollment(db.Model):
    __tablename__ = 'enrollment'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'))
    course_id = db.Column(db.Integer, db.ForeignKey(
        'coursepersemester.course_id'))
    enrollment_date = db.Column(
        db.DateTime, default=db.func.now())  # Get current dateTime

    enrolled_student = db.relationship(
        'Student', backref='enrollment', viewonly=True)  # Establish many to one
    # Establish many to one
    course = db.relationship(
        'CoursePerSemester', backref='enrollment', viewonly=True)

    # Function to create a student in table
    # Ex. Enrollment.add_student_to_course('1','2')
    @classmethod
    def add_student_to_course(cls, student_id, course_id, course_semester, course_year):
        q = Enrollment.query.filter_by(student_id=student_id, course_id=course_id,
                                       course_semester=course_semester, course_year=course_year).first()

        if (q != None):
            return print("Student ID %d is already enrolled for course ID %d during the %s %d semester." % (student_id, course_id, course_semester, course_year))

        enroll = Enrollment(student_id=student_id, course_id=course_id,
                            course_semester=course_semester, course_year=course_year)
        db.session.add(enroll)
        db.session.commit()

        return print("Student ID %d has successfully enrolled for course ID %d in the %s %d semester." % (student_id, course_id, course_semester, course_year))


class CoursePrerequisites(db.Model):
    __tablename__ = 'courseprereqs'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'))
    prereq_id = db.Column(db.Integer, db.ForeignKey(
        'courses.id'))  # Foreign key of class pre-req

    course = db.relationship('Courses', foreign_keys=[course_id])
    prereq_course = db.relationship('Courses', foreign_keys=[prereq_id])

    # Placeholder function

    @classmethod
    def add_class_prereq(cls, course_id, prereq_id):
        return


class Programs(db.Model):
    __tablename__ = 'programs'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey(
        'departments.id'))  # Departments foreign key
    num_units = db.Column(db.Integer, nullable=False)

    courses = db.relationship(
        'ProgramCourses', backref='program')         # One to Many
    advisors = db.relationship(
        'ProgramAdvisors', backref='program')       # One to Many


class ProgramCourses(db.Model):
    __tablename__ = 'programcourses'
    id = db.Column(db.Integer, primary_key=True)
    program_id = db.Column(db.Integer, db.ForeignKey(
        'programs.id'))  # Programs foreign key
    course_id = db.Column(db.Integer, db.ForeignKey(
        'courses.id'))  # Courses foreign key

    # True = required, False = elective
    is_required = db.Column(db.Boolean, default=True, nullable=False)

    @classmethod
    def add_course_to_program(cls, program_id, course_id, is_required=True):
        q = ProgramCourses.query.filter_by(
            program_id=program_id, course_id=course_id).first()

        if (q != None):
            return print("Course ID %d is already within program ID %d." % (course_id, program_id))

        a = ProgramCourses(program_id=program_id,
                           course_id=course_id, is_required=is_required)
        db.session.add(a)
        db.session.commit()

        return print("Course ID %d added to program ID %d." % (course_id, program_id))


class ProgramAdvisors(db.Model):
    __tablename__ = 'programadvisors'
    id = db.Column(db.Integer, primary_key=True)
    program_id = db.Column(db.Integer, db.ForeignKey('programs.id'))
    faculty_id = db.Column(db.Integer, db.ForeignKey('faculty.id'))

    @classmethod
    def add_advisor_to_program(cls, program_id, faculty_id):
        q = ProgramAdvisors.query.filter_by(
            program_id=program_id, faculty_id=faculty_id).first()

        if (q != None):
            return print("Faculty ID %d already exists for program ID %d." % (faculty_id, program_id))

        p = ProgramAdvisors(program_id=program_id, faculty_id=faculty_id)
        db.session.add(p)
        db.session.commit()

        return print("Successfully added faculty ID %d to program ID %d." % (faculty_id, program_id))


class ProgramOutline(db.Model):
    __tablename__ = 'programoutline'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'))
    program_id = db.Column(db.Integer, db.ForeignKey(
        'programs.id'))  # Programs foreign key
    version_number = db.Column(db.Integer, nullable=False)
    # "Approved", "Dropped", "Waived". If "Approved", cannot be deleted BUT can be modified
    course_status = db.Column(db.String, nullable=True)
    change_date = db.Column(db.DateTime, default=datetime.utcnow)
    approver_id = db.Column(db.Integer, db.ForeignKey(
        'users.id'))  # Users foreign key

    # User or Faculty approval?
    approver = db.relationship('Users', backref='outlines_approved')
    program = db.relationship('Programs', backref='outlines')

    # StudentGrades can query for the courses that are already completed for the student
    # Can be compared with ProgramCourses to find what courses are still required


class CourseByOutline(db.Model):
    __tablename__ = 'coursebyoutline'
    id = db.Column(db.Integer, primary_key=True)
    outline_id = db.Column(db.Integer, db.ForeignKey('programoutline.id'))
    # Foreign key to reference list of program courses
    course_id = db.Column(
        db.Integer, db.ForeignKey('programcourses.course_id'))

    course = db.relationship('ProgramCourses', backref='outlines_present')
    program_outline = db.relationship('ProgramOutline', backref='courses')


# Create registration.db
with app.app_context():
    db.create_all()
