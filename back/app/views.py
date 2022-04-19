import email
from pickle import FALSE, TRUE
from django.http import Http404, HttpResponse, HttpResponseServerError
from django.shortcuts import render
from django.db import models
from django.utils import timezone
from datetime import datetime, timedelta
from django.contrib.auth.models import AbstractBaseUser
from django.core.exceptions import ValidationError
import re
import os, binascii, hashlib
from .models import User_Workflow, Workflow, Task, UserManager, User, Role, Task_Role, Task_Instance, User_Role, Workflow_Instance, Workflow_Instance_Current_Task
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
from distutils.command.upload import upload
from django.shortcuts import render
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.core.files import File
from django.core.files.base import ContentFile
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
        if pk:
            task = self.get_task(pk)
            data = serializers.serialize('json', [task])
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
        # wf_instance = Workflow.objects.get(pk=data["wf_id"])
        obj = Role(role=data["role"])
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
    valid = 0
    
    def get(self, request):
        task_role = Task_Role.objects.all()      
        data = serializers.serialize('json', task_role)
        return Response(data)
    
    def post(self, request):
        data = request.data
        objs = []
        task_obj = Task.objects.get(pk=data["task"])
        workflow_obj = Workflow.objects.get(pk=data["wf_id"])
        
        predessor = task_obj.predecessor
        predessor = json.loads(predessor)
        for task in predessor:
            prev_task_obj = Task.objects.get(pk = task)
            if prev_task_obj.task_name == "ROOT":
                self.valid = 1
            
        for i in data["role"]:
            role_obj = Role.objects.get(pk=i)
            
            if self.valid == 1:
                users_role_list = User_Role.objects.filter(role_id = role_obj)
                for user_role in users_role_list:
                    # user = User.objects.get(pk=user_role.user_id)
                    check_user = User_Workflow.objects.filter(user_id = user_role.user_id, workflow_id = workflow_obj)
                    if len(check_user) == 0:
                        user_workflow_obj = User_Workflow(user_id = user_role.user_id, workflow_id = workflow_obj)
                        user_workflow_obj.save()
            
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
        
        for i in data["role"]:
            role_obj = Role.objects.get(pk=i)
            task_role_list = Task_Role.objects.filter(role_id = role_obj)
            for task_role in task_role_list:
                task_obj = Task.objects.get(pk = task_role.task_id.pk)
                workflow_obj = Workflow.objects.get(pk = task_obj.workflow_id.pk)
                predessor = task_obj.predecessor
                predessor = json.loads(predessor)
                for task in predessor:
                    prev_task_obj = Task.objects.get(pk = task)
                    if prev_task_obj.task_name == "ROOT":
                        check_user = User_Workflow.objects.filter(user_id = user_obj, workflow_id = workflow_obj)
                        if len(check_user) == 0:
                            user_workflow_obj = User_Workflow(user_id = user_obj, workflow_id = workflow_obj)
                            user_workflow_obj.save()
                        
            obj = User_Role(user_id=user_obj, role_id=role_obj)
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
    
    valid = False
    visited = dict()
    restack = dict()
    
    def dfs(self,adj_list, curr_task):
        if self.visited[curr_task] == False:
            self.visited[curr_task] = True
            self.restack[curr_task] = True            

            for nxt_task in adj_list[curr_task]:
                if self.visited[nxt_task] == False and self.dfs(adj_list, nxt_task) == True:
                    return True
                elif self.restack[nxt_task] == True:
                    return True
        
        self.restack[curr_task] = False
        return False
    
    def post(self, request):
        data = request.data
        suc_list = dict()
        pred_list = dict()
        roots = []
        leaves = []
        task_list = Task.objects.filter(workflow_id=data['workflow_id'])
        
        for task in task_list:
            pred_list[task.pk] = []
            suc_list[task.pk] = []
            self.visited[task.pk] = False
            self.restack[task.pk] = False
            
        for edge in data['edges']:
            suc_list[int(edge['source'])].append(int(edge['target']))
            pred_list[int(edge['target'])].append(int(edge['source']))
        
        for i in pred_list:
            if len(pred_list[i]) == 0:
                roots.append(i)
                self.valid = self.dfs(suc_list, i)
                if(self.valid == True):
                    print("Wrong")
                    return Response("Invalid")
        
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
        wf_obj = Workflow.objects.get(pk=data["wf_id"])
        wf_name = data["instance_name"]
        root_node_obj = Task.objects.get(workflow_id = wf_obj, task_name = "ROOT")
        wf_instance = Workflow_Instance(instance_name = wf_name, workflow_id = wf_obj, user_id = user_id, root_node_id = root_node_obj, total_tasks = wf_obj.num_of_task + 2, completed_tasks = 1)
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
        
        successor = Task.objects.get(pk=root_instance.task_id.pk).successor
        for nxt_task in json.loads(successor):
            nxt_task_obj = Task_Instance.objects.get(wef_instance_id = wf_instance, task_id = nxt_task)
            nxt_task_obj.status = "AA"
            nxt_task_obj.predecessor_count = 0
            nxt_task_obj.save()
            workflow_instance_current_task_obj = Workflow_Instance_Current_Task(workflow_instance_id = wf_instance, current_task_id = nxt_task_obj, workflow_id = wf_obj)
            workflow_instance_current_task_obj.save()
            
        return Response("Success")

class GetWorkflowStatus(APIView):
    def post(self, request):
        data = request.data
        user_obj = User.objects.get(email = data["email_id"])
        workflow_instances = Workflow_Instance.objects.filter(user_id = user_obj.pk)
        data = serializers.serialize('json',workflow_instances)
        return Response(data)

class GetTasksforUser(APIView):
    def post(self,request):
        data = request.data
        user_obj = User.objects.get(email = data["email_id"])
        user_role_list = User_Role.objects.filter(user_id = user_obj.pk)
        
        tasks_to_show = []
        visited = {}
        for user_roles in user_role_list:
            role_id = user_roles.role_id.pk
            role_obj = Role.objects.get(pk=role_id)
            role_task_list = Task_Role.objects.filter(role_id = role_obj)
            for role_task in role_task_list:
                task_id = role_task.task_id.pk
                task_obj = Task.objects.get(pk=task_id)
                workflow_id = task_obj.workflow_id.pk   
                workflow_obj = Workflow.objects.get(pk=workflow_id)
                task_instances_list = Task_Instance.objects.filter(task_id = task_obj,workflow_id=workflow_obj)
                for task_instance in task_instances_list:
                    if task_instance.status == "AA" and (task_instance.wef_instance_id.pk,task_instance.pk) not in visited:
                        json_object = {
                            "workflow_name": workflow_obj.workflow_name,
                            "workflow_instance_name": task_instance.wef_instance_id.instance_name, 
                            "workflow_instance_id": task_instance.wef_instance_id.pk,
                            "task_object": serializers.serialize('json', [task_obj]),
                            "task_instance_id": task_instance.pk
                        }
                        visited[(task_instance.wef_instance_id.pk,task_instance.pk)] = True
                        tasks_to_show.append(json_object)
         
        data = json.dumps(tasks_to_show)
        return Response(data)

class GoToTask(APIView):
    
    def post(self, request):
        data = request.data
        task_instance_obj = Task_Instance.objects.get(pk=data["task_instance_id"])
        if(task_instance_obj.status == "IP"):
            return Response("Already Inprogress")
        else:
            task_instance_obj.status = "IP"
            user_obj = User.objects.get(email = data["email_id"])
            task_instance_obj.user_id = user_obj
            task_instance_obj.save()
            data = serializers.serialize('json', [task_instance_obj])
            return Response(data)
        
class ChangeStatus(APIView):
    
    def post(self,request):
        data = request.data
        task_instance_obj = Task_Instance.objects.get(pk=data["task_instance_id"])
        task_instance_obj.status="AA"
        task_instance_obj.save()

class TaskComplete(APIView):
    
    def post(self, request):
        data = request.data
        task_instance_obj = Task_Instance.objects.get(pk=data["task_instance_id"])
        task_id = task_instance_obj.task_id.pk
        wef_instance_id = task_instance_obj.wef_instance_id.pk
        task_obj = Task.objects.get(pk=task_id)
        succ_list = task_obj.successor
        workflow_instance_obj = Workflow_Instance.objects.get(pk=wef_instance_id)
        try:
            for task in json.loads(succ_list):
                task_succ_obj = Task.objects.get(pk=task)
                task_instance_succ_obj = Task_Instance.objects.get(task_id = task, wef_instance_id = wef_instance_id)
                workflow_succ_obj = Workflow.objects.get(pk=task_instance_succ_obj.workflow_id.pk)
                task_instance_succ_obj.predecessor_count-=1
                task_instance_succ_obj.save()
                if task_instance_succ_obj.predecessor_count == 0 and task_succ_obj.task_name != "LEAF":
                    task_instance_succ_obj.status = "AA" 
                    task_instance_succ_obj.save()
                    workflow_instance_current_task = Workflow_Instance_Current_Task(workflow_instance_id=workflow_instance_obj,current_task_id=task_instance_succ_obj,workflow_id=workflow_succ_obj)
                    workflow_instance_current_task.save()
            
            task_instance_obj.status="CO"
            task_instance_obj.save()
            wf_instance_current_task_obj = Workflow_Instance_Current_Task.objects.get(current_task_id=data["task_instance_id"])
            wf_instance_current_task_obj.delete()

            workflow_instance_obj.completed_tasks+=1
            workflow_instance_obj.save()
            return Response(serializers.serialize('json', [workflow_instance_obj]))
            
        except Exception as e:
            print(e)
            return HttpResponseServerError()
        
class UserInitializeWorkflow(APIView):
    
    def post(self, request):
        data = request.data
        user_obj = User.objects.get(email = data["email_id"])
        user_workflow_list = User_Workflow.objects.filter(user_id = user_obj)
        workflow_list = []
        if user_obj.is_superuser:
           workflows = Workflow.objects.all()
           return Response(serializers.serialize('json', workflows)) 
        else:
            for workflow in user_workflow_list: 
                workflow_obj = Workflow.objects.get(pk = workflow.workflow_id.pk)
                workflow_list.append(workflow_obj)
            return Response(serializers.serialize('json',workflow_list))
    
class UploadFile(APIView):
    
    def post(self,request):
        if 'upload' in request.FILES:
            myfile = request.FILES['upload']
            fs = FileSystemStorage()
            new_path = request.data['task_instance_id']+'/upload.pdf'
            if fs.exists(new_path):
                fs.delete(new_path)
            filename = fs.save(new_path, myfile)
            uploaded_file_url = fs.url(filename)
            return Response(uploaded_file_url)
        elif 'write' in request.data.keys():
            new_path = str(request.data['task_instance_id'])+'/write.txt'
            fs = FileSystemStorage()
            if fs.exists(new_path):
                fs.delete(new_path)
            testfile = ContentFile(request.data['write'])
            filename = fs.save(new_path,testfile)
            uploaded_file_url = fs.url(filename)
            testfile.close
            return Response(uploaded_file_url)
        return Response("File not Saved")