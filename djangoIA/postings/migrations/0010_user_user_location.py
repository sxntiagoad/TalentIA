# Generated by Django 5.1 on 2024-08-18 18:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('postings', '0009_user_user_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='user_location',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]