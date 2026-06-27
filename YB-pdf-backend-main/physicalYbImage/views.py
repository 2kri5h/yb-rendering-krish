import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from PIL import Image, ImageChops
import requests
from io import BytesIO
import numpy as np
from concurrent.futures import ThreadPoolExecutor
from django.conf import settings
import os
from concurrent.futures import ThreadPoolExecutor
from django.http import JsonResponse
import requests 
from rest_framework import generics
from .models import idData
from .serializers import idDataSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
import csv
from django.shortcuts import render
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import base64
from googleapiclient.http import MediaIoBaseUpload
# class idDataCreateView(generics.CreateAPIView):
#     queryset = idData.objects.all()
#     serializer_class = idDataSerializer  

# @api_view(['POST'])
# def receive_data(request):
#     received_data = request.data
#     print(received_data)
#     idData.objects.create(
#         yearbookId=received_data.get('yearbookId'),
#         otherSelectedPeople=received_data.get('otherSelectedPeople'),
#     )    
#     # Process the received data
#     print("Received data:", received_data)
    
#     return Response({'status': 'success', 'message': 'Data received successfully'})

# @api_view(['GET'])
# def get_existing_data(request):
#     data = idData.objects.all()
#     serializer = idDataSerializer(data, many=True)
#     return Response(serializer.data)

# Replace with the path to your service account JSON
SERVICE_ACCOUNT_FILE = os.path.join(os.path.dirname(__file__), 'service_account', 'yb-pdf-rendering-229aa55bb9b3.json')  # Replace with the path to your service account JSON
SCOPES = ['https://www.googleapis.com/auth/drive.file']  # You can change the scope as needed
# Replace with the ID of the folder you want to upload the file to
FOLDER_ID = '1HuJRFvGPSzZv_WRI7uUlTVo2IzbDLgXM'
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES
)

@csrf_exempt
def upload_to_drive(request):
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        file_name = uploaded_file.name

        # Use Google Drive API to upload
        service = build('drive', 'v3', credentials=credentials)
        file_metadata = {
            'name': file_name,
            'parents': [FOLDER_ID],  # Upload into the target folder
        }

        media = MediaIoBaseUpload(uploaded_file.file, mimetype='application/pdf')
        uploaded = service.files().create(body=file_metadata, media_body=media, fields='id').execute()

        return JsonResponse({'message': 'Uploaded successfully', 'fileId': uploaded.get('id')})

    return JsonResponse({'error': 'Invalid request'}, status=400)

def fetch_data_from_csv(request):
    data = []
    file_path = os.path.join(os.path.dirname(__file__), 'data', 'yearbooks-ids_2026.csv')
    print(file_path)
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data.append(row)
    
    
    # print("Type of Data: ", type(data))
    return JsonResponse({'data': data})
    # return render(request, 'dashboard.html', context)

# Function to download image
def download_image(url):
    response = requests.get(url)
    if response.status_code == 200:
        return Image.open(BytesIO(response.content))
    return None

# Function to compare images using Mean Squared Error (MSE)
def compare_images(image1, image2, similarity_threshold=99.5):
    if image1.size != image2.size:
        return False

    image1 = image1.convert('L')  # Convert to grayscale
    image2 = image2.convert('L')  # Convert to grayscale

    image1_np = np.array(image1)
    image2_np = np.array(image2)

    mse = np.square(image1_np - image2_np).mean()
    similarity_percentage = 100.0 - (mse / float(image1_np.size)) * 100.0
    print("Similarity Percentage : ", similarity_percentage)
    return similarity_percentage >= similarity_threshold

# Function to resize image
def resize_image(image, max_size=100):
    if max(image.size) > max_size:
        aspect_ratio = float(image.size[0]) / float(image.size[1])
        new_width = max_size if aspect_ratio >= 1 else int(
            max_size * aspect_ratio)
        new_height = max_size if aspect_ratio <= 1 else int(
            max_size / aspect_ratio)
        image = image.resize((new_width, new_height), Image.LANCZOS)
    return image

def make_absolute_url(url):
    if not url:
        return ""
    if url.startswith("http://") or url.startswith("https://"):
        return url
    if not url.startswith("/"):
        return f"https://yearbook.sarc-iitb.org/{url}"
    return f"https://yearbook.sarc-iitb.org{url}"

# Main function to process posts
def process_post(post):
    print(post['id'])
    if not post['is_anonymous']:
        comparisonImageUrl = "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg"
        comparisonImage = resize_image(download_image(comparisonImageUrl))

        profile_img_src = post.get("written_by_profile", {}).get("profile_image")
        image_url = make_absolute_url(profile_img_src) if profile_img_src else comparisonImageUrl

        with ThreadPoolExecutor() as executor:
            future_image = executor.submit(download_image, image_url)

        downloaded = future_image.result()
        image = resize_image(downloaded) if downloaded else None

        if image and compare_images(comparisonImage, image):
            if 'written_by_profile' in post and post['written_by_profile']:
                post['written_by_profile']['profile_image'] = "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg"
        else:
            if 'written_by_profile' in post and post['written_by_profile']:
                post['written_by_profile']['profile_image'] = make_absolute_url(profile_img_src)

    return post

def process_profiles(profile):
    comparisonImageUrlProfile = "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg"
    comparisonImageProfile = resize_image(download_image(comparisonImageUrlProfile))
    
    comparisonImageUrl = "https://yearbook.sarc-iitb.org/api/Impression_Images/user_6/img4.png"
    comparisonImage = resize_image(download_image(comparisonImageUrl))

    image_url1 = make_absolute_url(profile.get("img1"))
    image_url2 = make_absolute_url(profile.get("img2"))
    image_url3 = make_absolute_url(profile.get("img3"))
    image_url4 = make_absolute_url(profile.get("img4"))
    profile_url = make_absolute_url(profile.get("profile_image"))

    with ThreadPoolExecutor() as executor:
        future_image1 = executor.submit(download_image, image_url1)
        future_image2 = executor.submit(download_image, image_url2)
        future_image3 = executor.submit(download_image, image_url3)
        future_image4 = executor.submit(download_image, image_url4)
        future_profile_img = executor.submit(download_image, profile_url)

    # Image 1
    res1 = future_image1.result()
    if res1:
        image1 = resize_image(res1)
        if compare_images(comparisonImage, image1):
            profile['img1'] = 'http://localhost:8000/media/desktop-wallpaper-iit-bombay.jpg'
        else:
            profile['img1'] = image_url1
    else:
        profile['img1'] = image_url1

    # Image 2
    res2 = future_image2.result()
    if res2:
        image2 = resize_image(res2)
        if compare_images(comparisonImage, image2):
            profile['img2'] = "https://akm-img-a-in.tosshub.com/businesstoday/images/story/202307/ezgif-sixteen_nine_649.jpg?size=948:533"
        else:
            profile['img2'] = image_url2
    else:
        profile['img2'] = image_url2

    # Image 3
    res3 = future_image3.result()
    if res3:
        image3 = resize_image(res3)
        if compare_images(comparisonImage, image3):
            profile['img3'] = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/IITB_Large_hall_in_lecture_hall_complex.JPG/1920px-IITB_Large_hall_in_lecture_hall_complex.JPG"
        else:
            profile['img3'] = image_url3
    else:
        profile['img3'] = image_url3

    # Image 4
    res4 = future_image4.result()
    if res4:
        image4 = resize_image(res4)
        if compare_images(comparisonImage, image4):
            profile['img4'] = "https://upload.wikimedia.org/wikipedia/commons/2/2e/IITBMainBuildingCROP.jpg"
        else:
            profile['img4'] = image_url4
    else:
        profile['img4'] = image_url4

    # Profile Image
    res_prof = future_profile_img.result()
    if res_prof:
        image_prof = resize_image(res_prof)
        if compare_images(comparisonImageProfile, image_prof):
            profile['profile_image'] = "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg"
        else:
            profile['profile_image'] = profile_url
    else:
        profile['profile_image'] = profile_url

    return profile

@csrf_exempt
def feed(request):
        data = json.loads(request.body)
        posts = data.get("posts")

        if posts:
            new_posts = [process_post(post) for post in posts]

            json_response = json.dumps(new_posts)
            print(json_response)
            return HttpResponse(json_response, content_type="application/json")

    # except requests.exceptions.RequestException as e:
        return HttpResponse('No posts received', status=400)


@csrf_exempt
def fetch_profile_by_id(request, user_id):
    """Proxy yearbook profile fetch server-side (avoids browser CORS)."""
    if request.method != "GET":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    auth = request.headers.get("Authorization", "")
    if not auth:
        return JsonResponse({"error": "Authorization header required"}, status=401)

    try:
        resp = requests.get(
            f"https://yearbook.sarc-iitb.org/api/authenticate/profile/{user_id}",
            headers={"Authorization": auth},
            timeout=(10, 90),
        )
        if resp.status_code != 200:
            return JsonResponse(
                {
                    "error": f"Yearbook API returned {resp.status_code}",
                    "detail": resp.text[:500],
                },
                status=resp.status_code,
            )

        profile = resp.json()
        processed = process_profiles(profile)
        return JsonResponse(processed)

    except requests.Timeout:
        return JsonResponse({"error": "Yearbook API timed out"}, status=504)
    except requests.RequestException as e:
        return JsonResponse({"error": str(e)}, status=502)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def profile(request):
    if request.method == 'POST':
        try:
            # Parse the JSON body
            data = json.loads(request.body)
            profiles = data.get("profiles")

            # Check if profiles exist and are in the correct format
            if profiles and isinstance(profiles, list):
                new_profiles = [process_profiles(profile) for profile in profiles]
                json_response = json.dumps(new_profiles)

                # Log or print the response for debugging
                print("Json Response in profile view", json_response)

                return HttpResponse(json_response, content_type="application/json")
            else:
                # Return an error if 'profiles' is missing or not a list
                error_message = json.dumps({"error": "Invalid 'profiles' data"})
                return HttpResponse(error_message, content_type="application/json", status=400)

        except json.JSONDecodeError:
            # Handle invalid JSON
            error_message = json.dumps({"error": "Invalid JSON format"})
            return HttpResponse(error_message, content_type="application/json", status=400)

        except Exception as e:
            # Handle any other unexpected errors
            error_message = json.dumps({"error": str(e)})
            return HttpResponse(error_message, content_type="application/json", status=500)

