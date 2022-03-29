# core/routers.py
from rest_framework.routers import SimpleRouter
from .views import LoginViewSet, RegistrationViewSet, RefreshViewSet, UserViewSet

routes = SimpleRouter()

# AUTHENTICATION
routes.register(r'auth/login', LoginViewSet, basename='auth-login')
routes.register(r'auth/register', RegistrationViewSet, basename='auth-register')
routes.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')

# USER
routes.register(r'user', UserViewSet, basename='user')
urlpatterns = [
    *routes.urls
]