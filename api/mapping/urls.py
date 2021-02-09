from django.contrib.auth.decorators import login_required
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views
from .views import StructuralMappingDeleteView

urlpatterns = [
    path('', views.home, name='home'),
    path('tables/', views.ScanReportTableListView.as_view(), name='tables'),
    path('fields/', views.ScanReportFieldListView.as_view(), name='fields'),
    path('values/', views.ScanReportValueListView.as_view(), name='values'),
    path('fields/<int:pk>/update/', views.ScanReportFieldUpdateView.as_view(), name='scan-report-field-update'),
    path('fields/<int:pk>/create_mapping/', views.AddMappingRuleFormView.as_view(), name='create-mapping-form'),
    path('fields/<int:pk>/mapping_rules/', views.StructuralMappingListView.as_view(), name='view-structural-mapping'),
    path('fields/<int:pk>/mapping_rules/delete', StructuralMappingDeleteView.as_view(), name='structural-mapping-delete'),
    path('scanreports/', login_required(views.ScanReportListView.as_view()), name='scan-report-list'),
    path('scanreports/create/', login_required(views.ScanReportFormView.as_view()), name='scan-report-form'),
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('documents/create/', login_required(views.DocumentFormView.as_view()), name='document-form'),
    path('files/', login_required(views.DocumentListView.as_view()), name='document-list'),
    path('file/', login_required(views.FileListView.as_view()), name='file-list'),

]
if settings.DEBUG: # new
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


