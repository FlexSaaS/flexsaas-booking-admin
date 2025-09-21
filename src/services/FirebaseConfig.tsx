// FirebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase configuration object.
 * Replace these values with your own Firebase project credentials.
 */
const firebaseConfig = {
  apiKey: "AIzaSyDQA3zEsJjjPV0onoA05VjwfHMg-WiqqFc",
  authDomain: "calendar-app-7a2ff.firebaseapp.com",
  projectId: "calendar-app-7a2ff",
  storageBucket: "calendar-app-7a2ff.firebasestorage.app",
  messagingSenderId: "832310558267",
  appId: "1:832310558267:web:6e74e2b032826b3a77661e",
  measurementId: "G-J3VXDYFQSD",
};

/**
 * Initialize Firebase app
 */
const app = initializeApp(firebaseConfig);

/**
 * Firestore database instance
 */
export const db = getFirestore(app);
export const auth = getAuth(app);
