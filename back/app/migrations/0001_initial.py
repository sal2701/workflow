# Generated by Django 4.0.3 on 2022-03-29 06:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('task_id', models.IntegerField()),
                ('task_name', models.CharField(max_length=100)),
                ('description', models.TextField(max_length=255)),
                ('successor', models.IntegerField()),
                ('predecessor', models.IntegerField()),
                ('action', models.CharField(choices=[('WR', 'Write'), ('UP', 'Upload'), ('AR', 'Approve/Reject')], max_length=2)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=255, unique=True, verbose_name='email address')),
                ('is_active', models.BooleanField(default=True)),
                ('staff', models.BooleanField(default=False)),
                ('admin', models.BooleanField(default=False)),
                ('has_perm', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Workflow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('workflow_name', models.CharField(max_length=100)),
                ('num_of_task', models.IntegerField()),
                ('description', models.TextField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Workflow_Instance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workflow_instance_user', to='app.user')),
                ('workflow_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workflow_instance_workflow', to='app.workflow')),
            ],
        ),
        migrations.CreateModel(
            name='Workflow_Instance_Current_Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('current_task_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='current_task_workflow_instance_current_task', to='app.task')),
                ('workflow_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workflow_worrkflow_instance_current_task', to='app.workflow')),
                ('workflow_instance_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workflow_instance_workflow_instance_current_task', to='app.workflow_instance')),
            ],
        ),
        migrations.CreateModel(
            name='User_Role',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='role_user_role', to='app.role')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_user_role', to='app.user')),
                ('workflow_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workflow_user_role', to='app.workflow')),
            ],
        ),
        migrations.CreateModel(
            name='Task_Role',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='role_task_role', to='app.role')),
                ('task_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='task_task_role', to='app.task')),
                ('workflow_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workflow_task_role', to='app.workflow')),
            ],
        ),
        migrations.CreateModel(
            name='Task_Instance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.BooleanField()),
                ('task_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='task_instance_task', to='app.task')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='task_instance_user', to='app.user')),
                ('wef_instance_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='task_instance_workflow_instance', to='app.workflow_instance')),
                ('workflow_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workflow_task_instance', to='app.workflow')),
            ],
        ),
        migrations.AddField(
            model_name='task',
            name='workflow_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='task_workflow', to='app.workflow'),
        ),
        migrations.AddField(
            model_name='role',
            name='workflow_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='role_workflow', to='app.workflow'),
        ),
    ]
