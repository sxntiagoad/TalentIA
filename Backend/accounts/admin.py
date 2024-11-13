from django.contrib import admin
from .models import Freelancer, Company

# Registrar los modelos en el panel de administración
admin.site.register(Freelancer)
admin.site.register(Company)
