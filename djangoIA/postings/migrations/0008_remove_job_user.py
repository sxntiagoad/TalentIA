# Generated by Django 5.1 on 2024-08-18 01:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('postings', '0007_rename_aviliability_service_availability_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='job',
            name='user',
        ),
    ]
