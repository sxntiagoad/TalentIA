from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Avg
from django.shortcuts import get_object_or_404
from .models import Category, Subcategory, Service, NestedCategory, Job, Review, JobApplication, ServiceOrder, Payment, ServiceRequest
from .serializer import (
    NestedcategorySerializer, 
    CategorySerializer, 
    SubcategorySerializer, 
    ServiceSerializer, 
    JobSerializer,
    ReviewSerializer,
    JobApplicationSerializer,
    ServiceOrderSerializer,
    PaymentSerializer,
    ServiceRequestSerializer
)
import logging
import time

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
        
        # Procesar los datos booleanos correctamente
        data = request.data.copy()
        boolean_fields = ['basic_active', 'standard_active', 'premium_active', 'availability']
        for field in boolean_fields:
            if field in data:
                data[field] = data[field] in ['true', 'True', True, 1, '1']

        # Procesar los campos numéricos
        numeric_fields = [
            'basic_price', 'basic_delivery_time', 'basic_revisions',
            'standard_price', 'standard_delivery_time', 'standard_revisions',
            'premium_price', 'premium_delivery_time', 'premium_revisions'
        ]
        for field in numeric_fields:
            if field in data and data[field]:
                try:
                    if 'price' in field:
                        data[field] = float(data[field])
                    else:
                        data[field] = int(data[field])
                except (ValueError, TypeError):
                    return Response(
                        {f'error': f'El campo {field} debe ser un número válido'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

        serializer = ServiceSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            service = serializer.save(freelancer=freelancer)
            logger.info(f"Servicio creado exitosamente: {service}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        logger.error(f"Error en la validación: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except ObjectDoesNotExist:
        logger.error(f"El usuario {request.user.email} no tiene un perfil de freelancer")
        return Response(
            {'error': 'El usuario no tiene un perfil de freelancer'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}")
        return Response(
            {'error': 'Error interno del servidor'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_service_order(request, service_id):
    try:
        service = Service.objects.get(id=service_id)
        plan_type = request.data.get('plan_type')
        requirements = request.data.get('requirements', '')

        # Obtener el precio según el plan
        if plan_type == 'basic':
            amount = service.basic_price
        elif plan_type == 'standard':
            amount = service.standard_price
        elif plan_type == 'premium':
            amount = service.premium_price
        else:
            return Response(
                {'error': 'Plan no válido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Crear la orden
        order = ServiceOrder.objects.create(
            service=service,
            client=request.user,
            freelancer=service.freelancer,
            plan_type=plan_type,
            amount=amount,
            requirements=requirements
        )

        serializer = ServiceOrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Service.DoesNotExist:
        return Response(
            {'error': 'Servicio no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_payment(request, order_id):
    try:
        order = ServiceOrder.objects.get(id=order_id, client=request.user)
        
        # Verificar si ya existe una solicitud para esta orden
        existing_request = ServiceRequest.objects.filter(order=order).first()
        if existing_request:
            return Response(
                {'error': 'Ya existe una solicitud para esta orden'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Simular procesamiento de pago
        payment = Payment.objects.create(
            order=order,
            amount=order.amount,
            payment_method=request.data.get('payment_method', 'card'),
            status='Completado',
            transaction_id=f'SIMULATED_{order.id}_{int(time.time())}'
        )

        # Crear la solicitud de servicio
        service_request = ServiceRequest.objects.create(
            service=order.service,
            client=request.user,
            freelancer=order.freelancer,
            status='Pendiente',
            requirements=order.requirements,
            order=order
        )

        print(f"Solicitud creada: {service_request.id} para el servicio {service_request.service.title}")

        # La orden queda en estado Pendiente hasta que el freelancer la acepte
        order.status = 'Pendiente'
        order.save()

        return Response({
            'message': 'Pago procesado exitosamente',
            'order_id': order.id,
            'payment_id': payment.id,
            'request_id': service_request.id,
            'freelancer': {
                'id': order.freelancer.id,
                'name': order.freelancer.name,
                'type': 'freelancer'
            }
        })

    except ServiceOrder.DoesNotExist:
        return Response(
            {'error': 'Orden no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Error en process_payment: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_service_order_status(request, order_id):
    """Actualizar el estado de una orden de servicio"""
    try:
        order = ServiceOrder.objects.get(id=order_id)
        
        # Verificar que el usuario sea el freelancer del servicio
        if request.user.freelancer != order.freelancer:
            return Response(
                {'error': 'No tienes permiso para actualizar esta orden'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        new_status = request.data.get('status')
        if new_status not in dict(ServiceOrder.STATUS_CHOICES):
            return Response(
                {'error': 'Estado no válido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validar transiciones de estado
        if order.status == 'Pendiente' and new_status not in ['En Proceso', 'Rechazado']:
            return Response(
                {'error': 'Transición de estado no válida'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if order.status == 'En Proceso' and new_status != 'Completado':
            return Response(
                {'error': 'Solo se puede marcar como completado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        order.save()
        
        serializer = ServiceOrderSerializer(order)
        return Response(serializer.data)
        
    except ServiceOrder.DoesNotExist:
        return Response(
            {'error': 'Orden no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )

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

@api_view(['GET'])
def get_service_details(request, service_id):
    try:
        service = Service.objects.get(id=service_id)
        serializer = ServiceSerializer(service, context={'request': request})
        
        # Obtener los planes activos y sus detalles
        plans = {
            'basic': service.basic_active and {
                'price': service.basic_price,
                'description': service.basic_description,
                'delivery_time': service.basic_delivery_time,
                'revisions': service.basic_revisions
            },
            'standard': service.standard_active and {
                'price': service.standard_price,
                'description': service.standard_description,
                'delivery_time': service.standard_delivery_time,
                'revisions': service.standard_revisions
            },
            'premium': service.premium_active and {
                'price': service.premium_price,
                'description': service.premium_description,
                'delivery_time': service.premium_delivery_time,
                'revisions': service.premium_revisions
            }
        }
        
        response_data = {
            **serializer.data,
            'plans': {k: v for k, v in plans.items() if v}  # Solo incluir planes activos
        }
        
        return Response(response_data)
    except Service.DoesNotExist:
        return Response(
            {'error': 'Servicio no encontrado'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_service_plans(request, service_id):
    try:
        service = Service.objects.get(id=service_id)
        plans = {}
        
        if service.basic_active:
            plans['basic'] = {
                'price': service.basic_price,
                'description': service.basic_description,
                'delivery_time': service.basic_delivery_time,
                'revisions': service.basic_revisions
            }
            
        if service.standard_active:
            plans['standard'] = {
                'price': service.standard_price,
                'description': service.standard_description,
                'delivery_time': service.standard_delivery_time,
                'revisions': service.standard_revisions
            }
            
        if service.premium_active:
            plans['premium'] = {
                'price': service.premium_price,
                'description': service.premium_description,
                'delivery_time': service.premium_delivery_time,
                'revisions': service.premium_revisions
            }
            
        return Response(plans)
    except Service.DoesNotExist:
        return Response(
            {'error': 'Servicio no encontrado'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
def get_service_stats(request, service_id):
    try:
        service = Service.objects.get(id=service_id)
        
        # Contar solicitudes totales (excluyendo rechazadas)
        requests_count = ServiceRequest.objects.filter(
            service=service
        ).exclude(
            status='Rechazada'
        ).count()
        
        # Contar solicitudes completadas
        completed_count = ServiceRequest.objects.filter(
            service=service,
            status='Completada'
        ).count()
        
        return Response({
            'requests': requests_count,
            'completed': completed_count
        })
        
    except Service.DoesNotExist:
        return Response(
            {'error': 'Servicio no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_to_job(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
        freelancer = request.user.freelancer

        # Verificar si ya existe una aplicación
        if JobApplication.objects.filter(job=job, freelancer=freelancer).exists():
            return Response(
                {'error': 'Ya has aplicado a este trabajo'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Crear la aplicación con estado inicial 'Pendiente'
        application = JobApplication.objects.create(
            job=job,
            freelancer=freelancer,
            status='Pendiente',
            cover_letter=request.data.get('cover_letter', '')
        )

        return Response({
            'message': 'Aplicación enviada exitosamente',
            'application_id': application.id,
            'status': application.status
        }, status=status.HTTP_201_CREATED)

    except Job.DoesNotExist:
        return Response(
            {'error': 'Trabajo no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_job_applications(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
        # Verificamos si el usuario actual es el propietario del trabajo
        # comparando directamente con el campo company del trabajo
        if request.user.company != job.company:
            return Response(
                {'error': 'No tienes permiso para ver estas aplicaciones'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        applications = JobApplication.objects.filter(job=job)
        serializer = JobApplicationSerializer(
            applications, 
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)
    except Job.DoesNotExist:
        return Response(
            {'error': 'Trabajo no encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_application_status(request, application_id):
    try:
        application = JobApplication.objects.get(id=application_id)
        
        # Actualizamos la verificación de la misma manera
        if request.user.company != application.job.company:
            return Response(
                {'error': 'No tienes permiso para actualizar esta aplicación'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        new_status = request.data.get('status')
        if new_status not in dict(JobApplication.STATUS_CHOICES):
            return Response(
                {'error': 'Estado no válido'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        application.status = new_status
        application.save()
        
        serializer = JobApplicationSerializer(
            application,
            context={'request': request}
        )
        return Response(serializer.data)
        
    except JobApplication.DoesNotExist:
        return Response(
            {'error': 'Aplicación no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_application_status(request, job_id):
    try:
        # Verificar si el usuario tiene una aplicación para este trabajo
        application = JobApplication.objects.filter(
            job_id=job_id,
            freelancer=request.user.freelancer
        ).first()

        if application:
            return Response({
                'exists': True,
                'status': application.status,
                'id': application.id,
                'updated_at': application.updated_at
            })
        return Response({'exists': False})

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_applications(request):
    try:
        # Obtener todas las aplicaciones del freelancer actual
        applications = JobApplication.objects.filter(
            freelancer=request.user.freelancer
        ).select_related('job', 'job__company')

        serializer = JobApplicationSerializer(
            applications,
            many=True,
            context={'request': request}
        )
        
        # Enriquecer los datos con información adicional del trabajo y la empresa
        enriched_data = []
        for app in serializer.data:
            job = Job.objects.get(id=app['job'])
            enriched_app = {
                **app,
                'job_title': job.title,
                'company_name': job.company.name,
                'job_location': job.location,
                'salary': str(job.salary),
                'position': job.position
            }
            enriched_data.append(enriched_app)

        return Response(enriched_data)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_application_details(request, application_id):
    try:
        application = JobApplication.objects.select_related(
            'job', 'job__company'
        ).get(id=application_id)

        # Verificar que el usuario sea el freelancer de la aplicación
        if request.user.freelancer != application.freelancer:
            return Response(
                {'error': 'No tienes permiso para ver esta aplicación'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = JobApplicationSerializer(
            application,
            context={'request': request}
        )

        # Enriquecer los datos
        data = serializer.data
        data.update({
            'company_id': application.job.company.id,
            'job_title': application.job.title,
            'company_name': application.job.company.name,
            'job_location': application.job.location,
            'salary': str(application.job.salary),
            'position': application.job.position
        })

        return Response(data)

    except JobApplication.DoesNotExist:
        return Response(
            {'error': 'Aplicación no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_orders(request):
    orders = ServiceOrder.objects.filter(client=request.user)
    serializer = ServiceOrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_sales(request):
    try:
        freelancer = request.user.freelancer
        orders = ServiceOrder.objects.filter(freelancer=freelancer)
        serializer = ServiceOrderSerializer(orders, many=True)
        return Response(serializer.data)
    except:
        return Response(
            {'error': 'Usuario no es freelancer'},
            status=status.HTTP_403_FORBIDDEN
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_service_order(request, service_id):
    try:
        order = ServiceOrder.objects.filter(
            service_id=service_id,
            client=request.user
        ).select_related('service', 'freelancer', 'request').first()

        if order:
            # Obtener el estado de la solicitud si existe
            request_status = order.request.status if hasattr(order, 'request') else None
            
            return Response({
                'exists': True,
                'status': order.status,
                'request_status': request_status,
                'freelancer': {
                    'id': order.freelancer.id,
                    'name': f"{order.freelancer.name} {order.freelancer.lastname}",
                    'type': 'freelancer'
                }
            })
        return Response({'exists': False})
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_service_requests(request):
    """Obtener las solicitudes de servicios que he hecho como cliente"""
    try:
        requests = ServiceRequest.objects.filter(
            client=request.user
        ).select_related('service', 'freelancer', 'order')
        
        serializer = ServiceRequestSerializer(requests, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_received_service_requests(request):
    """Obtener las solicitudes recibidas como freelancer"""
    try:
        freelancer = request.user.freelancer
        print(f"Buscando solicitudes para freelancer ID: {freelancer.id}")
        
        # Obtener todas las solicitudes excepto las completadas y rechazadas
        requests = ServiceRequest.objects.filter(
            freelancer=freelancer,
            status__in=['Pendiente', 'Aceptada', 'En Proceso']
        ).select_related('service', 'client', 'order')
        
        print(f"Solicitudes encontradas para el freelancer: {requests.count()}")
        for req in requests:
            print(f"Solicitud ID: {req.id}, Servicio: {req.service.title}, Estado: {req.status}")
        
        serializer = ServiceRequestSerializer(requests, many=True)
        
        # Enriquecer los datos con más información
        enriched_data = []
        for request_data in serializer.data:
            enriched_request = {
                **request_data,
                'client_name': request_data['client_name'],
                'service_title': request_data['service_title'],
                'order_amount': str(request_data['order_amount']),
                'plan_type': request_data['plan_type'],
                'created_at': request_data['created_at']
            }
            enriched_data.append(enriched_request)
        
        print(f"Datos enriquecidos a devolver: {enriched_data}")
        return Response(enriched_data)
    except Exception as e:
        print(f"Error en get_received_service_requests: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_service_request_status(request, request_id):
    """Actualizar el estado de una solicitud"""
    try:
        service_request = ServiceRequest.objects.get(id=request_id)
        
        # Verificar que el usuario sea el freelancer del servicio
        if request.user.freelancer != service_request.freelancer:
            return Response(
                {'error': 'No tienes permiso para actualizar esta solicitud'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        new_status = request.data.get('status')
        if new_status not in dict(ServiceRequest.STATUS_CHOICES):
            return Response(
                {'error': 'Estado no válido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validar transiciones de estado
        if service_request.status == 'Pendiente' and new_status not in ['Aceptada', 'Rechazada']:
            return Response(
                {'error': 'Solo puedes aceptar o rechazar una solicitud pendiente'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if service_request.status == 'Aceptada' and new_status != 'En Proceso':
            return Response(
                {'error': 'Una solicitud aceptada solo puede pasar a En Proceso'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if service_request.status == 'En Proceso' and new_status != 'Completada':
            return Response(
                {'error': 'Una solicitud en proceso solo puede marcarse como completada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        service_request.status = new_status
        service_request.save()  # Esto actualizará automáticamente el estado de la orden
        
        # Devolver la respuesta con los datos actualizados
        serializer = ServiceRequestSerializer(service_request)
        return Response({
            **serializer.data,
            'order_status': service_request.order.status
        })
        
    except ServiceRequest.DoesNotExist:
        return Response(
            {'error': 'Solicitud no encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )
