# geofencing/tests.py
from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token # Or your token model
from .models import GeofenceZone

User = get_user_model()

class GeofenceZoneAPITests(APITestCase):
    """
    Test suite for the GeofenceZone API endpoints.
    """
    @classmethod
    def setUpTestData(cls):
        # Create two users to test ownership and permissions
        cls.user_a = User.objects.create_user(username='usera', password='password123')
        cls.user_b = User.objects.create_user(username='userb', password='password123')

        # Create auth tokens for them
        # NOTE: If using JWT, you would generate tokens here instead.
        cls.token_a = Token.objects.create(user=cls.user_a)
        cls.token_b = Token.objects.create(user=cls.user_b)
        
        # Create a geofence zone owned by user_a
        cls.zone_a = GeofenceZone.objects.create(
            owner=cls.user_a,
            name='Zone A',
            center=Point(-100, 40, srid=4326),
            radius=1000
        )
        
        # Define URLs
        cls.list_url = reverse('geofencezone-list')
        cls.detail_url = reverse('geofencezone-detail', kwargs={'pk': cls.zone_a.pk})
        cls.log_event_url = reverse('geofencezone-log-event', kwargs={'pk': cls.zone_a.pk})
        cls.statistics_url = reverse('geofencezone-statistics')

    def setUp(self):
        # Authenticate as user_a by default for most tests
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token_a.key)

    # --- Authentication and Permission Tests ---
    def test_unauthenticated_access_denied(self):
        """Ensure unauthenticated users cannot access any endpoint."""
        self.client.logout()
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_zones_returns_only_owned_zones(self):
        """User A should only see their own zones, not user B's zones."""
        GeofenceZone.objects.create(owner=self.user_b, name='Zone B', center=Point(0, 0), radius=50)
        
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # The API returns GeoJSON FeatureCollection
        self.assertEqual(len(response.data['features']), 1)
        self.assertEqual(response.data['features'][0]['properties']['name'], 'Zone A')

    def test_other_user_cannot_access_detail_view(self):
        """User B should get a 404 when trying to access User A's zone detail."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token_b.key)
        response = self.client.get(self.detail_url)
        # It's a 404 because the queryset in the view filters by owner first
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_other_user_cannot_update_zone(self):
        """User B cannot update User A's zone."""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token_b.key)
        data = {'name': 'New Name by User B', 'radius': 500}
        response = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # --- Updated Tests for Disabled Methods ---
    def test_create_zone_is_disallowed(self):
        """Test that POST requests to the list URL are disallowed (405)."""
        data = {"name": "New Test Zone", "radius": 150.5, "center": {"type": "Point", "coordinates": [-74, 40]}}
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_delete_zone_is_disallowed(self):
        """Test that DELETE requests to the detail URL are disallowed (405)."""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        
    # --- Existing Method Tests ---
    def test_update_zone_success(self):
        """The owner can successfully update their zone using PATCH."""
        data = {'name': 'Zone A Updated', 'radius': 1234.5}
        # Note: DRF-GIS GeoFeatureModelSerializer expects updates to be nested under properties
        response = self.client.patch(self.detail_url, {'properties': data}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.zone_a.refresh_from_db()
        self.assertEqual(self.zone_a.name, 'Zone A Updated')
        self.assertEqual(self.zone_a.radius, 1234.5)

    # --- Custom Action Tests ---
    def test_log_event_success(self):
        """Test successfully logging a 'CHECK_IN' event for a zone."""
        data = {"longitude": -100.001, "latitude": 40.001, "event_type": "CHECK_IN"}
        response = self.client.post(self.log_event_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.zone_a.events.count(), 1)
        event = self.zone_a.events.first()
        self.assertEqual(event.event_type, 'CHECK_IN')

    def test_statistics_endpoint(self):
        """Test the statistics endpoint returns correct aggregate data."""
        response = self.client.get(self.statistics_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertEqual(data['total_zones'], 1)
        self.assertEqual(data['active_zones'], 1)
        self.assertIn('event_type_counts', data)