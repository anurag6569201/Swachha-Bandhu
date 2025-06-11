from rest_framework.test import APITestCase

class TestSetup(APITestCase):
    def test_setup_works(self):
        self.assertEqual(1, 1)