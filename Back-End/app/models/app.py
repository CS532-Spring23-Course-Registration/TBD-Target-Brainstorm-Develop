from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///registration.db'

# Init database
db = SQLAlchemy(app)


class Student(db.Model):
    __tablename__ = 'students'
    student_id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(100), nullable=False)
    student_phone_number = db.Column(db.String(20), nullable=False)
    student_address = db.Column(db.String(100), nullable=False)
    student_dob = db.Column(db.String(100), nullable=False)
    student_major = db.Column(db.String(100), nullable=False)
    student_minor = db.Column(db.String(100), nullable=True)
    misc =  db.Column(db.String(20), nullable=True)
    
class StudentGrades(db.Model):
    __tablename__ = 'studentgrades'
    student_id = db.Column(db.Integer(), db.ForeignKey('students.student_id'), primary_key=True)
    grade = db.Column(db.String(2), nullable=False)
    course_semester_id = db.Column(db.Integer(), db.ForeignKey('students.student_id')) # CoursesPerSemester foreign key

class StudentMiscNotes(db.Model):
    __tablename__ = 'studentmiscnotes'
    student_id = db.Column(db.Integer(), db.ForeignKey('students.student_id'), primary_key=True)
    edit_time = db.Column(db.DateTime, default=datetime.utcnow)
    editor_id = db.Column(db.Integer(), db.ForeignKey('users.user_id')) # Users foreign key
    student_misc_notes = db.Column(db.String(500), nullable=True)
    
class Faculty(db.Model):
    __tablename__ = 'faculty'
    faculty_id = db.Column(db.Integer, primary_key=True) # 12 digit ID number
    faculty_name = db.Column(db.String(100), nullable=False)
    faculty_position_title = db.Column(db.String(50), nullable=False)
    faculty_phone_number = db.Column(db.String(20), nullable=False)
    faculty_office_number = db.Column(db.String(20), nullable=False)
    faculty_office_hours = db.Column(db.DateTime, nullable=True)
    faculty_assigned_department = db.Column(db.Integer(), db.ForeignKey('departments.department_id')) # Departments foreign key

class Users(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(100), nullable=False)
    user_password = db.Column(db.String(100), nullable=False) # Store hash possibly?
    user_job_title = db.Column(db.String(50), nullable=False)
    user_permissions = db.Column(db.String(10), nullable=False)

class Departments(db.Model):
    __tablename__ = 'departments'
    department_id = db.Column(db.Integer, primary_key=True)
    department_name = db.Column(db.String(50), nullable=False)
    
class Programs(db.Model):
    __tablename__ = 'programs'
    program_id = db.Column(db.Integer, primary_key=True) # 4 digit ID
    department_id = db.Column(db.Integer(), db.ForeignKey('departments.department_id')) # Departments foreign key
    program_name = db.Column(db.String(50), nullable=False)
    
class MajorOutline(db.Model):
    __tablename__ = 'majoroutline'
    program_id = db.Column(db.Integer(), db.ForeignKey('programs.program_id')) # Programs foreign key
    outline_id = db.Column(db.Integer, primary_key=True) # 4 digit ID
    total_units = db.Column(db.Float, nullable=False)
    elective_units = db.Column(db.Float, nullable=False)
    creator_id = db.Column(db.Integer(), db.ForeignKey('users.user_id')) # Users foreign key
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
class MinorOutline(db.Model):
    __tablename__ = 'minoroutline'
    program_id = db.Column(db.Integer(), db.ForeignKey('programs.program_id')) # Programs foreign key
    outline_id = db.Column(db.Integer, primary_key=True) # 4 digit ID
    total_units = db.Column(db.Float, nullable=False)
    elective_units = db.Column(db.Float, nullable=False)
    creator_id = db.Column(db.Integer(), db.ForeignKey('users.user_id')) # Users foreign key
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
class Courses(db.Model):
    __tablename__ = 'courses'
    course_id = db.Column(db.Integer, primary_key=True)
    num_units = db.Column(db.Float, nullable=False)
    department_id = db.Column(db.Integer(), db.ForeignKey('departments.department_id'))

class CoursePerSemester(db.Model):
    __tablename__ = 'coursepersemester'
    course_id = db.Column(db.Integer(), db.ForeignKey('courses.course_id'), primary_key=True) # Courses foreign key
    course_semester_id = db.Column(db.Integer, nullable=False) 
    course_semester = db.Column(db.String(20), nullable=False)
    faculty_id = db.Column(db.Integer(), db.ForeignKey('courses.course_id')) # Faculty foreign key
    schedule_number = db.Column(db.Integer, nullable=False) # 2 digit number
    course_date_time = db.Column(db.DateTime, nullable=False) # Format (DD HH:MM-HH:MM)
    course_location = db.Column(db.String(20), nullable=False) # 'On-line' or 'Campus'
    max_seats = db.Column(db.Integer, nullable=False) # 4 digit number
    seats_available = db.Column(db.Integer, nullable=False) # 4 digit number
    
class CoursePrerequisites(db.Model):
    __tablename__ = 'courseprereqs'
    course_id = db.Column(db.Integer(), db.ForeignKey('courses.course_id'), primary_key=True)
    prereq_id = db.Column(db.Integer(), db.ForeignKey('courses.course_id')) # Foreign key of class pre-req

class CourseByOutline(db.Model):
    __tablename__ = 'coursebyoutline'
    course_id = db.Column(db.Integer(), db.ForeignKey('courses.course_id'), primary_key=True)
    major_outline_id = db.Column(db.Integer(), db.ForeignKey('majoroutline.outline_id'), nullable=True)
    minor_outline_id = db.Column(db.Integer(), db.ForeignKey('minoroutline.outline_id'), nullable=True)
    course_required = db.Column(db.Boolean, default=True, nullable=False)

# Create registration.db
with app.app_context():
    db.create_all()