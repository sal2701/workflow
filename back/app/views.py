from django.http import Http404
from django.shortcuts import render
from django.db import models
from django.utils import timezone
from datetime import datetime, timedelta
from django.contrib.auth.models import AbstractBaseUser
from django.core.exceptions import ValidationError
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
import json 

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
    
    def get_task(self, pk):
        try:
            return Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            raise Http404

    def get(self, request, pk=None):
        print("task_id", pk)
        if pk:
            task = self.get_task(pk)
            data = serializers.serialize('json', [task])
            print("data",data )
            return Response(data)
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
        print(serializer)
        try:
            print("trying")
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            print("error raised", e)
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

class GetTasks(APIView):

    def post(self, request):
        data = request.data
        tasks_data = Task.objects.filter(workflow_id = data["pk"])
        data = serializers.serialize('json', tasks_data)
        return Response(data)   
        
class AddGraph(APIView):
    
    valid = 1
    
    def dfs(self,adj_list, curr_task, visited):
        if visited[curr_task] == 1:
            self.valid  = 0
        else:
            visited[curr_task] = 1;
            if not curr_task in adj_list:
                return
            for node in adj_list[curr_task]:
                self.dfs(adj_list, node, visited)
                if self.valid == 0:
                    return
    
    def post(self, request):
        data = request.data
        suc_list = dict()
        pred_list = dict()
        visited = dict()
        roots = []
        leaves = []
        for edge in data['edges']:
            if not edge['source'] in suc_list:
                suc_list[edge['source']] = []
            if not edge['target'] in pred_list:
                pred_list[edge['target']] = []
            if not edge['target'] in suc_list:
                suc_list[edge['target']] = []
            if not edge['source'] in pred_list:
                pred_list[edge['source']] = []
            
            if not edge['source'] in visited:
                visited[edge['source']] = 0
            
            suc_list[edge['source']].append(edge['target'])
            
            if not edge['target'] in visited:
                visited[edge['target']] = 0
            
            pred_list[edge['target']].append(edge['source'])
        
        for i in pred_list:
            if len(pred_list[i]) == 0:
                roots.append(i)
                self.dfs(suc_list, i, visited)
        
        for i in suc_list:
            if len(suc_list[i]) == 0:
                leaves.append(i)
        
        json_str = json.dumps(roots)
        wf_instance = Workflow.objects.get(pk=data["workflow_id"])
        root_task = Task(task_id=0, workflow_id=wf_instance, task_name="ROOT", successor=json_str)
        root_task.save()
        
        for i in roots:
            pred_list[i].append(root_task.pk)
            
        json_str = json.dumps(leaves)
        leaf_task = Task(task_id=0, workflow_id=wf_instance, task_name="LEAF", predecessor=json_str)
        leaf_task.save()
        
        for i in leaves:
            suc_list[i].append(leaf_task.pk)

        if(self.valid == 0):
            return Response("Invalid")

        for key in suc_list:
            obj = Task.objects.get(pk=key)
            json_str = json.dumps(suc_list[key])
            obj.successor = json_str 
            obj.save()
        for key in pred_list:
            obj = Task.objects.get(pk=key)
            json_str = json.dumps(pred_list[key])
            obj.predecessor = json_str
            obj.save()    
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

class InitializeWorkflow(APIView):
    def post(self, request):
        data = request.data
        email_id = data["email_id"]
        user_id = User.objects.get(email = email_id)
        wf_obj = Workflow.objects.get(pk=data["workflow_id"])
        root_node_obj = Task.objects.get(workflow_id = wf_obj, task_name = "ROOT")
        wf_instance = Workflow_Instance(workflow_id = wf_obj, user_id = user_id, root_node_id = root_node_obj, total_tasks = wf_obj.num_of_task + 2, completed_tasks = 1)
        wf_instance.save()
        
        task_list = Task.objects.filter(workflow_id = wf_obj)
        root_instance = 0
        for task in task_list:
            if task.task_name == "ROOT":
                task_instance = Task_Instance(wef_instance_id = wf_instance, user_id = user_id, task_id = task, workflow_id = wf_obj, status = "CO", predecessor_count = 0)
                task_instance.save()
                root_instance = task_instance
            else:
                pred_list = json.loads(task.predecessor)
                task_instance = Task_Instance(wef_instance_id = wf_instance, task_id = task, workflow_id = wf_obj, status = "NA", predecessor_count = len(pred_list))
                task_instance.save()                 
                
        for nxt_task in json.loads(root_instance.successor):
            nxt_task_obj = Task_Instance.objects.get(wef_instance_id = wf_instance, task_id = nxt_task)
            nxt_task_obj.status = "AA"
            nxt_task_obj.predecessor_count = 0
            nxt_task_obj.save()
            workflow_instance_current_task_obj = Workflow_Instance_Current_Task(workflow_instance_id = wf_instance, current_task_id = nxt_task_obj, workflow_id = wf_obj)
            workflow_instance_current_task_obj.save()
            
        return Response("Success")
            
class GetTasksforUser(APIView):
    def post(self,request):
        data = request.data
        user_obj = User.objects.get(email = data["email_id"])
        user_role_list = User_Role.objects.filter(user_id = user_obj.pk)
        
        tasks_to_show = {}
        
        for user_roles in user_role_list:
            role_id = user_roles.role_id
            role_obj = Role.objects.get(pk=role_id)
            role_task_list = Task_Role.filter(role_id = role_obj)
            for role_task in role_task_list:
                task_id= role_task.task_id
                workflow_id = role_task.workflow_id
                task_obj = Task.objects.get(pk=task_id)
                workflow_obj = Workflow.objects.get(pk=workflow_id)
                task_instances_list = Task_Instance.objects.filter(task_id = task_obj,workflow_id=workflow_obj)
                for task_instance in task_instances_list:
                    if task_instance.status == "AA":
                        if (workflow_obj.workflow_name,workflow_id) not in tasks_to_show:
                            tasks_to_show[((workflow_obj.workflow_name,workflow_id))] = []    
                        tasks_to_show[((workflow_obj.workflow_name,workflow_id))] = task_obj
         
        data = serializers.serialize('json',tasks_to_show)
        return Response(data)
    
class GoToTask(APIView):
    
    def post(self, request):
        data = request.data
        workflow_instance_obj = Workflow_Instance.objects.get(pk=data["workflow_instance_id"])
        workflow_obj = Workflow.objects.get(pk=workflow_instance_obj.workflow_id)
        task_obj = Task.objects.get(workflow_id=workflow_obj, task_id=data["task_id"])
        task_instance_obj = Task_Instance(wef_instance_id = workflow_instance_obj, task_id = task_obj)    
        if(task_instance_obj.status == "IP"):
            return Response("Already Inprogress")
        else:
            task_instance_obj.status = "IP"
            user_obj = User.objects.get(email = data["email_id"])
            task_instance_obj.user_id = user_obj
            task_instance_obj.save()
            data = serializers.serialize('json', [task_instance_obj])
            return Response(data)

class TaskComplete(APIView):
    
    def post(self, request):
        data = request.data
        task_instance_obj = Task_Instance.objects.get(pk=data["task_instance_id"])
        task_id = task_instance_obj.task_id
        wef_instance_id = task_instance_obj.wef_instance_id
        task_obj = Task.objects.get(pk=task_id)
        succ_list = task_obj.successor
        workflow_instance_obj = Workflow_Instance.objects.get(pk=wef_instance_id)
        for task in succ_list:
            task_succ_obj = Task.objects.get(pk=task)
            task_instance_succ_obj = Task_Instance.objects.get(task_id = task,wef_instance_id=wef_instance_id)
            workflow_succ_obj = Workflow.objects.get(pk=task_instance_succ_obj.workflow_id)
            task_instance_succ_obj.predecessor_count-=1
            task_instance_succ_obj.save()
            if task_instance_succ_obj.predecessor_count==0:
                task_instance_succ_obj.status="AA"
                task_instance_succ_obj.save()
                workflow_instance_current_task = Workflow_Instance_Current_Task(workflow_instance_id=workflow_instance_obj,current_task_id=task_succ_obj,workflow_id=workflow_succ_obj)
                workflow_instance_current_task.save()
        
        task_instance_obj.status="CO"
        task_instance_obj.save()
        workflow_instance_obj.completed_tasks+=1
        workflow_instance_obj.save()
