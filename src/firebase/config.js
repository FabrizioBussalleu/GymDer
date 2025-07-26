// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBl8hK9_9VJqVeR7nZ-xdLAx_f5E_KmJJw",
  authDomain: "spesna-gymder-f9cee.firebaseapp.com",
  projectId: "spesna-gymder-f9cee",
  storageBucket: "spesna-gymder-f9cee.appspot.com",
  messagingSenderId: "71542593376",
  appId: "1:71542593376:web:a111ec30161f8087733005",
  measurementId: "G-CF8H3FG39L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
