
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_4YXikp74u_BkvDFIytLikhSE4RrMMiw",
  authDomain: "mymella.firebaseapp.com",
  projectId: "mymella",
  storageBucket: "mymella.firebasestorage.app", 
  messagingSenderId: "946371340882",
  appId: "1:946371340882:web:b7ad8246347fff1aa8cd8b",
  measurementId: "G-MEM0TYY3BL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
