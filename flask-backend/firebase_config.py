# flask-backend/firebase_config.py
import firebase_admin
from firebase_admin import credentials, db

# Path to your Firebase service account key JSON file
cred = credentials.Certificate("./firebase-adminsdk.json")

# Initialize the Firebase app with your Realtime Database URL
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://hex-hacc-2024-default-rtdb.firebaseio.com/',
})
