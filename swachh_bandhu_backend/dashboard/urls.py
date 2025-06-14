from django.urls import path
from .views import MunicipalDashboardAPIView

urlpatterns = [
    path('summary/', MunicipalDashboardAPIView.as_view(), name='municipal-dashboard-summary'),
]