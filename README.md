Code Credits:
- Aryan Badkul, @Abdiitb
- Khushi Yadav, @KhushiYadav18


## Steps to run the code:
1. Run the backend using:
   ```
   cd YB-pdf-backend-main
   ```
   ```
   python manage.py runserver
   {if it doesnt work run this commands-
   py -3.11 -m venv venv
   venv\Scripts\activate
   pip install Django
   pip install django-cors-headers
   pip install pillow
   pip install djangorestframework
   pip install google-auth google-auth-oauthlib google-api-python-client
   python manage.py runserver
   }
   ```
2. Run the frontend using:
   ```
   cd YB-pdf-frontend-main
   ```
   ```
   npm install (use only when the repo is cloned for the first time)
   ```
   ```
   npm run start
   ```
3. Isse dashboard run hojaayega `localhost:3000`, then click render btn 
4. Iske baad inspect karke networks tab mein dekhna upload status ke liye agar kuch der mein uploaded successfully aajaye(status 200) toh upload hoagaya, 

6. csv waali file 'YB-pdf-backend-main/physicalYbImage/data/yearbooks-ids_2026.csv' isme sari chije update krna jo doc me maintain kr rahe hai, dashboard mein agar koi id mein duplicates dikhe to is waali file mein update kar dena dashboard mein automatically update ho jaayega.
7.add the path of pdf of personalised snapshots to externalPdfPaths in merger.jsx.If kisi ki personal snapshots ni hai to , set externalPdfPaths back to [].

Hope Isse chal jaaye sabke mein 😊! 
"# yb-pdf-final" 
