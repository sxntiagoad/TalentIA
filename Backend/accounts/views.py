from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.db.models import Q
from .serializer import FreelancerSerializer, CompanySerializer
from .models import Freelancer, Company

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_freelancer(request):
    serializer = FreelancerSerializer(data=request.data)
    if serializer.is_valid():
        freelancer = serializer.save(profile_completed=False)
        token, _ = Token.objects.get_or_create(user=freelancer)
        return Response({
            'token': token.key,
            'freelancer': FreelancerSerializer(freelancer).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_company(request):
    serializer = CompanySerializer(data=request.data)
    if serializer.is_valid():
        company = serializer.save()
        token, _ = Token.objects.get_or_create(user=company)
        return Response({
            'token': token.key,
            'company': CompanySerializer(company).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = User.objects.filter(email=email).first()
    
    if user and user.check_password(password):
        token, _ = Token.objects.get_or_create(user=user)
        if hasattr(user, 'freelancer'):
            return Response({
                'token': token.key,
                'freelancer': FreelancerSerializer(user.freelancer).data
            })
        else:
            return Response({
                'token': token.key,
                'company': CompanySerializer(user.company).data
            })
    return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    request.auth.delete()
    return Response({'message': 'Sesión cerrada exitosamente.'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    usuario = request.user
    if hasattr(usuario, 'freelancer'):
        instancia = usuario.freelancer
        clase_serializador = FreelancerSerializer
    else:
        instancia = usuario.company
        clase_serializador = CompanySerializer

    serializador = clase_serializador(instancia)
    return Response(serializador.data)

# Añadir una nueva vista para completar el perfil
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def complete_freelancer_profile(request):
    freelancer = request.user.freelancer
    serializer = FreelancerSerializer(freelancer, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save(profile_completed=True)
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Añadir una nueva vista para completar el perfil de empresa
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def complete_company_profile(request):
    try:
        company = request.user.company
        serializer = CompanySerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(profile_completed=True)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"Error en complete_company_profile: {str(e)}")
        return Response(
            {'error': f'Error al actualizar el perfil: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_company_email(request, company_name):
    try:
        company = Company.objects.get(name=company_name)
        return Response({
            'email': company.email
        })
    except Company.DoesNotExist:
        return Response(
            {'error': 'Compañía no encontrada'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
def get_freelancer_email(request, name, lastname):
    try:
        freelancer = Freelancer.objects.get(name=name, lastname=lastname)
        return Response({
            'email': freelancer.email
        })
    except Freelancer.DoesNotExist:
        return Response(
            {'error': 'Freelancer no encontrado'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
def get_company_id(request, company_name):
    try:
        company = Company.objects.get(name=company_name)
        return Response({
            'id': company.id,
            'name': company.name,
            'email': company.email
        })
    except Company.DoesNotExist:
        return Response(
            {'error': 'Compañía no encontrada'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def search_freelancers(request):
    try:
        search_params = request.data

        query = Q()

        # Búsqueda por nombre
        if search_params.get('name'):
            name_terms = search_params['name'].lower().strip().split()
            name_query = Q()
            for term in name_terms:
                name_query |= (
                    Q(name__icontains=term) | 
                    Q(lastname__icontains=term)
                )
            query &= name_query

        # Búsqueda por habilidades
        if search_params.get('skills'):
            skills = [skill.strip().lower() for skill in search_params['skills'].split(',')]
            skills_query = Q()
            for skill in skills:
                skills_query |= Q(skills__icontains=skill)
            query &= skills_query

        # Búsqueda por ubicación
        if search_params.get('location'):
            location_term = search_params['location'].lower().strip()
            query &= Q(location__icontains=location_term)

        # Búsqueda por experiencia
        if search_params.get('experience'):
            exp_terms = search_params['experience'].lower().strip().split()
            exp_query = Q()
            for term in exp_terms:
                exp_query |= Q(experience__icontains=term)
            query &= exp_query

        # Búsqueda por educación
        if search_params.get('education'):
            edu_terms = search_params['education'].lower().strip().split()
            edu_query = Q()
            for term in edu_terms:
                edu_query |= Q(education__icontains=term)
            query &= edu_query

        # Búsqueda por idioma
        if search_params.get('language'):
            language_term = search_params['language'].lower().strip()
            query &= Q(language__icontains=language_term)

        # Realizar la búsqueda
        freelancers = Freelancer.objects.filter(query).distinct()

        serializer = FreelancerSerializer(freelancers, many=True)
        
        return Response({
            'freelancers': serializer.data,
            'count': len(serializer.data)
        })

    except Exception as e:
        return Response(
            {
                'error': f'Error en la búsqueda de freelancers: {str(e)}',
                'detail': str(e)
            }, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
def get_public_profile(request, user_type, user_id):
    """Vista unificada para obtener perfiles públicos"""
    try:
        if user_type == 'freelancer':
            instance = Freelancer.objects.get(id=user_id)
            serializer = FreelancerSerializer(instance)
        elif user_type == 'company':
            instance = Company.objects.get(id=user_id)
            serializer = CompanySerializer(instance)
        else:
            return Response(
                {'error': 'Tipo de usuario inválido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({
            'type': user_type,
            'data': serializer.data
        })
    except (Freelancer.DoesNotExist, Company.DoesNotExist):
        return Response(
            {'error': 'Perfil no encontrado'}, 
            status=status.HTTP_404_NOT_FOUND
        )
