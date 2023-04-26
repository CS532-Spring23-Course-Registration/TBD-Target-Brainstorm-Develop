import unittest
from app import app, db,StudentMiscNotes,StudentGrades, Student, Faculty, FacultyTeachingDepartments, Users, Departments, Programs, Courses, CoursePerSemester, Enrollment, CoursePrerequisites, CourseByOutline
from datetime import datetime, date
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

    # Test creating a new student: Pass
    def test_create_student(self):
        with app.app_context():
            # Create a new student
            Student.create('Test Student', '1234567890', '123 Main St', datetime(2000,1,1), 'Computer Science')
            # Check if the student was added to the database
            student = Student.query.filter_by(name='Test Student').first()
            self.assertIsNotNone(student)
            self.assertEqual(student.phone_number, '1234567890')
            self.assertEqual(student.address, '123 Main St')
            self.assertEqual(student.dob, date(2000,1,1))
            self.assertEqual(student.major, 'Computer Science')
            self.assertIsNone(student.minor)

    # Test adding grade for student: Passed
    def test_add_grade_for_student(self):
        with app.app_context():
            # Create a new student
            Student.create('Test Student', '1234567890', '123 Main St', datetime(2000,1,1), 'Computer Science')
            student = Student.query.filter_by(name='Test Student').first()
            self.assertIsNotNone(student)

            # Create a new course
            Departments.add('Computer Science')
            Courses.add('CS151','Intro to CS', 3.0, 1)
            course = Courses.query.filter_by(name='Intro to CS').first()
            self.assertIsNotNone(course)

            # Add a grade for the student in the course
            StudentGrades.add_grade_for_student(student.id, course.id, 'A', 3)
            grade = StudentGrades.query.filter_by(student_id=student.id, course_id=course.id).first()
            self.assertIsNotNone(grade)
            self.assertEqual(grade.grade, 'A')
            self.assertEqual(grade.earned_credits, 3)

    # Test create note for StudentMiscNotes
    def test_create_note_for_student(self):
        with app.app_context():

            #Create a new student
            Student.create('Test Student', '1234567890', '123 Main St', datetime(2000,1,1), 'Computer Science')
            student = Student.query.filter_by(name='Test Student').first()
            self.assertIsNotNone(student)

            # Create a new department
            Departments.add('English')
            department = Departments.query.filter_by(name='English').first()
            # Create a new faculty member
            Faculty.create('Test Faculty', 'Professor', '0987654321', 'H-246', '1')
            # Check if the faculty member was added to the database
            faculty = Faculty.query.filter_by(name='Test Faculty').first()
            self.assertIsNotNone(faculty)

            # Create a note for the student
            StudentMiscNotes.create_note(student.id, faculty.id, 'Test note')

            # Check if the note was added to the database
            note = StudentMiscNotes.query.filter_by(student_id=student.id).first()
            self.assertIsNotNone(note)
            self.assertEqual(note.editor_id, faculty.id)
            self.assertEqual(note.description, 'Test note')



    # #Test creating a new faculty member: Pass
    def test_create_faculty(self):
        with app.app_context():
            # Create a new department
            Departments.add('English')
            department = Departments.query.filter_by(name='English').first()
            # Create a new faculty member
            Faculty.create('Test Faculty', 'Professor', '0987654321', 'H-246', '1')
            # Check if the faculty member was added to the database
            faculty = Faculty.query.filter_by(name='Test Faculty').first()
            self.assertIsNotNone(faculty)
            self.assertEqual(faculty.position_title, 'Professor')
            self.assertEqual(faculty.phone_number, '0987654321')
            self.assertEqual(faculty.office_number, 'H-246')
            self.assertIsNone(faculty.office_hours)
            self.assertEqual(faculty.assigned_department, 1)

    # Test adding a teaching department to a faculty member: Pass
    def test_add_teaching_department(self):
        with app.app_context():
            # Create a new department
            Departments.add('English')
            department = Departments.query.filter_by(name='English').first()
            # Create a new faculty member
            Faculty.create('Test Faculty', 'Professor', '0987654321', 'H-246', '1')
            faculty = Faculty.query.filter_by(name='Test Faculty').first()
            # Add the department to the faculty member's teaching departments
            FacultyTeachingDepartments.add(faculty.id, department.id)
            # Check if the department was added to the faculty member's teaching departments
            teaching_departments = [t.department_id for t in faculty.teaching_departments]
            self.assertIn(department.id, teaching_departments)

    # Test creating a new user: Pass
    def test_create_user(self):
        with app.app_context():
            # Create a new user
            Users.create('Test User', 'password', 'Admin', 'admin')
            # Check if the user was added to the database
            user = Users.query.filter_by(name='Test User').first()
            self.assertIsNotNone(user)
            self.assertEqual(user.job_title, 'Admin')
            self.assertEqual(user.permissions, 'admin')

    # Test adding a new department: Pass
    def test_departments_add(self):
        with app.app_context():
            Departments.add('Computer Science')
            d = Departments.query.filter_by(name='Computer Science').first()
            self.assertIsNotNone(d)
    
    # Test adding a new course: Pass
    def test_courses_add(self):
        with app.app_context():
            Departments.add('Computer Science')
            Courses.add('CS151','Intro to CS', 3.0, 1)
            c = Courses.query.filter_by(name='Intro to CS').first()
            self.assertIsNotNone(c)

    # Test creating a new program: Pass
    def test_add_program(self):
            with app.app_context():
                # create a new department
                Departments.add('Computer Science')
                department = Departments.query.filter_by(name='Computer Science').first()

                # create a new program
                Programs.create('Computer Science', department.id, 3)

                # check if the program was added to the database
                program = Programs.query.filter_by(name='Computer Science').first()
                self.assertIsNotNone(program)
                self.assertEqual(program.department_id, department.id)

    # Test add course to semester: Passed
    def test_add_course_to_semester(self):
        with app.app_context():

            #Create new department
            Departments.add('Computer Science')
            Courses.add('CS151','Intro to CS', 3.0, 1)
            c = Courses.query.filter_by(name='Intro to CS').first()
            self.assertIsNotNone(c)

            # Create a new faculty member
            Faculty.create('Test Faculty', 'Professor', '0987654321', 'H-246', '1')
            # Check if the faculty member was added to the database
            faculty = Faculty.query.filter_by(name='Test Faculty').first()
            self.assertIsNotNone(faculty)

            # Add the course to a semester
            CoursePerSemester.add_course_to_semester(c.id, 2023, 'Fall', faculty.id, 'MW 1200-1315', 'Online', 20, 11)
            
            # Check if the course was added to the semester
            course_semester = CoursePerSemester.query.filter_by(course_id=c.id, course_year=2023, course_semester='Fall').first()
            self.assertIsNotNone(course_semester)
            self.assertEqual(course_semester.title, 'CS151')
            self.assertEqual(course_semester.name, 'Intro to CS')
            self.assertIsNone(course_semester.description)
            self.assertEqual(course_semester.faculty_id, faculty.id)
            self.assertEqual(course_semester.course_date_time, 'MW 1200-1315')
            self.assertEqual(course_semester.course_location, 'Online')
            self.assertEqual(course_semester.max_seats, 20)
            self.assertEqual(course_semester.seats_available, 11)
