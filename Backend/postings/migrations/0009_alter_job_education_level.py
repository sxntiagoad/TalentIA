# Generated by Django 5.1 on 2024-11-11 20:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('postings', '0008_job_education_level_job_position_job_published_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='education_level',
            field=models.TextField(default='No especificado'),
        ),
    ]