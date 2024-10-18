// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQLX6ZqSZcZQxsStpTce53ZkQ7fUxZbJo",
  authDomain: "hex-hacc-2024.firebaseapp.com",
  projectId: "hex-hacc-2024",
  storageBucket: "hex-hacc-2024.appspot.com",
  messagingSenderId: "480840397392",
  appId: "1:480840397392:web:06b5814b4cafe624e0d755",
  measurementId: "G-CCCY78X1DR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };