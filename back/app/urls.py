from typing import List
from django.contrib import admin
from django.urls import path, include
from .views import AddGraph, ChangeStatus, CreateRole, DeleteWorkflow, GetWorkflowStatus, GetTasks, GetTasksforUser, GetWorkflowStatus, GoToTask, InitializeWorkflow, ListUserRole, ListWorkflow, ListTask, LoginViewSet, RefreshViewSet, RegistrationViewSet, TaskComplete, UpdateWorkflow, ViewUsers, ListTaskRole

urlpatterns = [
    path('workflow/', ListWorkflow.as_view()),
    path('workflow/update/', UpdateWorkflow.as_view()),
    path('task/', ListTask.as_view()),
    path('task/<int:pk>/', ListTask.as_view()),
    path('api/', include(('app.routers', 'app'), namespace='core-api')),
    path('role/create/', CreateRole.as_view()),
    path('users/', ViewUsers.as_view()),
    path('user-role/create/', ListUserRole.as_view()),
    path('task-role/create/', ListTaskRole.as_view()),
    path('workflow/delete/', DeleteWorkflow.as_view()),
    path('task/gettasks/', GetTasks.as_view()),
    path('task/addgraph/', AddGraph.as_view()),
    path('user/tasks/', GetTasksforUser.as_view()),
    path('workflow/initialize/', InitializeWorkflow.as_view()),
    path('task_instance/status/progress/', GoToTask.as_view()),
    path('task_instance/status/complete/', TaskComplete.as_view()),
    path('task_instance/status/change/', ChangeStatus.as_view()),
    path('workflow_instance/status/', GetWorkflowStatus.as_view())
]
