# locations/models.py
import uuid
from django.db import models
from django.conf import settings

class Location(models.Model):
    # Using UUID for the primary key is great for public-facing IDs.
    # It prevents enumeration attacks and is not sequential.
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(max_length=255, help_text="The common name of the location (e.g., 'City Park Main Entrance').")
    description = models.TextField(blank=True, help_text="A brief description of the location.")

    # Using DecimalField for lat/lng is the standard for precision.
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=10, decimal_places=6) # Longitude needs 10 digits for values like -122.419416

    # Location Type can be used by the frontend to render different icons or forms.
    class LocationType(models.TextChoices):
        PUBLIC_TOILET = 'TOILET', 'Public Toilet'
        BUS_STAND = 'BUS_STAND', 'Bus Stand'
        PARK = 'PARK', 'Park'
        STREET = 'STREET', 'Street'
        OTHER = 'OTHER', 'Other'

    location_type = models.CharField(
        max_length=20,
        choices=LocationType.choices,
        default=LocationType.OTHER,
        db_index=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = "Location"
        verbose_name_plural = "Locations"

    def __str__(self):
        return self.name

    @property
    def qr_code_url(self):
        """
        Generates the full URL to be embedded in the QR code.
        This is a read-only property for convenience.
        """
        # Note: This requires FRONTEND_URL to be set in your .env
        frontend_url = getattr(settings, 'FRONTEND_URL', '')
        if not frontend_url:
            return f"FRONTEND_URL not configured. Location ID: {self.id}"
        # The React app will have a route like /scan/:locationId
        return f"{frontend_url}/scan/{self.id}"