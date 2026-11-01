from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from .models import Photo

class PhotoUploadAndSearchTests(TestCase):
    def test_upload_persistent_and_searchable(self):
        client = APIClient()
        img = SimpleUploadedFile('test.jpg', b'dummy', content_type='image/jpeg')
        response = client.post('/api/photos/', {
            'photo_name': 'Sunflower Horizon',
            'photo_url': 'https://example.com/sunflower',
            'photo_path': img,
            'category': 'general'
        })
        self.assertEqual(response.status_code, 201)

        photo = Photo.objects.get(photo_name='Sunflower Horizon')
        self.assertEqual(photo.photo_url, 'https://example.com/sunflower')
        self.assertTrue(photo.known)
        self.assertTrue(response.data['known'])

        # Search by photo name
        res_name = client.get('/api/photos/?search=Sunflower')
        self.assertEqual(len(res_name.data), 1)

        # Search by photo url
        res_url = client.get('/api/photos/?search=example.com/sunflower')
        self.assertEqual(len(res_url.data), 1)

    def test_filter_by_known(self):
        client = APIClient()
        img1 = SimpleUploadedFile('test1.jpg', b'dummy1', content_type='image/jpeg')
        img2 = SimpleUploadedFile('test2.jpg', b'dummy2', content_type='image/jpeg')
        Photo.objects.create(photo_name='Known Photo', photo_path=img1, photo_url='https://example.com/1', known=True)
        Photo.objects.create(photo_name='Unknown Photo', photo_path=img2, photo_url='https://example.com/2', known=False)

        res_known = client.get('/api/photos/?known=true')
        self.assertEqual(len(res_known.data), 1)
        self.assertEqual(res_known.data[0]['photo_name'], 'Known Photo')

        res_unknown = client.get('/api/photos/?known=false')
        self.assertEqual(len(res_unknown.data), 1)
        self.assertEqual(res_unknown.data[0]['photo_name'], 'Unknown Photo')

