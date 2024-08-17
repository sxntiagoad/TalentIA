from rest_framework import viewsets
from .models import User, Category, Subcategory, Service
from .serializer import NestedCategorySerializer, UserSerializer, CategorySerializer, SubcategorySerializer, ServiceSerializer, NestedCategory

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class SubcategoryViewSet(viewsets.ModelViewSet):
    queryset = Subcategory.objects.all()
    serializer_class = SubcategorySerializer

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class NestedCategoryViewSet(viewsets.ModelViewSet):
    queryset = NestedCategory.objects.all()
    serializer_class = NestedCategorySerializer
