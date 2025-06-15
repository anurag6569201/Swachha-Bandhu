from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReportViewSet, IssueCategoryViewSet

router = DefaultRouter()
router.register(r'reports', ReportViewSet, basename='report')
router.register(r'issue-categories', IssueCategoryViewSet, basename='issue-category')

urlpatterns = [
    path('', include(router.urls)),
]