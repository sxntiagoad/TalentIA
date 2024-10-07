# Generated by Django 5.1 on 2024-10-07 04:43

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Company',
            fields=[
                ('customuser_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('name', models.CharField(max_length=50)),
                ('phone', models.CharField(blank=True, max_length=15)),
                ('information', models.TextField(blank=True, max_length=500)),
                ('company_avatar', models.ImageField(blank=True, null=True, upload_to='companies/')),
                ('company_location', models.CharField(blank=True, max_length=100)),
                ('company_language', models.CharField(blank=True, choices=[('es', 'Español'), ('en', 'English'), ('fr', 'Français'), ('de', 'Deutsch')], default='es', max_length=50)),
                ('interests', models.TextField(blank=True)),
            ],
            options={
                'abstract': False,
            },
            bases=('accounts.customuser',),
        ),
        migrations.CreateModel(
            name='Freelancer',
            fields=[
                ('customuser_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('name', models.CharField(max_length=50)),
                ('lastname', models.CharField(max_length=50)),
                ('role', models.CharField(blank=True, max_length=100)),
                ('phone', models.CharField(blank=True, max_length=15)),
                ('information', models.TextField(blank=True, max_length=500)),
                ('Freelancer_avatar', models.ImageField(blank=True, null=True, upload_to='users/')),
                ('Freelancer_location', models.CharField(blank=True, max_length=100)),
                ('Freelancer_language', models.CharField(blank=True, choices=[('es', 'Español'), ('en', 'English'), ('fr', 'Français'), ('de', 'Deutsch')], default='es', max_length=50)),
                ('interests', models.TextField(blank=True)),
            ],
            options={
                'abstract': False,
            },
            bases=('accounts.customuser',),
        ),
        migrations.CreateModel(
            name='CustomToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(max_length=40, unique=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
