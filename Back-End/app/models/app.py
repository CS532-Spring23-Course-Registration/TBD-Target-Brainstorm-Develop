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
    dob = db.Column(db.Date, nullable=False) # Possible convert to DateTime rather than string
    major = db.Column(db.String(100), nullable=False)
    minor = db.Column(db.String(100), nullable=True)

    # Many-to-Many
    enrolled_courses = db.relationship('CoursePerSemester', secondary='enrollment', backref='student', overlaps='enrolled_courses,student')

    # One-to-One
    grades = db.relationship('StudentGrades', backref='student', uselist=False)
    misc_notes = db.relationship('StudentMiscNotes', backref='student', uselist=False)
    
    # Function to create a student in table
    # Ex. Student.create('Robert', '85851112222', '555 Main St', date(1998,6,27), 'Computer Science')
    @classmethod
    def create(cls, name, phone_number, address, dob, major, minor=None):
        s = Student(name=name, phone_number=phone_number, address=address, dob=dob, major=major, minor=minor)
        db.session.add(s)
        db.session.commit()
        
        return print("Student %s created with ID %d" % (name, s.id))

    
class StudentGrades(db.Model):
    __tablename__ = 'studentgrades'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), unique=True)
    course_id = db.Column(db.Integer, db.ForeignKey('coursepersemester.id')) # CoursePerSemester foreign key
    grade = db.Column(db.String(2), nullable=False)
    
    
class StudentMiscNotes(db.Model):
    __tablename__ = 'studentmiscnotes'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), unique=True)
    edit_time = db.Column(db.DateTime, default=datetime.utcnow)
    editor_id = db.Column(db.Integer, db.ForeignKey('users.id')) # Users foreign key
    description = db.Column(db.String(500), nullable=True)
 
 
    @classmethod
    def create_note(student_id, editor_id, description):
        q = Student.query.filter_by(id=student_id).first()
        
        if (q != None):
            mn = StudentMiscNotes(student_id=student_id,editor_id=editor_id,description=description)
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
    assigned_department = db.Column(db.Integer, db.ForeignKey('departments.id')) # Departments foreign key
    
    teaching_departments = db.relationship('FacultyTeachingDepartments', backref='faculty') # One to Many
    courses = db.relationship('CoursePerSemester', backref='faculty') # One to many for courses
    
    # Function to create a faculty member in table. Prints error if the assigned_department ID is not within Departments database
    # Ex. Faculty.create('name','title','phone','H-246','5')
    @classmethod
    def create(cls, name, position_title, phone_number, office_number, assigned_department, office_hours=None):
        q = Departments.query.filter_by(id=assigned_department).first() # Query if department is valid
        
        if (q != None):
            f = Faculty(name=name, position_title=position_title,phone_number=phone_number, office_number=office_number, assigned_department=assigned_department, office_hours=office_hours)
            db.session.add(f)
            db.session.commit()
            
            return print("Faculty member %s created with ID %d" % (name, f.id))
        else:
            return print("Department ID %s not found." % assigned_department)
    
    
class FacultyTeachingDepartments(db.Model):
    __tablename__ = 'facultyteachingdepartments'
    id = db.Column(db.Integer, primary_key=True)
    faculty_id = db.Column(db.ForeignKey('faculty.id'), unique=True)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id')) # one to many
    
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
                    return print("Department %s is already added to faculty member %s." % (d.name, f.name)) # Print error if department_id is already within faculty's teaching departments
            
            ft = FacultyTeachingDepartments(faculty_id=f.id, department_id=d.id)
            db.session.add(ft)
            db.session.commit()
            return print("Successfully added %s to Faculty member %s." % (d.name, f.name))
        else:
            return print("Invalid faculty ID.")
            

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False) # Store hash possibly?
    job_title = db.Column(db.String(50), nullable=False)
    permissions = db.Column(db.String(10), nullable=False)
    
    note_edits = db.relationship('StudentMiscNotes', backref='editor')

    # Function to create a user within the system. 
    # Ex. Users.create('name', 'passwordhash','jobtitle','admin')
    @classmethod
    def create(cls, name, password, job_title, permissions):
        u = Users(name=name, password=password, job_title=job_title, permissions=permissions)
        db.session.add(u)
        db.session.commit()
        
        return print("User %s created with ID %d" % (name, u.id))
    
    def get_user_by_username(name):
        Session = sessionmaker(bind=db.engine)
        session = Session()
        user = session.query(Users).filter_by(name=name).first()
        session.close()
        return user
        

class Departments(db.Model):
    __tablename__ = 'departments'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    
    faculty_id = db.relationship('Faculty', backref='assigneddepartment') # Establish many to one
    courses = db.relationship('Courses', backref='department')
    
    # Function to add a department to the Departments table. Error handling if a duplicate department is detected.
    # Ex. Departments.add('English')
    @classmethod
    def add(cls, name):
        q = Departments.query.filter_by(name=name).first()
        if q and (q.name == name):
            return print("Duplicate department found with ID %d." % q.id)
        
        d = Departments(name=name)
        db.session.add(d)
        db.session.commit()

        return print("Department %s created with ID %d" % (name, d.id))
    
    
class Programs(db.Model):
    __tablename__ = 'programs'
    id = db.Column(db.Integer, primary_key=True) # 4 digit ID
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id')) # Departments foreign key
    name = db.Column(db.String(50), nullable=False)
    
    
class MajorOutline(db.Model):
    __tablename__ = 'majoroutline'
    id = db.Column(db.Integer, primary_key=True) # 4 digit ID
    program_id = db.Column(db.Integer, db.ForeignKey('programs.id')) # Programs foreign key
    total_units = db.Column(db.Float, nullable=False)
    elective_units = db.Column(db.Float, nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id')) # Users foreign key
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    user_creator = db.relationship('Users', backref='majoroutline')
    
    
class MinorOutline(db.Model):
    __tablename__ = 'minoroutline'
    id = db.Column(db.Integer, primary_key=True) # 4 digit ID
    program_id = db.Column(db.Integer, db.ForeignKey('programs.id')) # Programs foreign key
    total_units = db.Column(db.Float, nullable=False)
    elective_units = db.Column(db.Float, nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id')) # Users foreign key
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    user_creator = db.relationship('Users', backref='minoroutline')
    
    
class Courses(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    num_units = db.Column(db.Float, nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'))
    
    # Function to add a course to the Courses table.
    # Ex. Courses.add('Calculus 2', 3.0, '3')
    @classmethod
    def add(cls, name, num_units, department_id):
        q = Departments.query.filter_by(id=department_id).first()   # Query if department ID is valid
        
        if (q == None):
            return print("Department not found with given ID.")
        
        c = Courses(name=name, num_units=num_units, department_id=department_id)
        db.session.add(c)
        db.session.commit()
        
        return print("Course %s added with id %d" % (name, c.id))


class CoursePerSemester(db.Model):
    __tablename__ = 'coursepersemester'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id')) # Courses foreign key
    course_year = db.Column(db.Integer, nullable=False) # Year, ex. 2023
    course_semester = db.Column(db.String(20), nullable=False)
    faculty_id = db.Column(db.Integer, db.ForeignKey('faculty.id')) # Faculty foreign key
    schedule_number = db.Column(db.Integer, nullable=False) # 2 digit number
    course_date_time = db.Column(db.String, nullable=False) # Format (DD HH:MM-HH:MM) String for now
    course_location = db.Column(db.String(20), nullable=False) # 'On-line' or Campus room number
    max_seats = db.Column(db.Integer, nullable=False) # 4 digit number
    seats_available = db.Column(db.Integer, nullable=False) # 4 digit number
    
    students = db.relationship('Student', secondary='enrollment', backref='coursepersemester',overlaps='enrolled_courses,student')
    course = db.relationship('Courses', backref='coursepersemester') # many to one to Courses
    
    # Function to add a course to a given semester.
    # Ex. CoursePerSemester.add_course_to_semester(1,2023,'Fall',3,1,'W 1200-1315', 'Online', 20, 11)
    @classmethod
    def add_course_to_semester(cls, course_id, course_year, course_semester, faculty_id, schedule_number, course_date_time, course_location, max_seats, seats_available):
        q_course = Courses.query.filter_by(id=course_id).first()
        q_faculty = Faculty.query.filter_by(id=faculty_id).first()
        
        if (q_course == None):
            return print("Course ID %d not found." % course_id)
        if (q_faculty == None):
            return print("Faculty ID %d not found." % faculty_id)
        
        # Detect duplicates within given semester
        q_c = CoursePerSemester.query.filter_by(course_id=course_id, course_year=course_year, course_semester=course_semester).first()
        
        if (q_c != None):
            return print("Dupicate course found within given semester: %s %d." % (course_semester, course_year))
        
        # max_seats and seats_available validation
        if (max_seats < seats_available):
            return print("max_seats inputted is less than seats_available.")
        
        
        c = CoursePerSemester(course_id=course_id,course_year=course_year,course_semester=course_semester,faculty_id=faculty_id,schedule_number=schedule_number,course_date_time=course_date_time,
                              course_location=course_location,max_seats=max_seats,seats_available=seats_available)

        db.session.add(c)
        db.session.commit()
        
        return print("Added course %s to %s %d semester." % (q_course.name, course_semester, course_year))
    
    
class Enrollment(db.Model):
    __tablename__ = 'enrollment'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('coursepersemester.id'))
    enrollment_date = db.Column(db.DateTime, default=db.func.now()) # Get current dateTime
    
    enrolled_student = db.relationship('Student', backref='enrollment', cascade="all,delete") # Establish many to one
    course = db.relationship('CoursePerSemester', backref='enrollment', overlaps='coursepersemester,enrolled_courses,student,students') # Establish many to one
    
    # Function to create a student in table
    # Ex. Enrollment.add_student_to_course('1','2')
    @classmethod
    def add_student_to_course(cls, student_id, course_id):
        enroll = Enrollment(student_id=student_id, course_id=course_id)
        db.session.add(enroll)
        db.session.commit()
    
    
class CoursePrerequisites(db.Model):
    __tablename__ = 'courseprereqs'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'))
    prereq_id = db.Column(db.Integer, db.ForeignKey('courses.id')) # Foreign key of class pre-req
    
    course = db.relationship('Courses', foreign_keys='CoursePrerequisites.course_id')
    prereq_course = db.relationship('Courses', foreign_keys='CoursePrerequisites.prereq_id')

    # Placeholder function
    @classmethod
    def add_class_prereq(cls, course_id, prereq_id):
        return

class CourseByOutline(db.Model):
    __tablename__ = 'coursebyoutline'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'))
    major_outline_id = db.Column(db.Integer, db.ForeignKey('majoroutline.id'), nullable=True)
    minor_outline_id = db.Column(db.Integer, db.ForeignKey('minoroutline.id'), nullable=True)
    course_required = db.Column(db.Boolean, default=True, nullable=False)
    
    
# Create registration.db
with app.app_context():
    db.create_all()