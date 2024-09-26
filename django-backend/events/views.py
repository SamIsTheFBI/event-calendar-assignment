from rest_framework import viewsets, status
from .models import Event
from .serializers import EventSerializer

from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return only the events created by the authenticated user
        return Event.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the user field to the current user when creating an event
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if username:
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists!'}, status=409)
    if username and password:
        user = User.objects.create_user(username=username, password=password)
        return Response({'message': 'User created'}, status=status.HTTP_201_CREATED)
    return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
