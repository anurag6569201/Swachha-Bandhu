from django.urls import path
from .views import (
    IssueCategoryListView, 
    ReportedIssueListCreateView,
    ReportedIssueDetailView
)

urlpatterns = [
    path('categories/', IssueCategoryListView.as_view(), name='issue-category-list'),
    path('reports/', ReportedIssueListCreateView.as_view(), name='issue-report-list-create'),
    path('reports/<uuid:pk>/', ReportedIssueDetailView.as_view(), name='issue-report-detail'),
]