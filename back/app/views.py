from django.shortcuts import render
from django.db import models
from django.utils import timezone
from datetime import datetime, timedelta
from django.contrib.auth.models import AbstractBaseUser
from django.core.exceptions import ValidationError
# from django.utils.translation import ugettext as _
import re
import os, binascii, hashlib
from .models import Workflow, Task
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core import serializers



# Create your views here.

class ListWorkflow(APIView):
    
    def get(self, request):
        workflows = Workflow.objects.all()
        data = serializers.serialize('json', workflows)
        return Response(data)
    
    def post(self,request):
        data = request.data
        obj = Workflow(workflow_name=data["name"], num_of_task=data["num_tasks"], description=data["description"])
        obj.save()
        
        print(obj.workflow_name)
        data = serializers.serialize('json', [obj])
        return Response(data)

class ListTask(APIView):
    
    def get(self, request):
        workflows = Task.objects.all()
        data = serializers.serialize('json', workflows)
        return Response(data)
    
    def post(self,request):
        data = request.data
        obj = Task(task_id=data["id"], workflow_id=data["wf_id"],task_name=data["name"], num_of_task=data["num_tasks"], description=data["description"])
        obj.save()
        return Response(data)
                


    
    



    


