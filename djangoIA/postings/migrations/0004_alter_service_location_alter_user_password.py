# Generated by Django 5.1 on 2024-08-13 01:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('postings', '0003_category_service_category_subcategory_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='service',
            name='location',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(max_length=128),
        ),
    ]
