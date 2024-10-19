# urls.py
from django.urls import path, include
from rest_framework import routers
from .views import (
    CategoryViewSet, 
    SubcategoryViewSet, 
    ServiceViewSet, 
    NestedCategoryViewSet, 
    JobViewSet, 
    search_items,
    services_by_subcategory,
    subcategories_by_category,
    jobs_by_subcategory,
    create_job,
    create_service,
    nestedcategories_by_subcategory
)

router = routers.DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'subcategories', SubcategoryViewSet)
router.register(r'nestedcategories', NestedCategoryViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'jobs', JobViewSet)

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('api/v1/search/', search_items, name='search_items'),
    path('api/v1/all-subcategories/', subcategories_by_category, name='all-subcategories'),
    path('api/v1/services/subcategory/<int:subcategory_id>/', services_by_subcategory, name='services-by-subcategory'),
    path('api/v1/jobs/subcategory/<int:subcategory_id>/', jobs_by_subcategory, name='jobs-by-subcategory'),
    path('api/v1/subcategories/category/<int:category_id>/', subcategories_by_category, name='subcategories-by-category'),
    path('api/v1/create-job/', create_job, name='create-job'),
    path('api/v1/create-service/', create_service, name='create-service'),
    path('api/v1/nestedcategories/subcategory/<int:subcategory_id>/', 
         nestedcategories_by_subcategory, 
         name='nestedcategories-by-subcategory'),
]
