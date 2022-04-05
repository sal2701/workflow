from typing import List
from django.contrib import admin
from django.urls import path, include
from .views import AddGraph, CreateRole, DeleteWorkflow, ListUserRole, ListWorkflow, ListTask, LoginViewSet, RefreshViewSet, RegistrationViewSet, UpdateWorkflow, ViewUsers, ListTaskRole

urlpatterns = [
    path('workflow/', ListWorkflow.as_view()),
    path('workflow/update/', UpdateWorkflow.as_view()),
    path('task/', ListTask.as_view()),
    path('api/', include(('app.routers', 'app'), namespace='core-api')),
    path('role/create/', CreateRole.as_view()),
    path('users/', ViewUsers.as_view()),
    path('user-role/create/', ListUserRole.as_view()),
    path('task-role/create/', ListTaskRole.as_view()),
    path('workflow/delete/', DeleteWorkflow.as_view()),
    path('task/addgraph/', AddGraph.as_view())
]
