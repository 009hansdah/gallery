from django.db import models

class Photo(models.Model):
    photo_name = models.CharField(max_length=255)
    photo_path = models.FileField(upload_to='photos/')
    photo_url = models.TextField()

    CATEGORY_CHOICES = (
        ('general', 'General'),
        ('santhal', 'Santhal'),
    )
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.photo_name
