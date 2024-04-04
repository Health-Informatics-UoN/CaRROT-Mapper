from authentication.views import CustomLoginView
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("", include("mapping.urls")),
    path("api/auth/", include("authentication.urls")),
    path("admin/", admin.site.urls),
    path("accounts/login/", CustomLoginView.as_view(), name="custom_login"),
    path("accounts/", include("django.contrib.auth.urls")),
]
