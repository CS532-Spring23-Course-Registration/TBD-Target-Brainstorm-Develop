import unittest
from app import app, db, Student, Faculty, FacultyTeachingDepartments, Users, Departments, Programs, MajorOutline, MinorOutline, Courses, CoursePerSemester, Enrollment, CoursePrerequisites, CourseByOutline
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

class TestApp(unittest.TestCase):

    # Set up a temporary in-memory database for testing
    def setUp(self):
        self.app = app.test_client()
        # app.config['TESTING'] = True
        # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        # db.create_all()

    # #Test creating a new student: Pass
    # def test_create_student(self):
    #     with app.app_context():
    #         # Create a new student
    #         Student.create('Test Student', '1234567890', '123 Main St', '01/01/2000', 'Computer Science')
    #         # Check if the student was added to the database
    #         student = Student.query.filter_by(name='Test Student').first()
    #         self.assertIsNotNone(student)
    #         self.assertEqual(student.phone_number, '1234567890')
    #         self.assertEqual(student.address, '123 Main St')
    #         self.assertEqual(student.dob, '01/01/2000')
    #         self.assertEqual(student.major, 'Computer Science')
    #         self.assertIsNone(student.minor)

    # # #Test creating a new faculty member: Pass
    # def test_create_faculty(self):
    #     with app.app_context():
    #         # Create a new department
    #         Departments.add('English')
    #         department = Departments.query.filter_by(name='English').first()
    #         # Create a new faculty member
    #         Faculty.create('Test Faculty', 'Professor', '0987654321', 'H-246', '1')
    #         # Check if the faculty member was added to the database
    #         faculty = Faculty.query.filter_by(name='Test Faculty').first()
    #         self.assertIsNotNone(faculty)
    #         self.assertEqual(faculty.position_title, 'Professor')
    #         self.assertEqual(faculty.phone_number, '0987654321')
    #         self.assertEqual(faculty.office_number, 'H-246')
    #         self.assertIsNone(faculty.office_hours)
    #         self.assertEqual(faculty.assigned_department, 1)

    # # Test adding a teaching department to a faculty member: Pass
    # def test_add_teaching_department(self):
    #     with app.app_context():
    #         # Create a new department
    #         Departments.add('English')
    #         department = Departments.query.filter_by(name='English').first()
    #         # Create a new faculty member
    #         Faculty.create('Test Faculty', 'Professor', '0987654321', 'H-246', '1')
    #         faculty = Faculty.query.filter_by(name='Test Faculty').first()
    #         # Add the department to the faculty member's teaching departments
    #         FacultyTeachingDepartments.add(faculty.id, department.id)
    #         # Check if the department was added to the faculty member's teaching departments
    #         teaching_departments = [t.department_id for t in faculty.teaching_departments]
    #         self.assertIn(department.id, teaching_departments)

    # # Test creating a new user: Pass
    # def test_create_user(self):
    #     with app.app_context():
    #         # Create a new user
    #         Users.create('Test User', 'password', 'Admin', 'admin')
    #         # Check if the user was added to the database
    #         user = Users.query.filter_by(name='Test User').first()
    #         self.assertIsNotNone(user)
    #         self.assertEqual(user.job_title, 'Admin')
    #         self.assertEqual(user.permissions, 'admin')

    # # Test adding a new department: Pass
    # def test_departments_add(self):
    #     with app.app_context():
    #         Departments.add('Computer Science')
    #         d = Departments.query.filter_by(name='Computer Science').first()
    #         self.assertIsNotNone(d)
    
    # # Test adding a new course: Pass
    # def test_courses_add(self):
    #     with app.app_context():
    #         Departments.add('Computer Science')
    #         Courses.add('Intro to CS', 3.0, 1)
    #         c = Courses.query.filter_by(name='Intro to CS').first()
    #         self.assertIsNotNone(c)
    
    # # Test enrolling a student to a course: NOT DONE
    # def test_enrollment_add_student_to_course(self):
    #     with app.app_context():
    #         # create engine to connect to the database
    #         engine = create_engine('sqlite:///registration.db', echo=True) 

    #         # Create a session to interact with the database
    #         Session = sessionmaker(bind=engine)
    #         session = Session()

    #         # create a new student
    #         Student.create('Test Student', '1234567890', '123 Main St', '01/01/2000', 'Computer Science')
    #         student_id = session.query(Student).filter(
    #         # create a new course
    #         Departments.add('Computer Science')
    #         Courses.add('Intro to CS', 3.0, 1)
        
    #         # enroll the student in the course
    #         Enrollment.add_student_to_course(1, 1)
        
    #         # retrieve the enrollment record from the database
    #         enrollment = Enrollment.query.filter_by(student_id=1, course_id=1).first()
        
    #         # assert that the enrollment record was created
    #         self.assertIsNotNone(enrollment)
    #         self.assertEqual(enrollment.student_id, 1)
    #         self.assertEqual(enrollment.course_id, 1)
