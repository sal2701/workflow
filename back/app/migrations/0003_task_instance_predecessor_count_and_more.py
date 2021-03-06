# Generated by Django 4.0.3 on 2022-04-08 06:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_remove_user_has_perm_user_groups_user_is_superuser_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='task_instance',
            name='predecessor_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='workflow_instance',
            name='completed_tasks',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='workflow_instance',
            name='root_node_id',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='workflow_root_task', to='app.task'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='workflow_instance',
            name='total_tasks',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='task_instance',
            name='status',
            field=models.CharField(choices=[('NA', 'NA'), ('AA', 'AA'), ('IP', 'IP'), ('CO', 'CO')], max_length=2),
        ),
    ]
