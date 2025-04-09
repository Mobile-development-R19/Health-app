// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, query, onSnapshot, deleteDoc, doc, setDoc } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB17tM7VnPWMel5HdVfo4B85lv-GrR7YmI',
  authDomain: 'sports-app-c21d2.firebaseapp.com',
  projectId: 'sports-app-c21d2',
  storageBucket: 'sports-app-c21d2.firebasestorage.app',
  messagingSenderId: '97763493955',
  appId: '1:97763493955:web:c458b43ad7dbad37e16cf6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const database = getDatabase(app)

export {
    auth, 
    database,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    getFirestore,
    collection,
    addDoc,
    query,
    onSnapshot,
    deleteDoc,
    doc,
    setDoc
}
