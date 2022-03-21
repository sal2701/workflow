from django.shortcuts import render
from django.db import models
from django.utils import timezone
from datetime import datetime, timedelta
from django.contrib.auth.models import AbstractBaseUser
from django.core.exceptions import ValidationError
# from django.utils.translation import ugettext as _
import re
import os, binascii, hashlib
from .models import Workflow
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
        


    
    



    


