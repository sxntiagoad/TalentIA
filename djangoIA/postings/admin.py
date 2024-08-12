from django.contrib import admin
from .models import User, Service, Category, Subcategory

admin.site.register(User)
admin.site.register(Service)
admin.site.register(Category)
admin.site.register(Subcategory)