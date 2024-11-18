# Generated by Django 5.1 on 2024-11-11 17:44

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('postings', '0007_remove_service_price_service_basic_active_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='education_level',
            field=models.CharField(default='No especificado', max_length=100),
        ),
        migrations.AddField(
            model_name='job',
            name='position',
            field=models.CharField(default='No especificado', max_length=100),
        ),
        migrations.AddField(
            model_name='job',
            name='published_date',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='job',
            name='responsibilities',
            field=models.TextField(default=0.0004940711462450593),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='job',
            name='soft_skills',
            field=models.TextField(default='No especificado'),
        ),
        migrations.AddField(
            model_name='job',
            name='technical_skills',
            field=models.TextField(default='No especificado'),
        ),
    ]