from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import EventViewSet, register_user

router = DefaultRouter()
router.register(r'events', EventViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user, name='register'),
]
