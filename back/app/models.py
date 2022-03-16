from django.db import models
from django.contrib.postgres.fields import ArrayField


# Create your models here.
class Workflow(models.Model):
    	
    workflow_id = models.IntegerField(unique=True, null=False)
    workflow_name = models.CharField(null=False)
    num_of_task = models.IntegerField(null=False)
    description = models.TextField(max_length=-1)
    
    
class Role(models.Model):
    role_id =  models.IntegerField(unique=True, null=False)
    role = models.CharField(null=False,max_length=255)   
    workflow_id = models.ForeignKey(Workflow,on_delete=models.CASCADE, related_name = "role_workflow")

class Task(models.Model):
    
    WRITE="WR"
    UPLOAD="UP"
    APPROVE="AR"
    
    HOWS = [
        (WRITE,"Write"),
        (UPLOAD,"Upload"),
        (APPROVE,"Approve/Reject")
    ]
    	
    task_id = models.IntegerField(unique=True, null=False)
    workflow_id = models.ForeignKey(Workflow,on_delete=models.CASCADE, related_name = "task_workflow")
    task_name = models.CharField(null=False)
    description = models.TextField(max_length=-1)
    successor = ArrayField(models.IntegerField(),size=-1)
    predecessor = ArrayField(models.IntegerField(),size=-1)
    action = models.CharField(max_length=2,choices=HOWS)
    role_id = ArrayField(models.ForeignKey(Role, related_name = "task_role"))
    
    
class User(models.Model):
    
    user_id = models.IntegerField(unique=True, null=False)
    username = models.CharField(null=False,unique=True,max_length = 255)
    password = models.CharField(null=False,unique=True,max_length = 255)
    role_id = ArrayField(models.ForeignKey(Role, related_name = "user_role"))
    
    
class Workflow_instance(models.Model):
    
    wef_instance_id = models.IntegerField(unique=True, null=False)
    workflow_id = models.ForeignKey(Workflow,on_delete=models.CASCADE, related_name = "workflow_instance_workflow")
    user_id = models.ForeignKey(User,related_name = "workflow_instance_user")
    current_task = ArrayField(models.ForeignKey(Task,related_name="workflow_instance_task"))

class Task_instance(models.Model):
    
    task_instance_id = models.IntegerField(unique=True,null=False)
    wef_instance_id = models.ForeignKey(Workflow_instance,related="task_instance_workflow_instance")
    user_id = models.ForeignKey(User,on_delete = models.CASCADE,related_name = "task_instance_user")
    task_id = models.ForeignKey(Task,on_delete = models.CASCADE,related_name = "task_instance_task")
    status = models.BooleanField()
    