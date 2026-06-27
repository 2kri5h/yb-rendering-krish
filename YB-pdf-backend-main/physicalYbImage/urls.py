from django.urls import path, include
from . import views

urlpatterns = [
    path("feed", views.feed, name="index"),
    path("profile/<int:user_id>", views.fetch_profile_by_id, name="fetch_profile_by_id"),
    path("profile", views.profile, name="profile"),
    # path("idData", views.idDataCreateView.as_view(), name="fetch"),
    # path('receive_data', views.receive_data),
    # path('id_data', views.get_existing_data)
    path("fetch_id_data", views.fetch_data_from_csv, name="fetch_data"),
    path("upload_pdf", views.upload_to_drive, name="upload")
]