from typing import List
from django.contrib import admin
from django.urls import path, include
from .views import CreateRole, ListWorkflow, ListTask, LoginViewSet, RefreshViewSet, RegistrationViewSet, UpdateWorkflow

urlpatterns = [
    path('workflow/', ListWorkflow.as_view()),
    path('workflow/update/', UpdateWorkflow.as_view()),
    path('task/', ListTask.as_view()),
    path('api/', include(('app.routers', 'app'), namespace='core-api')),
    path('role/create/',CreateRole.as_view())
]
