from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

admin.site.site_header = "Swachh Bandhu Control Panel"
admin.site.site_title = "Swachh Bandhu Admin"
admin.site.index_title = "Welcome to the Swachh Bandhu Administration"

urlpatterns = [
    path('control-panel/', admin.site.urls),

    path('api/v1/', include([
        path('auth/', include('users.urls')),
        path('', include('locations.urls')),
        path('', include('reports.urls')),
        path('gamification/', include('gamification.urls')),
        path('dashboard/', include('dashboard.urls')),
    ])),

    path('api/v1/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v1/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # package testing url
    path('activity-pulse/', include('activity_pulse.urls', namespace='activity-pulse')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)