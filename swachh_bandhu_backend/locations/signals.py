import qrcode
from io import BytesIO
from django.core.files import File
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Location

@receiver(post_save, sender=Location)
def generate_qr_code_on_save(sender, instance, created, **kwargs):
    if not instance.qr_code_image:
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        qr_data = f"{frontend_url}/report/new/{instance.id}"
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        filename = f'location_{instance.id}_qr.png'
        
        instance.qr_code_image.save(filename, File(buffer), save=False)
        
        post_save.disconnect(generate_qr_code_on_save, sender=Location)
        instance.save(update_fields=['qr_code_image'])
        post_save.connect(generate_qr_code_on_save, sender=Location)