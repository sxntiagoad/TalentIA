from django.contrib import admin
from .models import User, Service, Category, Subcategory, NestedCategory

admin.site.register(User)
admin.site.register(Service)
admin.site.register(Category)
admin.site.register(Subcategory)
admin.site.register(NestedCategory)