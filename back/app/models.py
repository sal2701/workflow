from django.db import models
from django.contrib.postgres.fields import ArrayField
from django import forms
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)

# Create your models here.
class Workflow(models.Model):	
    # workflow_id = models.IntegerField(unique=True, null=False)
    workflow_name = models.CharField(null=False, max_length=100)
    num_of_task = models.IntegerField(null=False)
    description = models.TextField(max_length=255)

    def __str__(self):
        return f"{self.workflow_name} {self.pk}"
        
class Role(models.Model):
    role = models.CharField(null=False,max_length=255)   
    workflow_id = models.ForeignKey(Workflow,on_delete=models.CASCADE, related_name = "role_workflow")

    def __str__(self):
        return self.role
class Task(models.Model):
    
    WRITE="WR"
    UPLOAD="UP"
    APPROVE="AR"
    HOWS = [
        (WRITE,"Write"),
        (UPLOAD,"Upload"),
        (APPROVE,"Approve/Reject")
    ]
    	
    task_id = models.IntegerField(null=False)
    workflow_id = models.ForeignKey(Workflow,on_delete=models.CASCADE, related_name = "task_workflow")
    task_name = models.CharField(null=False, max_length=100)
    description = models.TextField(max_length=255)
    successor = models.TextField(max_length=1000)
    predecessor = models.TextField(max_length=1000)
    action = models.CharField(max_length=2,choices=HOWS)

    def __str__(self):
        return self.task_name
class Task_Role(models.Model):
    task_id = models.ForeignKey(Task, related_name="task_task_role", on_delete=models.CASCADE)
    role_id = models.ForeignKey(Role, related_name="role_task_role", on_delete=models.CASCADE)
    workflow_id = models.ForeignKey(Workflow, related_name="workflow_task_role", on_delete=models.CASCADE)

    def __str__(self):
        return f"Task_id:{self.task_id}, Role_id:{self.role_id}"
    
class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_staffuser(self, email, password):
        """
        Creates and saves a staff user with the given email and password.
        """
        user = self.create_user(
            email,
            password=password,
        )
        user.staff = True
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            email,
            password=password,
        )
        user.staff = True
        user.admin = True
        user.has_perm = True
        user.is_superuser=True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(
        null=False,
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    is_active = models.BooleanField(default=True)
    staff = models.BooleanField(default=False) # a admin user; non super-user
    admin = models.BooleanField(default=False) # a superuser
    has_perm = models.BooleanField(default=False)
    # notice the absence of a "Password field", that is built in.

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] # Email & Password are required by default.
    objects = UserManager()

    def get_full_name(self):
        # The user is identified by their email address
        return self.email

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        # print(self.is_superuser)
        return self.is_superuser
    
    @property
    def is_staff(self):
        "Is the user a member of staff?"
        return self.staff

    @property
    def is_admin(self):
        "Is the user a admin member?"
        return self.admin

    def __str__(self):
        return self.email

class User_Role(models.Model):
    user_id = models.ForeignKey(User, related_name="user_user_role", on_delete=models.CASCADE)
    role_id = models.ForeignKey(Role, related_name="role_user_role", on_delete=models.CASCADE)
    workflow_id = models.ForeignKey(Workflow, related_name="workflow_user_role", on_delete=models.CASCADE)

    def __str__(self):
        return f"User_id:{self.user_id}, Role_id:{self.role_id}"
    
class Workflow_Instance(models.Model):
    workflow_id = models.ForeignKey(Workflow,on_delete=models.CASCADE, related_name = "workflow_instance_workflow")
    user_id = models.ForeignKey(User,related_name = "workflow_instance_user", on_delete=models.CASCADE) #for instantiator
    root_node_id = models.ForeignKey(Task, related_name="workflow_root_task", on_delete=models.CASCADE)
    total_tasks = models.IntegerField(null=False, default=0)
    completed_tasks = models.IntegerField(null=False, default=0)

    def __str__(self):
        return f"Workflow_id:{self.workflow_id}, Total Tasks: {self.total_tasks}"

class Task_Instance(models.Model):

    INACTIVE="NA"
    ACTIVE="AA"
    INPROGRESS="IP"
    COMPLETED="CO"

    STATES = [
        (INACTIVE,"NA"),
        (ACTIVE,"AA"),
        (INPROGRESS,"IP"),
        (COMPLETED,"CO")
    ]

    wef_instance_id = models.ForeignKey(Workflow_Instance, related_name="task_instance_workflow_instance", on_delete=models.CASCADE)
    user_id = models.ForeignKey(User,on_delete = models.CASCADE,related_name = "task_instance_user", null=True)
    task_id = models.ForeignKey(Task,on_delete = models.CASCADE,related_name = "task_instance_task")
    workflow_id = models.ForeignKey(Workflow, related_name="workflow_task_instance", on_delete=models.CASCADE)
    status = models.CharField(max_length=2, choices=STATES)
    predecessor_count = models.IntegerField(null=False, default=0)

    def __str__(self):
        return f"Task_id:{self.task_id}, User_id:{self.user_id}, Status:{self.status}, pk:{self.pk}"
    
class Workflow_Instance_Current_Task(models.Model):
    workflow_instance_id = models.ForeignKey(Workflow_Instance, related_name="workflow_instance_workflow_instance_current_task", on_delete=models.CASCADE)
    current_task_id = models.ForeignKey(Task_Instance, related_name="current_task_workflow_instance_current_task", on_delete=models.CASCADE)
    workflow_id = models.ForeignKey(Workflow, related_name="workflow_worrkflow_instance_current_task", on_delete=models.CASCADE)

    def __str__(self):
        return f"Current_task_id:{self.current_task_id}, Workflow_id:{self.workflow_id}"