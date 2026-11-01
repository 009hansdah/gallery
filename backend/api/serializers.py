from rest_framework import serializers
from .models import Photo

class PhotoSerializer(serializers.ModelSerializer):
    known = serializers.BooleanField(default=True)

    class Meta:
        model = Photo
        fields = ['id', 'photo_name', 'photo_path', 'photo_url', 'category', 'known', 'created_at', 'updated_at']
