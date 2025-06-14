from django.urls import path
from .views import MunicipalDashboardAPIView, CitizenDashboardAPIView

urlpatterns = [
    # URL for Municipal Admins
    path('summary/municipal/', MunicipalDashboardAPIView.as_view(), name='municipal-dashboard-summary'),
    
    # NEW URL for Citizens
    path('summary/citizen/', CitizenDashboardAPIView.as_view(), name='citizen-dashboard-summary'),
]