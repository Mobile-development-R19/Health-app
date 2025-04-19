import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getFirestore,
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc
} from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use initializeAuth to set AsyncStorage as persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const database = getDatabase(app);

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
  setDoc,
  getDoc,
  getDocs,
  updateDoc
};
