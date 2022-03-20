from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Workflow)
admin.site.register(Role)
admin.site.register(Task)
admin.site.register(Task_Role)
admin.site.register(User)
admin.site.register(User_Role)
admin.site.register(Workflow_Instance)
admin.site.register(Workflow_Instance_Current_Task)
admin.site.register(Task_Instance)