# Generated by Django 5.1 on 2024-11-11 21:04

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0015_alter_company_options_remove_company_lastname'),
        ('postings', '0009_alter_job_education_level'),
    ]

    operations = [
        migrations.CreateModel(
            name='JobApplication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'Pendiente'), ('reviewing', 'En revisión'), ('accepted', 'Aceptada'), ('rejected', 'Rechazada')], default='pending', max_length=20)),
                ('cover_letter', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('freelancer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='job_applications', to='accounts.freelancer')),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='postings.job')),
            ],
            options={
                'unique_together': {('job', 'freelancer')},
            },
        ),
    ]