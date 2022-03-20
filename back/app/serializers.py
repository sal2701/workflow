from rest_framework import serializers
from models import Workflow


class WorkflowSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Workflow
        fields = ['workflow_name', 'description', 'workflow_id', 'num_of_task']


# class GroupSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = Group
#         fields = ['url', 'name']