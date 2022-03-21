from typing import List
from django.contrib import admin
from django.urls import path
from .views import ListWorkflow

urlpatterns = [
    path('workflow/', ListWorkflow.as_view())
    # path('workflow/', )
]
