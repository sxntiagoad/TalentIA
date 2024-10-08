# urls.py
from django.urls import path, include
from rest_framework import routers
from .views import (
    UserViewSet, 
    CategoryViewSet, 
    SubcategoryViewSet, 
    ServiceViewSet, 
    NestedCategoryViewSet, 
    JobViewSet, 
    CompanyViewSet,
    search_items,
    services_by_subcategory,
    subcategories_by_category,
    jobs_by_subcategory,
    publish_service  # Importa la nueva vista
)

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
    path('api/v1/services/subcategory/<int:subcategory_id>/', services_by_subcategory, name='services-by-subcategory'),
    path('api/v1/jobs/subcategory/<int:subcategory_id>/', jobs_by_subcategory, name='jobs-by-subcategory'),
    path('api/v1/subcategories/category/<int:category_id>/', subcategories_by_category, name='subcategories-by-category'),
    path('api/v1/publish-service/', publish_service, name='publish-service')  # Nueva URL para publicar servicio
]