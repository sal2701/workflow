# Generated by Django 4.0.3 on 2022-04-08 16:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_alter_workflow_instance_current_task_current_task_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task_instance',
            name='user_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='task_instance_user', to=settings.AUTH_USER_MODEL),
        ),
    ]
