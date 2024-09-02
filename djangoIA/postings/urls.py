# urls.py
from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet, CategoryViewSet, SubcategoryViewSet, ServiceViewSet, NestedCategoryViewSet, JobViewSet, CompanyViewSet, search_items

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'subcategories', SubcategoryViewSet)
router.register(r'nestedcategories', NestedCategoryViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'jobs', JobViewSet)
router.register(r'companies', CompanyViewSet)


urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('api/v1/search/', search_items, name='search_items'),
]
