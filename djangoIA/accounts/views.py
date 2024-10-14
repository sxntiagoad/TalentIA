from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from .serializer import FreelancerSerializer, CompanySerializer

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_freelancer(request):
    serializer = FreelancerSerializer(data=request.data)
    if serializer.is_valid():
        freelancer = serializer.save()
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
