from multiprocessing import process
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db import models
from .models import Category, Subcategory, Service, NestedCategory, Job
from .serializer import NestedcategorySerializer, CategorySerializer, SubcategorySerializer, ServiceSerializer, JobSerializer
from django.shortcuts import render, redirect
from .models import Job, Service
from .Jobforms import JobBasicInfoForm, JobDetailsForm, JobRequirementsForm, JobFinalReviewForm
from .Serviceform import ServiceBasicInfoForm, ServiceDetailsForm, ServiceFinalReviewForm
from accounts.models import Freelancer, Company
from accounts.serializer import FreelancerSerializer, CompanySerializer

def job_creation_step1(request):
    if request.method == 'POST':
        form = JobBasicInfoForm(request.POST)
        if form.is_valid():
            job = form.save(commit=False)
            job.company = request.user.company  # Asumiendo que el usuario está autenticado y tiene una empresa asociada
            job.step_completed = 1
            job.save()
            return redirect('job_creation_step2', job_id=job.id)
    else:
        form = JobBasicInfoForm()
    return render(request, 'job_creation_step1.html', {'form': form})

def job_creation_step2(request, job_id):
    job = Job.objects.get(id=job_id)
    if request.method == 'POST':
        form = JobDetailsForm(request.POST, instance=job)
        if form.is_valid():
            job = form.save(commit=False)
            job.step_completed = 2
            job.save()
            return redirect('job_creation_step3', job_id=job.id)
    else:
        form = JobDetailsForm(instance=job)
    return render(request, 'job_creation_step2.html', {'form': form})

def job_creation_step3(request, job_id):
    job = Job.objects.get(id=job_id)
    if request.method == 'POST':
        form = JobRequirementsForm(request.POST, instance=job)
        if form.is_valid():
            job = form.save(commit=False)
            job.step_completed = 3
            job.save()
            return redirect('job_creation_final_review', job_id=job.id)
    else:
        form = JobRequirementsForm(instance=job)
    return render(request, 'job_creation_step3.html', {'form': form})

def job_creation_final_review(request, job_id):
    job = Job.objects.get(id=job_id)
    if request.method == 'POST':
        form = JobFinalReviewForm(request.POST, instance=job)
        if form.is_valid():
            job = form.save(commit=False)
            job.status = Job.PENDING
            job.step_completed = 4
            job.save()
            return redirect('job_creation_success')
    else:
        form = JobFinalReviewForm(instance=job)
    return render(request, 'job_creation_final_review.html', {'form': form, 'job': job})

def service_creation_step1(request):
    if request.method == 'POST':
        form = ServiceBasicInfoForm(request.POST)
        if form.is_valid():
            service = form.save(commit=False)
            service.freelancer = request.user.freelancer  # Asumiendo que el usuario está autenticado y es un freelancer
            service.step_completed = 1
            service.save()
            return redirect('service_creation_step2', service_id=service.id)
    else:
        form = ServiceBasicInfoForm()
    return render(request, 'service_creation_step1.html', {'form': form})

def service_creation_step2(request, service_id):
    service = Service.objects.get(id=service_id)
    if request.method == 'POST':
        form = ServiceDetailsForm(request.POST, instance=service)
        if form.is_valid():
            service = form.save(commit=False)
            service.step_completed = 2
            service.save()
            return redirect('service_creation_final_review', service_id=service.id)
    else:
        form = ServiceDetailsForm(instance=service)
    return render(request, 'service_creation_step2.html', {'form': form})

def service_creation_final_review(request, service_id):
    service = Service.objects.get(id=service_id)
    if request.method == 'POST':
        form = ServiceFinalReviewForm(request.POST, request.FILES, instance=service)
        if form.is_valid():
            service = form.save(commit=False)
            service.status = Service.PENDING
            service.step_completed = 3
            service.save()
            return redirect('service_creation_success')
    else:
        form = ServiceFinalReviewForm(instance=service)
    return render(request, 'service_creation_final_review.html', {'form': form, 'service': service})

# ViewSets

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class SubcategoryViewSet(viewsets.ModelViewSet):
    queryset = Subcategory.objects.all()
    serializer_class = SubcategorySerializer

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

    def get_serializer_context(self):
        return {'request': self.request}

class NestedCategoryViewSet(viewsets.ModelViewSet):
    queryset = NestedCategory.objects.all()
    serializer_class = NestedcategorySerializer

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def get_serializer_context(self):
        return {'request': self.request}

# Funciones de ayuda
def levenshtein_distance(s1, s2):
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]

def find_best_match(query, terms, max_distance=2):
    best_match = None
    best_distance = float('inf')
    query_lower = query.lower()
    for term in terms:
        term_lower = term.lower()
        if query_lower in term_lower or term_lower in query_lower:
            distance = 0  # Prioriza coincidencias parciales
        else:
            distance = levenshtein_distance(query_lower, term_lower)
        if distance < best_distance and distance <= max_distance:
            best_match = term
            best_distance = distance
    return best_match

# Vistas de API
@api_view(['GET'])
def services_by_subcategory(request, subcategory_id):
    services = Service.objects.filter(subcategory_id=subcategory_id)
    serializer = ServiceSerializer(services, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def jobs_by_subcategory(request, subcategory_id):
    jobs = Job.objects.filter(subcategory_id=subcategory_id)
    serializer = JobSerializer(jobs, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def subcategories_by_category(request, category_id):
    subcategories = Subcategory.objects.filter(category_id=category_id)
    serializer = SubcategorySerializer(subcategories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def search_items(request):
    query = request.GET.get('q', '').strip()
    services_response = []
    jobs_response = []
    suggested_query = None

    try:
        if query:
            # Búsqueda exacta
            services = Service.objects.filter(models.Q(title__icontains=query) | models.Q(description__icontains=query))
            jobs = Job.objects.filter(models.Q(title__icontains=query) | models.Q(description__icontains=query))

            if not services.exists() and not jobs.exists():
                # Si no hay resultados exactos, buscar en categorías, subcategorías y nested categorías
                categories = Category.objects.filter(name__icontains=query)
                subcategories = Subcategory.objects.filter(name__icontains=query)
                nestedcategories = NestedCategory.objects.filter(name__icontains=query)

                if categories.exists():
                    services_response = Service.objects.filter(category__in=categories)
                    jobs_response = Job.objects.filter(category__in=categories)
                elif subcategories.exists():
                    services_response = Service.objects.filter(subcategory__in=subcategories)
                    jobs_response = Job.objects.filter(subcategory__in=subcategories)
                elif nestedcategories.exists():
                    services_response = Service.objects.filter(nestedcategory__in=nestedcategories)
                    jobs_response = Job.objects.filter(nestedcategory__in=nestedcategories)
                else:
                    # Si aún no hay resultados, buscar coincidencias aproximadas
                    all_terms = list(Service.objects.values_list('title', flat=True)) + \
                                list(Job.objects.values_list('title', flat=True)) + \
                                list(Category.objects.values_list('name', flat=True)) + \
                                list(Subcategory.objects.values_list('name', flat=True)) + \
                                list(NestedCategory.objects.values_list('name', flat=True))
                    
                    suggested_query = find_best_match(query, all_terms, max_distance=3)
                    if suggested_query:
                        services_response = Service.objects.filter(models.Q(title__icontains=suggested_query) | 
                                                                   models.Q(description__icontains=suggested_query))
                        jobs_response = Job.objects.filter(models.Q(title__icontains=suggested_query) | 
                                                           models.Q(description__icontains=suggested_query))
            else:
                services_response = services
                jobs_response = jobs

        # Serializa los datos con el contexto del request para obtener URLs completas
        services_serializer = ServiceSerializer(services_response, many=True, context={'request': request})
        jobs_serializer = JobSerializer(jobs_response, many=True, context={'request': request})

        response_data = {
            'services': services_serializer.data,
            'jobs': jobs_serializer.data,
            'suggested_query': suggested_query  # Siempre incluimos esta clave, aunque sea None
        }

        return Response(response_data)
    except Exception as e:
        return Response({'error': str(e), 'suggested_query': None})
