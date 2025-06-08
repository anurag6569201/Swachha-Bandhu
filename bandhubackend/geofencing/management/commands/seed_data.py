# geofencing/management/commands/seed_data.py
import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from geofencing.models import GeofenceZone

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with sample geofence zones for a test user.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting to seed the database...'))

        # Create a test user
        username = 'testuser'
        password = 'testpassword123'
        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': f'{username}@example.com'}
        )
        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {username} (pw: {password})'))
        else:
            self.stdout.write(self.style.WARNING(f'User {username} already exists.'))

        # Define sample zones
        zones_to_create = [
            {'name': 'Downtown HQ', 'center': (-118.2437, 34.0522), 'radius': 500, 'color': '#ff0000'},
            {'name': 'Westside Warehouse', 'center': (-118.4452, 34.0219), 'radius': 1200, 'color': '#00ff00'},
            {'name': 'Northern Depot', 'center': (-118.4313, 34.2011), 'radius': 750, 'color': '#0000ff'},
            {'name': 'Port Logistics', 'center': (-118.2618, 33.7292), 'radius': 2500, 'color': '#ffff00'},
        ]

        # Delete existing zones for this user to avoid duplicates on re-run
        GeofenceZone.objects.filter(owner=user).delete()
        self.stdout.write(self.style.WARNING('Deleted existing zones for testuser.'))

        # Create new zones
        for zone_data in zones_to_create:
            GeofenceZone.objects.create(
                owner=user,
                name=zone_data['name'],
                center=Point(zone_data['center'], srid=4326),
                radius=zone_data['radius'],
                color=zone_data['color'],
                description=f"Sample zone for {zone_data['name']}."
            )
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created {len(zones_to_create)} zones for {username}.'))
        self.stdout.write(self.style.SUCCESS('Seeding complete!'))