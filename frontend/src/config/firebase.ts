import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Tejas's Firebase configuration for CareerPilot AI
export const firebaseConfig = {
  apiKey: "AIzaSyCqWGgWPTP6s4eA9MICLpZCwK5tcT65aWs",
  authDomain: "careerpilot-c500b.firebaseapp.com",
  projectId: "careerpilot-c500b",
  storageBucket: "careerpilot-c500b.firebasestorage.app",
  messagingSenderId: "81463506481",
  appId: "1:81463506481:web:8f252aeb37ffb28a23c710",
  measurementId: "G-KX8W7KN2NC"
};

// Initialize Firebase once
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
