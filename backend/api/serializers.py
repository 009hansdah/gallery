from rest_framework import serializers
from .models import Photo

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ['id', 'photo_name', 'photo_path', 'photo_url', 'category', 'created_at', 'updated_at']
