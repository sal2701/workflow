from typing import List
from django.contrib import admin
from django.urls import path
from .views import ListWorkflow, ListTask

urlpatterns = [
    path('workflow/', ListWorkflow.as_view()),
    path('task/', ListTask.as_view())
    # path('workflow/', )
]
