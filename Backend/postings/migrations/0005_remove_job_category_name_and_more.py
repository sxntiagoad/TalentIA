# Generated by Django 5.1 on 2024-11-04 01:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('postings', '0004_job_category_name_job_nestedcategory_name_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='job',
            name='category_name',
        ),
        migrations.RemoveField(
            model_name='job',
            name='nestedcategory_name',
        ),
        migrations.RemoveField(
            model_name='job',
            name='subcategory_name',
        ),
        migrations.RemoveField(
            model_name='service',
            name='category_name',
        ),
        migrations.RemoveField(
            model_name='service',
            name='nestedcategory_name',
        ),
        migrations.RemoveField(
            model_name='service',
            name='subcategory_name',
        ),
    ]
