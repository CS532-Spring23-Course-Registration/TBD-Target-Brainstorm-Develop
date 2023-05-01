import server
from server import app
import unittest
import json

class TestServer(unittest.TestCase):

    def setUp(self):
        app.testing = True
        self.client = app.test_client()

    # Test get user session key: Passed
    def test_get_user_session_key(self):
        user_id = 123
        session_key = server.get_user_session_key(user_id)
        self.assertIsNotNone(session_key)
        self.assertIsInstance(session_key, str)

     #Test put endpoint with valid session key: Passed
    def test_put_with_valid_session_key(self):
        with app.test_client() as client:
            # Generate a test session key for a test user
            user_id = 123
            session_key = server.get_user_session_key(user_id)

            # Set up the test client and request headers
        
            headers = {'Authorization': session_key}

            # Send a PUT request to the server
            response = client.put('/', headers=headers)

            # Check that the server responded with a 200 status code and "Put complete" message
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data.decode('utf-8'), 'Put complete')

            # Check that the session key is still valid
            self.assertEqual(server.cache.get(session_key), user_id)

    # Test put endpoint with invalid session key: Passed
    def test_put_with_invalid_session_key(self):
        # Generate a test session key for a test user
        user_id = 123
        session_key = server.get_user_session_key(user_id)

        # Set up the test client and request headers with an invalid session key
        with app.test_client() as client:
            headers = {'Authorization': 'invalid-session-key'}

            # Send a PUT request to the server
            response = client.put('/', headers=headers)

            # Check that the server responded with a 401 status code and "Invalid session key" message
            self.assertEqual(response.status_code, 401)
            self.assertEqual(response.json['message'], 'Invalid session key')

            # Check that the original session key is still valid
            self.assertEqual(server.cache.get(session_key), user_id)

    # Test put endpoint with missing session key: Passed
    def test_put_with_missing_session_key(self):
        # Set up the test client and request headers without a session key
        with app.test_client() as client:
            headers = {}

            # Send a PUT request to the server
            response = client.put('/', headers=headers)

            # Check that the server responded with a 401 status code and "Session key is missing" message
            self.assertEqual(response.status_code, 401)
            self.assertEqual(response.json['message'], 'Session key is missing')

     # Test delete endpoint with valid session key: Passed
    def test_delete_with_valid_session_key(self):
        # Generate a test session key for a test user
        user_id = 123
        session_key = server.get_user_session_key(user_id)

        # Set up the test client and request headers
        with app.test_client() as client:
            headers = {'Authorization': session_key}

            # Send a DELETE request to the server
            response = client.delete('/', headers=headers)

            # Check that the server responded with a 200 status code and "Delete complete" message
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data.decode('utf-8'), 'Delete complete')

            # Check that the session key is still valid
            self.assertEqual(server.cache.get(session_key), user_id)

    # Test delete endpoint with invalid session key: Passed
    def test_delete_with_invalid_session_key(self):
        # Generate a test session key for a test user
        user_id = 123
        session_key = server.get_user_session_key(user_id)

        # Set up the test client and request headers with an invalid session key
        with app.test_client() as client:
            headers = {'Authorization': 'invalid-session-key'}

            # Send a DELETE request to the server
            response = client.delete('/', headers=headers)

            # Check that the server responded with a 401 status code and "Invalid session key" message
            self.assertEqual(response.status_code, 401)
            self.assertEqual(response.json['message'], 'Invalid session key')

            # Check that the original session key is still valid
            self.assertEqual(server.cache.get(session_key), user_id)

    # Test delete endpoint with missing session key: Passed
    def test_delete_with_missing_session_key(self):
        # Set up the test client and request headers without a session key
        with app.test_client() as client:
            headers = {}

            # Send a DELETE request to the server
            response = client.delete('/', headers=headers)

            # Check that the server responded with a 401 status code and "Session key is missing" message
            self.assertEqual(response.status_code, 401)
            self.assertEqual(response.json['message'], 'Session key is missing')

    # Test generate session key: Passed
    def test_generate_session_key_length(self):
        key = server.generate_session_key()
        self.assertEqual(len(key), 32)

    # Test uniqueness of key: Passed
    def test_generate_session_key_uniquenss(self):
        key1 = server.generate_session_key()
        key2 = server.generate_session_key()
        self.assertNotEqual(key1, key2)

    # Test login with correct credentials: Pass
    def test_login_with_correct_credentials(self):
        # Set up the test client and request body
        with app.test_client() as client:
            request_body = {'username': 'adminAdmin', 'password': 'admin'}

            # Send a POST request to the server
            response = client.post('/login', json=request_body)
            
            # Get the JSON content of the response
            json_response = response.get_json()

            # Check that the server responded with a 200 status code and the expected response body
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json['userName'], 'adminAdmin')
            self.assertEqual(response.json['permission'], 'admin')

    # Test caching of session key: Passed
    def test_caching_of_session_key(self):
        # Generate a test session key for a test user
        user_id = 123
        new_user_id = 456
        session_key = server.get_user_session_key(user_id)

        # Set up the test client and request headers
        with app.test_client() as client:
            headers = {'Authorization': session_key}

            # Send a PUT request to the server to ensure the session key is cached
            response = client.put('/', headers=headers)

            # Check that the server responded with a 200 status code and "Put complete" message
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data.decode('utf-8'), 'Put complete')

            # Check that the session key is in the cache
            self.assertEqual(server.cache.get(session_key), user_id)

            # Generate a new session key for the same user
            new_session_key = server.get_user_session_key(new_user_id)

            # Check that the new session key is not equal to the old session key
            self.assertNotEqual(new_session_key, session_key)

            # Check that the new session key is in the cache and has the same user_id
            self.assertEqual(server.cache.get(session_key), user_id)

    # Test query with valid session key Course Info: Pass
    def test_query_with_valid_login(self):
        with app.test_client() as client:
            request_body = {'username': 'adminAdmin', 'password': 'admin'}

            # Send a POST request to the server
            login_response = client.post('/login', json=request_body)
            sessionId = login_response.json['sessionId']
            reportName = 'courseInfo'
            reportFilters = 'allCoursesAllDepartments'
            department = 'Computer Science'
            class_name = 'Software Engineering'
            headers = {'Content-Type': 'application/json'}

        response = client.post('/query',
                            headers=headers,
                            json={'sessionId': sessionId,
                                    'reportName': reportName,
                                    'reportFilters': reportFilters,
                                    'department': department,
                                    'course': class_name,
                                    'reportFilters': reportFilters})

            
        #Test for correct response
        self.assertEqual(response.status_code, 200)
        self.assertAlmostEqual(response.json['message'], "We're here")

    # Test advisorStudentOulines.py route: Passed
    def test_advosorStudentOutlines(self):
        with app.test_client() as client:
            request_body = {'username': 'adminAdmin', 'password': 'admin'}
            # Send a POST request to the server
            login_response = client.post('/login', json=request_body)
            userId = 123
            sessionId = login_response.json['sessionId']
            reportName = 'advisorStudentOutlines'
            headers = {'Content-Type': 'application/json'}

            response = client.post('/query',
                    headers=headers,
                    json={'sessionId': sessionId,
                            'reportName': reportName,
                            'userId': userId,
                            'sessionId':sessionId})
            
            #Test for correct response
            self.assertEqual(response.status_code, 200)
            self.assertAlmostEqual(response.json['message'], "We're here")

    # Test courseGradesList.py route: Passed
    def test_courseGradesList(self):
        with app.test_client() as client:
            request_body = {'username': 'adminAdmin', 'password': 'admin'}
            # Send a POST request to the server
            login_response = client.post('/login', json=request_body)
            reportName = 'courseGradesList'
            sessionId = login_response.json['sessionId']
            course = 'Software Engineering'
            headers = {'Content-Type': 'application/json'}

            response = client.post('/query',
                    headers=headers,
                    json={'sessionId': sessionId,
                            'reportName': reportName,
                            'sessionId':sessionId,
                            'course':course})
            
            #Test for correct response
            self.assertEqual(response.status_code, 200)
            self.assertAlmostEqual(response.json['message'], "We're here")

    # Test courses.py route: Passed
    def test_courses(self):
        with app.test_client() as client:
            request_body = {'username': 'adminAdmin', 'password': 'admin'}
            # Send a POST request to the server
            login_response = client.post('/login', json=request_body)  
            reportName = 'courses'
            sessionId = login_response.json['sessionId']
            reportFilters = 'allClassesByDepartment'
            department = 'Computer Science'
            courseSemester = 'Spring 2023'
            headers = {'Content-Type': 'application/json'}

            response = client.post('/query',
                    headers=headers,
                    json={'sessionId': sessionId,
                        'reportName': reportName,
                        'reportFilters':reportFilters,
                        'department': department,
                        'courseSemester':courseSemester})
            
            #Test for correct response
            self.assertEqual(response.status_code, 200)
            self.assertIsNotNone(response)

    # Test coursesByMajor.py route: Passed
    def test_coursesByMajor(self):
        with app.test_client() as client:
            request_body = {'username': 'adminAdmin', 'password': 'admin'}
            # Send a POST request to the server
            login_response = client.post('/login', json=request_body)  
            reportName = 'coursesByMajor'
            headers = {'Content-Type': 'application/json'}
            sessionId = login_response.json['sessionId']
            major = 'Computer Science'

            response = client.post('/query',
                    headers=headers,
                    json={'sessionId': sessionId,
                        'reportName': reportName,
                        'major':major})
            
            #Test for correct response
            self.assertEqual(response.status_code, 200)
            self.assertAlmostEqual(response.json['message'], "We're here")

    #Test facultyInfo.py: Passed
    def test_facultyInfo(self):
        with app.test_client() as client:
            request_body = {'username': 'adminAdmin', 'password': 'admin'}
            # Send a POST request to the server
            login_response = client.post('/login', json=request_body)  
            reportName = 'facultyInfo'
            headers = {'Content-Type': 'application/json'}
            sessionId = login_response.json['sessionId']
            reportFilters = 'allFacultyAllDepartments'
            department = 'Computer Science'
            faculty = 'Some Teacher'

            response = client.post('/query',
                    headers=headers,
                    json={'sessionId': sessionId,
                        'reportName': reportName,
                        'reportFilters':reportFilters,
                        'department':department,
                        'faculty':faculty})
            
            #Test for correct response
            self.assertEqual(response.status_code, 200)
            self.assertAlmostEqual(response.json['message'], "We're here")

    # Test gradeStatistics.py route: Passed
    def test_gradeStatistics(self):
        with app.test_client() as client:
            request_body = {'username': 'adminAdmin', 'password': 'admin'}
            # Send a POST request to the server
            login_response = client.post('/login', json=request_body)  
            reportName = 'gradeStatistics'
            headers = {'Content-Type': 'application/json'}
            sessionId = login_response.json['sessionId']
            granularity = 'course'
            department = "Computer Science"
            course = "Software Engineering"

            response = client.post('/query',
                    headers=headers,
                    json={'sessionId': sessionId,
                        'reportName': reportName,
                        'department':department,
                        'granularity':granularity,
                        'course':course})
            
            #Test for correct response
            self.assertEqual(response.status_code, 200)
            self.assertAlmostEqual(response.json['message'], "We're here")

    # Test personalCourseReport.py route: Passed
    def test_personalCourseReport(self):
        with app.test_client() as client:
            request_body = {'username': 'adminAdmin', 'password': 'admin'}
            # Send a POST request to the server
            login_response = client.post('/login', json=request_body)  
            reportName = 'personalCourseReport'
            headers = {'Content-Type': 'application/json'}
            sessionId = login_response.json['sessionId']
            studentId = 123
            courseSemester = "Spring 2023"

            response = client.post('/query',
                    headers=headers,
                    json={'sessionId': sessionId,
                        'reportName': reportName,
                        'studentId':studentId,
                        'courseSemester':courseSemester})
            
            #Test for correct response
            self.assertEqual(response.status_code, 200)
            self.assertIsNotNone(response)

    # Test studentInfo.py route: Passed
    def test_studentInfo(self):
        with app.test_client() as client:
            request_body = {'username': 'adminAdmin', 'password': 'admin'}
            # Send a POST request to the server
            login_response = client.post('/login', json=request_body)  
            reportName = 'studentInfo'
            headers = {'Content-Type': 'application/json'}
            sessionId = login_response.json['sessionId']
            studentId = 1253

            response = client.post('/query',
                    headers=headers,
                    json={'sessionId': sessionId,
                        'reportName': reportName,
                        'studentId':studentId,})
            
            #Test for correct response
            self.assertEqual(response.status_code, 200)
            self.assertIsNotNone(response)

    # Test studentMajorOutline.py route: Passed
    def test_studentMajorOutline(self):
        with app.test_client() as client:
            request_body = {'username': 'adminAdmin', 'password': 'admin'}
            # Send a POST request to the server
            login_response = client.post('/login', json=request_body)  
            reportName = 'studentMajorOutline'
            headers = {'Content-Type': 'application/json'}
            sessionId = login_response.json['sessionId']
            userId = 123

            response = client.post('/query',
                    headers=headers,
                    json={'sessionId': sessionId,
                        'reportName': reportName,
                        'userId':userId})
            
            self.assertEqual(response.status_code, 200)
            self.assertAlmostEqual(response.json['message'], "We're here")

    # Test users.py route: Passed
    def test_users(self):
        with app.test_client() as client:
            request_body = {'username': 'adminAdmin', 'password': 'admin'}
            # Send a POST request to the server
            login_response = client.post('/login', json=request_body)  
            reportName = 'users'
            headers = {'Content-Type': 'application/json'}
            sessionId = login_response.json['sessionId']
            granularity = 'user'

            response = client.post('/query',
                    headers=headers,
                    json={'sessionId': sessionId,
                        'reportName': reportName,
                        'granularity':granularity})
            
            self.assertEqual(response.status_code, 200)
            self.assertAlmostEqual(response.json['message'], "We're here")

            
    # Test query with invalid session key: Pass
    def test_query_with_invalid_session_key(self):
        with app.test_client() as client:
            request_body = {'username': 'adminFaculty', 'password': 'admin'}

            # Send a POST request to the server
            login_response = client.post('/login', json=request_body)
            sessionId = 'invalid_session_id'
            reportName = 'courseInfo'
            reportFilters = 'allCoursesAllDepartments'
            department = 'Computer Science'
            class_name = 'Software Engineering'
            headers = {'Content-Type': 'application/json'}

            response = client.post('/query',
                       headers=headers,
                       json={'sessionId': sessionId,
                             'reportName': reportName,
                             'reportFilters': reportFilters,
                             'departments': department,
                             'class': class_name})
            
            # Test for correct response
            self.assertAlmostEqual(response.status_code, 440)
            self.assertEqual(response.json['error'], 'Session id has expired')

    # Test index: Passed
    def test_index(self):
        with app.test_client() as client:
            response = client.get('/')
            self.assertEqual(response.status_code, 400)
            self.assertEqual(response.data, b'Record not found')

if __name__ == '__main__':
    unittest.main()

