from django.contrib import admin
from .models import CustomUser, Company, Freelancer

admin.site.register(CustomUser)
admin.site.register(Company)
admin.site.register(Freelancer)