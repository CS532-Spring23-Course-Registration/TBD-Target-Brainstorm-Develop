import unittest
from app import app, db,ProgramOutline,ProgramAdvisors,ProgramCourses,StudentMiscNotes,StudentGrades, Student, Faculty, FacultyTeachingDepartments, Users, Departments, Programs, Courses, CoursePerSemester, Enrollment, CoursePrerequisites, CourseByOutline
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

    # #Test creating a new faculty member: Pass
    def test_create_faculty(self):
        with app.app_context():
            department = Departments.query.filter_by(name='Computer Science').first()
            # Create a new faculty member
            Faculty.create('Test Faculty', 'Professor', '0987654321', 'H-246', '1')
            faculty = Faculty.query.filter_by(name='Test Faculty').first()
            self.assertIsNotNone(faculty)
            self.assertEqual(faculty.position_title, 'Professor')
            self.assertEqual(faculty.phone_number, '0987654321')
            self.assertEqual(faculty.office_number, 'H-246')
            self.assertIsNone(faculty.office_hours)
            self.assertEqual(faculty.assigned_department, 1)

    # Test creating new program: Passed
    def test_create_program(self):
        with app.app_context():
            # Create a department to associate with the program
            department = Departments.query.filter_by(name='Computer Science').first()

            # Check if the program was added to the database
            Programs.create('Computer Science', department.id, 3)
            program = Programs.query.filter_by(name='Computer Science').first()
            self.assertIsNotNone(program)
            self.assertEqual(program.department_id, department.id)
            self.assertEqual(program.num_units, 3)

    # Test adding grade for student: PASSED
    def test_add_grade_for_student(self):
        with app.app_context():
            # Create a new student
            student = Student.query.filter_by(name='Test Student').first()

            # Create a new department
            faculty = Faculty.query.filter_by(name='Test Faculty').first()

            # Create a new course
            course = CoursePerSemester.query.filter_by(name='Intro to CS').first()
            self.assertIsNotNone(course)

            # Add a grade for the student in the course
            StudentGrades.add_grade_for_student(student.id, course.id, 'A', 3)
            grade = StudentGrades.query.filter_by(student_id=student.id, course_sem_id=course.id).first()
            self.assertIsNotNone(grade)
            self.assertEqual(grade.grade, 'A')
            self.assertEqual(grade.earned_credits, 3)

    # Test create note for StudentMiscNotes
    def test_create_note_for_student(self):
        with app.app_context():

            #Create a new student
            student = Student.query.filter_by(name='Test Student').first()

            # Create a new department
            department = Departments.query.filter_by(name='Computer Science').first()

            # Check if the faculty member was added to the database
            faculty = Faculty.query.filter_by(name='Test Faculty').first()

            # Create a note for the student
            StudentMiscNotes.create_note(student.id, faculty.id, 'Test note')

            # Check if the note was added to the database
            note = StudentMiscNotes.query.filter_by(student_id=student.id).first()
            self.assertIsNotNone(note)
            self.assertEqual(note.description, 'Test note')

    # Test adding a teaching department to a faculty member: Pass
    def test_add_teaching_department(self):
        with app.app_context():
            # Create a new department
            department = Departments.query.filter_by(name='Computer Science').first()
            # Create a new faculty member
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

    # Test creating a new program: Pass
    def test_add_program(self):
        with app.app_context():
            # create a new department
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
            c = Courses.query.filter_by(name='Intro to CS').first()

            # Check if the faculty member was added to the database
            faculty = Faculty.query.filter_by(name='Test Faculty').first()
            self.assertIsNotNone(faculty)

            # Add the course to a semester
            CoursePerSemester.add_course_to_semester(c.id, 'Fall', faculty.id, 'MW 1200-1315', 'Online', 20, 11)
            
            # Check if the course was added to the semester
            course_semester = CoursePerSemester.query.filter_by(course_id=c.id, course_semester='Fall').first()
            self.assertIsNotNone(course_semester)
            self.assertEqual(course_semester.title, 'CS151')
            self.assertEqual(course_semester.name, 'Intro to CS')
            self.assertIsNone(course_semester.description)
            self.assertEqual(course_semester.course_date_time, 'MW 1200-1315')
            self.assertEqual(course_semester.course_location, 'Online')
            self.assertEqual(course_semester.max_seats, 20)
            self.assertEqual(course_semester.seats_available, 11)

    # Test adding a new enrollment: Pass
    def test_add_enrollment(self):
        with app.app_context():
            # Create a new student
            student = Student.query.filter_by(name='Test Student').first()
            self.assertIsNotNone(student)

            # Create a new department
            department = Departments.query.filter_by(name='Computer Science').first()

            # Create a new program
            program = Programs.query.filter_by(name='Computer Science').first()

            # Create a new course
            course = Courses.query.filter_by(name='Intro to CS').first()

            # Create a new faculty member
            faculty = Faculty.query.filter_by(name='Test Faculty').first()
            self.assertIsNotNone(faculty)

            # Add the course to a semester
            course_semester = CoursePerSemester.query.filter_by(course_id=course.id, course_semester='Fall').first()

            # Add the student to the enrollment for the course semester
            Enrollment.add_student_to_course(student.id, course_semester.id)
            enrollment = Enrollment.query.filter_by(student_id=student.id, course_sem_id=course_semester.id).first()
            self.assertIsNotNone(enrollment)
            self.assertEqual(enrollment.student_id, student.id)
            self.assertEqual(enrollment.course_sem_id, course_semester.id)

    # Test adding a new course prerequisite: Pass
    def test_add_course_prereq(self):
        with app.app_context():
            # Create courses
            Courses.add('CS101','Intro to Computer Science', 3.0, 1)
            Courses.add('CS201','Intermediate Computer Science', 3.0, 1)
            # Retrieve courses
            course1 = Courses.query.filter_by(name='Intro to Computer Science').first()
            course2 = Courses.query.filter_by(name='Intermediate Computer Science').first()
            # Add course2 as a prerequisite for course1
            CoursePrerequisites.add_course_prereq(course1.id, course2.id)
            # Check if the prerequisite was added to the database
            prereq = CoursePrerequisites.query.filter_by(course_id=course1.id, prereq_id=course2.id).first()
            self.assertIsNotNone(prereq)
            self.assertEqual(prereq.course_id, course1.id)
            self.assertEqual(prereq.prereq_id, course2.id)

    # Test adding a new program: Pass
    def test_add_program(self):
        with app.app_context():
            # create a new department
            department = Departments.query.filter_by(name='Computer Science').first()
            self.assertEqual(department.id, 1)
            # add a new course
            
            course = Courses.query.filter_by(name='Intro to CS').first()

            # add the course to the program
            program = Programs.query.filter_by(name='Computer Science').first()
            ProgramCourses.add_course_to_program(program.id, course.id)

            # check if the course was added to the program
            program_course = ProgramCourses.query.filter_by(program_id=program.id, course_id=course.id).first()
            self.assertIsNotNone(program_course)
            self.assertEqual(program_course.program_id, program.id)
            self.assertEqual(program_course.course_id, course.id)
            self.assertTrue(program_course.is_required)

    # Test add advisor to program:
    def test_add_advisor_to_program(self):
        with app.app_context():
            # create a new department
            department = Departments.query.filter_by(name='Computer Science').first()

            # add a new course
            course = Courses.query.filter_by(name='Intro to CS').first()

            # add the course to the program
            program = Programs.query.filter_by(name='Computer Science').first()

            # Check if the faculty member was added to the database
            faculty = Faculty.query.filter_by(name='Test Faculty').first()

            ProgramAdvisors.add_advisor_to_program(program.id,faculty.id)
            q = ProgramAdvisors.query.filter_by(program_id=program.id, faculty_id=faculty.id).first()
            self.assertIsNotNone(q)
            self.assertEqual(q.program_id, program.id)

    # Test ProgramOutline.create: Passed
    def test_program_outline_create(self):
        with app.app_context():
            student = Student.query.filter_by(name='Test Student').first()
            program = Programs.query.filter_by(name='Computer Science').first()
            faculty = Faculty.query.filter_by(name='Test Faculty').first()

            # Create new program outline
            ProgramOutline.create(student.id, program.id, 1, faculty.id)

            # Check if the program outline was added to the database
            outline = ProgramOutline.query.filter_by(student_id=student.id, program_id=program.id).first()
            self.assertIsNotNone(outline)
            self.assertEqual(outline.version_number, 1)

    # Test CourseByOutline.add_course_to_outline:
    def test_add_course_to_outline(self):
        with app.app_context():
            course = Courses.query.filter_by(name='Intro to CS').first()
            program = Programs.query.filter_by(name='Computer Science').first()
            student = Student.query.filter_by(name='Test Student').first()
            outline = ProgramOutline.query.filter_by(student_id=student.id, program_id=program.id).first()

            # Add course to outline
            CourseByOutline.add_course_to_outline(outline.id, course.id)

            # Check if the course was added to the program outline
            course_by_outline = CourseByOutline.query.filter_by(outline_id=outline.id, course_id=course.id).first()
            self.assertIsNotNone(course_by_outline)
            self.assertEqual(course_by_outline.outline_id, outline.id)
            self.assertEqual(course_by_outline.course_id, course.id)


