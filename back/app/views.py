from django.shortcuts import render
from django.db import models
from django.utils import timezone
from datetime import datetime, timedelta
from django.contrib.auth.models import AbstractBaseUser
from django.core.exceptions import ValidationError
# from django.utils.translation import ugettext as _
import re
import os, binascii, hashlib
from .models import Workflow, Task, UserManager, User, Role, Task_Role, Task_Instance, User_Role, Workflow_Instance, Workflow_Instance_Current_Task
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.core import serializers
from .serializers import UserSerializer, LoginSerializer, RegisterSerializer
# Create your views here.

manager = UserManager()

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

class UpdateWorkflow(APIView):
    
    def post(self,request):
        data = request.data
        obj = Workflow.objects.get(pk=data["id"])
        obj.num_of_task = data["num_tasks"]    
        obj.save()        
        data = serializers.serialize('json', [obj])
        return Response(data)
    
class DeleteWorkflow(APIView):
    
    def post(self,request):
        data = request.data
        instance = Workflow.objects.get(pk=data["wf_id"])
        instance.delete()
        return Response(data)

class ListTask(APIView):
    
    def get(self, request):
        workflows = Task.objects.all()
        data = serializers.serialize('json', workflows)
        return Response(data)
    
    def post(self,request):
        data = request.data
        wf_instance = Workflow.objects.get(pk=data["wf_id"])
        obj = Task(task_id=data["id"], workflow_id=wf_instance,task_name=data["name"], predecessor = data["predecessors"],successor = data["successors"], description=data["description"], action = data["action"])
        obj.save()
        data = serializers.serialize('json', [obj])
        return Response(data)
    
class CreateRole(APIView):
    
    def get(self, request):
        role = Role.objects.all()
        data = serializers.serialize('json', role)
        return Response(data)
    
    def post(self,request):
        data = request.data
        wf_instance = Workflow.objects.get(pk=data["wf_id"])
        obj = Role(role=data["role"],workflow_id=wf_instance)
        obj.save()
        data = serializers.serialize('json', [obj])
        return Response(data)
    
class ViewUsers(APIView):
    def get(self,request):
        users = User.objects.all()
        data = serializers.serialize('json', users)
        return Response(data)
    
class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['updated']
    ordering = ['-updated']

    def get_queryset(self):
        if self.request.user.is_superuser:
            return User.objects.all()

    def get_object(self):
        lookup_field_value = self.kwargs[self.lookup_field]
        obj = User.objects.get(lookup_field_value)
        self.check_object_permissions(self.request, obj)
        return obj
    
class LoginViewSet(ModelViewSet, TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class RegistrationViewSet(ModelViewSet, TokenObtainPairView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        print(request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        res = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
        return Response({
            "user": serializer.data,
            "refresh": res["refresh"],
            "token": res["access"]
        }, status=status.HTTP_201_CREATED)

class RefreshViewSet(viewsets.ViewSet, TokenRefreshView):
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    
class ListTaskRole(APIView):
    
    def get(self, request):
        task_role = Task_Role.objects.all()      
        data = serializers.serialize('json', task_role)
        return Response(data)
    
    def post(self, request):
        data = request.data
        print(request.data)
        objs = []
        task_obj = Task.objects.get(pk=data["task"])
        workflow_obj = Workflow.objects.get(pk=data["wf_id"])
        for i in data["role"]:
            role_obj = Role.objects.get(pk=i)
            obj = Task_Role(task_id=task_obj, role_id=role_obj, workflow_id=workflow_obj)
            obj.save()
            objs.append(obj)
        data = serializers.serialize('json', objs)
        return Response(data)

class ListUserRole(APIView):
    
    def get(self, request):
        user_role = User_Role.objects.all()
        data = serializers.serialize('json', user_role)
        return Response(data)
    
    def post(self, request):
        data = request.data
        objs = []
        user_obj = User.objects.get(pk=data["user"])
        workflow_obj = Workflow.objects.get(pk=data["wf_id"])
        for i in data["role"]:
            role_obj = Role.objects.get(pk=i)
            obj = User_Role(user_id=user_obj, role_id=role_obj, workflow_id=workflow_obj)
            obj.save()
            objs.append(obj)
        data = serializers.serialize('json', objs)
        return Response(data)
    
class ListWorkflowinstance(APIView):
    
    def get(self, request):
        workflow_instance = Workflow_Instance.objects.all()
        data = serializers.serialize('json', workflow_instance)
        return Response(data)
    
    def post(self, request):
        data = request.data
        workflow_obj = Workflow.objects.get(pk=data["wf_id"])
        user_obj = Workflow.objects.get(pk=data["user"])
        obj = Workflow_Instance(workflow_id=workflow_obj, user_id=user_obj)
        obj.save()
        data = serializers.serialize('json', [obj])
        return Response(data)
    
class ListWorkflowInstanceCurrentTask(APIView):
    
    def get(self, request):
        workflow_instance_current_task = Workflow_Instance_Current_Task.objects.all()
        data = serializers.serialize('json', workflow_instance_current_task)
        return Response(data)
    
    def post(self, request):
        data = request.data
        workflow_instance_obj = Workflow_Instance.objects.get(pk=data["wf_instance_id"])
        current_task_obj = Task.objects.get(pk=data["current_task_id"])
        workflow_obj = Workflow.objects.get(pk=data["wf_id"])
        obj = Workflow_Instance_Current_Task(workflow_instance_id=workflow_instance_obj, current_task_id=current_task_obj, workflow_id=workflow_obj)
        obj.save()
        data = serializers.serialize('json', [obj])
        return Response(data)
    
class ListTaskInstance(APIView):
    
    def get(self, request):
        task_instance = Task_Instance.objects.all()
        data = serializers.serialize('json', task_instance)
        return Response(data)
    
    def post(self, request):
        data = request.data
        workflow_obj = Workflow.objects.get(pk=data["wf_id"])
        workflow_instance_obj = Workflow_Instance.objects.get(pk=data["wf_instance_id"])
        user_obj = Workflow.objects.get(pk=data["user"])
        task_obj = Task.objects.get(pk=data["task_id"])
        obj = Task_Instance(wef_instance_id=workflow_instance_obj, user_id=user_obj, task_id=task_obj, workflow_id=workflow_obj, status=data["status"])
        obj.save()
        data = serializers.serialize('json', [obj])
        return Response(data)
