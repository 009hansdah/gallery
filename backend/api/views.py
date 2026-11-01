from rest_framework import viewsets, filters
from .models import Photo
from .serializers import PhotoSerializer

class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all().order_by('-created_at')
    serializer_class = PhotoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['photo_name', 'photo_url']

    def get_queryset(self):
        queryset = super().get_queryset()
        known = self.request.query_params.get('known')
        if known is not None:
            if known.lower() in ['true', '1']:
                queryset = queryset.filter(known=True)
            elif known.lower() in ['false', '0']:
                queryset = queryset.filter(known=False)
        return queryset

