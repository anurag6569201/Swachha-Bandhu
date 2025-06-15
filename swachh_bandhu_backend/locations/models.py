import uuid
from django.db import models
from django.conf import settings
from django.contrib.gis.db import models as gis_models
from django.utils.translation import gettext_lazy as _
from subscriptions.models import Municipality
import qrcode
from io import BytesIO
from django.core.files.base import ContentFile

def qr_code_upload_path(instance, filename):
    return f'locations/{instance.municipality.id}/{instance.id}/qr_code.png'

class Location(models.Model):
    class LocationType(models.TextChoices):
        PUBLIC_TOILET = 'PUBLIC_TOILET', _('Public Toilet')
        BUS_STAND = 'BUS_STAND', _('Bus Stand')
        PARK = 'PARK', _('Park')
        STREET_SEGMENT = 'STREET_SEGMENT', _('Street Segment')
        PUBLIC_BIN = 'PUBLIC_BIN', _('Public Bin')
        GOVERNMENT_OFFICE = 'GOVERNMENT_OFFICE', _('Government Office')
        OTHER = 'OTHER', _('Other')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, help_text=_("Common name of the location, e.g., 'Main Street Park - Gate A'."))
    description = models.TextField(blank=True, help_text=_("A brief description or additional details about the location."))
    point = gis_models.PointField(srid=4326, help_text=_("The precise geographic coordinate of the location."))
    geofence_radius = models.PositiveIntegerField(default=50, help_text=_("The radius in meters within which a user must be to file a report for this location."))
    municipality = models.ForeignKey(Municipality, on_delete=models.CASCADE, related_name='locations', help_text=_("The governing municipality for this location."))
    location_type = models.CharField(max_length=30, choices=LocationType.choices, default=LocationType.OTHER, db_index=True)
    qr_code_image = models.ImageField(upload_to=qr_code_upload_path, blank=True, null=True)
    is_active = models.BooleanField(default=True, help_text=_("Inactive locations cannot have new reports filed against them."))
    last_reported_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['municipality', 'name']
        verbose_name = _("Location")
        verbose_name_plural = _("Locations")

    def __str__(self):
        return f"{self.name} ({self.municipality.name})"

    # QR code generation is now handled by a post_save signal in locations/signals.py

    @property
    def latitude(self):
        return self.point.y

    @property
    def longitude(self):
        return self.point.x