# urls.py
from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet, CategoryViewSet, SubcategoryViewSet, ServiceViewSet, NestedCategoryViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'subcategories', SubcategoryViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'nestedcategories', NestedCategoryViewSet)

urlpatterns = [
    path('api/v1/', include(router.urls)),
]
