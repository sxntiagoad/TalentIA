from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db import models
from .models import User, Category, Subcategory, Service, NestedCategory, Job, Company
from .serializer import NestedcategorySerializer, UserSerializer, CategorySerializer, SubcategorySerializer, ServiceSerializer, JobSerializer, CompanySerializer

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
    serializer_class = NestedcategorySerializer

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    
class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

@api_view(['GET'])
def search_items(request):
    query = request.GET.get('q', '')
    services_response = []
    jobs_response = []

    try:
        if query:
            services = Service.objects.filter(models.Q(title__icontains=query) | models.Q(description__icontains=query))

            if services.exists():
                services_response = services
            else:
                categories = Category.objects.filter(name__icontains=query)
                if categories.exists():
                    services_response = Service.objects.filter(category__in=categories)
                else:
                    subcategories = Subcategory.objects.filter(name__icontains=query)
                    if subcategories.exists():
                        services_response = Service.objects.filter(subcategory__in=subcategories)
                    else:
                        nestedcategories = NestedCategory.objects.filter(name__icontains=query)
                        if nestedcategories.exists():
                            services_response = Service.objects.filter(nestedcategory__in=nestedcategories)

            jobs = Job.objects.filter(models.Q(title__icontains=query) | models.Q(description__icontains=query))

            if jobs.exists():
                jobs_response = jobs
            else:
                categories = Category.objects.filter(name__icontains=query)
                if categories.exists():
                    jobs_response = Job.objects.filter(category__in=categories)
                else:
                    subcategories = Subcategory.objects.filter(name__icontains=query)
                    if subcategories.exists():
                        jobs_response = Job.objects.filter(subcategory__in=subcategories)
                    else:
                        nestedcategories = NestedCategory.objects.filter(name__icontains=query)
                        if nestedcategories.exists():
                            jobs_response = Job.objects.filter(nestedcategory__in=nestedcategories)

        services_serializer = ServiceSerializer(services_response, many=True)
        jobs_serializer = JobSerializer(jobs_response, many=True)

        return Response({'services': services_serializer.data, 'jobs': jobs_serializer.data})
    except Exception as e:
        return Response({'error': str(e)})