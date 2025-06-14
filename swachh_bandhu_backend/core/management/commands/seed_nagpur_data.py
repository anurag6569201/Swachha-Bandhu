import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from django.contrib.gis.geos import Point

# Import all necessary models
from subscriptions.models import SubscriptionPlan, Municipality
from users.models import User, UserRole
from locations.models import Location
from reports.models import Report, ReportMedia
from gamification.models import Sponsor, Lottery, Badge

class Command(BaseCommand):
    help = 'Seeds the database with dummy data for Nagpur city.'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Seeding database for Nagpur...'))

        # Clean slate: Delete old data to ensure a fresh start
        self.stdout.write('Deleting old data...')
        Sponsor.objects.all().delete()
        Report.objects.all().delete()
        Location.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()
        Municipality.objects.all().delete()
        SubscriptionPlan.objects.all().delete()
        Badge.objects.all().delete()

        # --- 1. Create Subscription Plan ---
        plan, _ = SubscriptionPlan.objects.get_or_create(
            name='Premium Municipal Plan',
            defaults={
                'price_per_month': 50000.00,
                'max_locations': 1000,
                'max_admins': 20,
                'analytics_access': True,
            }
        )
        self.stdout.write(self.style.SUCCESS(f'Created Subscription Plan: {plan.name}'))

        # --- 2. Create Nagpur Municipality ---
        nagpur, _ = Municipality.objects.get_or_create(
            name='Nagpur Municipal Corporation',
            defaults={
                'city': 'Nagpur',
                'state': 'Maharashtra',
                'plan': plan,
                'subscribed_until': timezone.now().date() + timedelta(days=365),
            }
        )
        self.stdout.write(self.style.SUCCESS(f'Created Municipality: {nagpur.name}'))

        # --- 3. Create Municipal Admins and Moderators ---
        admin_user, _ = User.objects.get_or_create(
            email='nagpur.admin@swachhbandhu.com',
            defaults={
                'full_name': 'Nagpur Admin',
                'role': UserRole.MUNICIPAL_ADMIN,
                'municipality': nagpur,
            }
        )
        admin_user.set_password('nagpuradmin123')
        admin_user.save()

        mod_user, _ = User.objects.get_or_create(
            email='nagpur.moderator@swachhbandhu.com',
            defaults={
                'full_name': 'Nagpur Moderator',
                'role': UserRole.MODERATOR,
                'municipality': nagpur,
            }
        )
        mod_user.set_password('nagpurmod123')
        mod_user.save()
        self.stdout.write(self.style.SUCCESS('Created Municipal Admin and Moderator accounts.'))

        # --- 4. Create Citizen Users ---
        self.stdout.write('Creating citizen users...')
        citizens = []
        for i in range(1, 21):
            user, created = User.objects.get_or_create(
                email=f'citizen.nagpur{i}@example.com',
                defaults={'full_name': f'Nagpur Citizen {i}', 'role': UserRole.CITIZEN}
            )
            user.set_password('citizen123')
            user.save()
            citizens.append(user)

        # --- 5. Create Locations in Nagpur ---
        self.stdout.write('Creating locations in Nagpur...')
        locations_data = [
            {'name': 'Futala Lake Promenade', 'point': Point(79.0494, 21.1594), 'type': Location.LocationType.PARK},
            {'name': 'Sitabuldi Market Bin', 'point': Point(79.0799, 21.1432), 'type': Location.LocationType.PUBLIC_BIN},
            {'name': 'Nagpur Railway Station - Platform 1 Toilet', 'point': Point(79.092, 21.153), 'type': Location.LocationType.PUBLIC_TOILET},
            {'name': 'Zero Mile Stone', 'point': Point(79.080, 21.146), 'type': Location.LocationType.PARK},
            {'name': 'Sadar Bus Stand', 'point': Point(79.085, 21.165), 'type': Location.LocationType.BUS_STAND},
            {'name': 'Ambazari Lake Garden Entrance', 'point': Point(79.035, 21.139), 'type': Location.LocationType.PARK},
            {'name': 'WHC Road Pothole Spot', 'point': Point(79.055, 21.145), 'type': Location.LocationType.STREET_SEGMENT},
            {'name': 'NMC Head Office', 'point': Point(79.082, 21.150), 'type': Location.LocationType.GOVERNMENT_OFFICE},
        ]
        locations = []
        for loc_data in locations_data:
            location, _ = Location.objects.get_or_create(
                name=loc_data['name'],
                municipality=nagpur,
                defaults={'point': loc_data['point'], 'location_type': loc_data['type']}
            )
            locations.append(location)

        # --- 6. Create Reports ---
        self.stdout.write('Creating reports...')
        issue_types = ['Overflowing Bin', 'Broken Streetlight', 'Pothole', 'Garbage Dumped', 'Damaged Bench', 'Clogged Drain']
        statuses = [Report.ReportStatus.PENDING, Report.ReportStatus.VERIFIED, Report.ReportStatus.ACTIONED, Report.ReportStatus.REJECTED]
        reports = []
        for i in range(50): # Create 50 reports
            report = Report.objects.create(
                user=random.choice(citizens),
                location=random.choice(locations),
                issue_type=random.choice(issue_types),
                description=f'This is a dummy report description for issue: {issue_types[i % len(issue_types)]}. Immediate action is needed.',
                status=random.choices(statuses, weights=[4, 3, 2, 1], k=1)[0]
            )
            reports.append(report)
        
        # Add some verifications
        pending_reports = Report.objects.filter(status=Report.ReportStatus.PENDING)
        for report in pending_reports[:5]:
            verifier = random.choice([c for c in citizens if c != report.user])
            Report.objects.create(
                user=verifier,
                location=report.location,
                issue_type=f'Verification for: {report.issue_type}',
                description=f'Confirming that the issue reported in #{report.id} is valid.',
                verifies_report=report,
                status=Report.ReportStatus.VERIFIED
            )

        # --- 7. Create Gamification Elements ---
        self.stdout.write('Creating gamification elements...')
        Sponsor.objects.create(name='Haldirams Nagpur', website='https://www.haldirams.com', description='Proudly sponsoring a cleaner Nagpur.')
        Sponsor.objects.create(name='Vicco Laboratories', website='https://viccolabs.com', description='Supporting community health and hygiene.')
        
        Badge.objects.create(name='Community Starter', description='Filed your first report.', required_reports=1)
        Badge.objects.create(name='Civic Eye', description='Verified 5 reports.', required_verifications=5)
        Badge.objects.create(name='City Hero', description='Earned 500 points.', required_points=500)
        
        # --- 8. Create an Active Lottery ---
        self.stdout.write('Creating an active lottery...')
        Lottery.objects.create(
            name='Nagpur Monsoon Cleanup Lottery',
            description='Every report or verification in Nagpur this month gives you a chance to win a gift voucher!',
            municipality=nagpur,
            sponsor=Sponsor.objects.first(),
            start_date=timezone.now(),
            end_date=timezone.now() + timedelta(days=30),
            is_active=True
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded the database for Nagpur!'))