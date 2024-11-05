from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Avg
from django.shortcuts import get_object_or_404
from .models import Category, Subcategory, Service, NestedCategory, Job, Review
from .serializer import (
    NestedcategorySerializer, 
    CategorySerializer, 
    SubcategorySerializer, 
    ServiceSerializer, 
    JobSerializer,
    ReviewSerializer
)
import logging

logger = logging.getLogger(__name__)

# ViewSets
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class SubcategoryViewSet(viewsets.ModelViewSet):
    queryset = Subcategory.objects.all()
    serializer_class = SubcategorySerializer

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all().select_related('freelancer')
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

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

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
            distance = 0
        else:
            distance = levenshtein_distance(query_lower, term_lower)
        if distance < best_distance and distance <= max_distance:
            best_match = term
            best_distance = distance
    return best_match

# API endpoints para creación
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_job(request):
    try:
        company = request.user.company
        logger.info(f"Compañía encontrada: {company}")
    except ObjectDoesNotExist:
        logger.error(f"El usuario {request.user.email} no tiene un perfil de empresa")
        return Response({'error': 'El usuario no tiene un perfil de empresa'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = JobSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        job = serializer.save()
        logger.info(f"Trabajo creado: {job}, Compañía: {job.company}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    logger.error(f"Error al crear el trabajo: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_service(request):
    try:
        freelancer = request.user.freelancer
        logger.info(f"Freelancer encontrado: {freelancer}")
    except ObjectDoesNotExist:
        logger.error(f"El usuario {request.user.username} no tiene un perfil de freelancer")
        return Response({'error': 'El usuario no tiene un perfil de freelancer'}, status=status.HTTP_403_FORBIDDEN)

    serializer = ServiceSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        service = serializer.save()
        logger.info(f"Servicio creado: {service}, Freelancer: {service.freelancer}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    logger.error(f"Error al crear el servicio: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API endpoints para consultas
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
def nestedcategories_by_subcategory(request, subcategory_id):
    nestedcategories = NestedCategory.objects.filter(subcategory_id=subcategory_id)
    serializer = NestedcategorySerializer(nestedcategories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def search_items(request):
    query = request.GET.get('q', '').strip()
    services_response = []
    jobs_response = []
    suggested_query = None

    try:
        if query:
            services = Service.objects.filter(models.Q(title__icontains=query) | models.Q(description__icontains=query))
            jobs = Job.objects.filter(models.Q(title__icontains=query) | models.Q(description__icontains=query))

            if not services.exists() and not jobs.exists():
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

        services_serializer = ServiceSerializer(services_response, many=True, context={'request': request})
        jobs_serializer = JobSerializer(jobs_response, many=True, context={'request': request})

        response_data = {
            'services': services_serializer.data,
            'jobs': jobs_serializer.data,
            'suggested_query': suggested_query
        }

        return Response(response_data)
    except Exception as e:
        return Response({'error': str(e), 'suggested_query': None})

# API endpoints para reviews
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request):
    try:
        user = request.user
        service_id = request.data.get('service')
        job_id = request.data.get('job')
        
        if service_id and job_id:
            return Response(
                {'error': 'No se puede revisar un servicio y un trabajo al mismo tiempo'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if not service_id and not job_id:
            return Response(
                {'error': 'Debe especificar un servicio o trabajo para revisar'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ReviewSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            review = serializer.save(author=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_service_reviews(request, service_id):
    reviews = Review.objects.filter(service_id=service_id).select_related('author')
    serializer = ReviewSerializer(reviews, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET']) 
def get_job_reviews(request, job_id):
    reviews = Review.objects.filter(job_id=job_id).select_related('author')
    serializer = ReviewSerializer(reviews, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_review(request, review_id):
    review = get_object_or_404(Review, id=review_id)
    
    if review.author != request.user:
        return Response(
            {'error': 'No tienes permiso para editar esta review'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = ReviewSerializer(
        review,
        data=request.data,
        partial=True,
        context={'request': request}
    )
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_review(request, review_id):
    try:
        review = get_object_or_404(Review, id=review_id)
        
        if review.author != request.user:
            return Response(
                {'error': 'No tienes permiso para eliminar esta review'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        review.delete()
        return Response({'message': 'Review eliminada exitosamente'}, status=status.HTTP_200_OK)
    
    except Review.DoesNotExist:
        return Response({'message': 'Review no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': 'Error al eliminar la review'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
