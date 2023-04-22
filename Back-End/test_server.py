import server
from server import app
import unittest


class TestServer(unittest.TestCase):

    # Test get user session key: Passed
    def test_get_user_session_key(self):
        user_id = 123
        session_key = server.get_user_session_key(user_id)
        self.assertIsNotNone(session_key)
        self.assertIsInstance(session_key, str)

     #Test put endpoint with valid session key: Passed
    def test_put_with_valid_session_key(self):
        # Generate a test session key for a test user
        user_id = 123
        session_key = server.generate_test_session_key(user_id)

        # Set up the test client and request headers
        with app.test_client() as client:
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
        session_key = server.generate_test_session_key(user_id)

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
        session_key = server.generate_test_session_key(user_id)

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
        session_key = server.generate_test_session_key(user_id)

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

if __name__ == '__main__':
    unittest.main()

