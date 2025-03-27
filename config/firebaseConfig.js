import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB17tM7VnPWMel5HdVfo4B85lv-GrR7YmI",
  authDomain: "sports-app-c21d2.firebaseapp.com",
  projectId: "sports-app-c21d2",
  storageBucket: "sports-app-c21d2.firebasestorage.app",
  messagingSenderId: "97763493955",
  appId: "1:97763493955:web:c458b43ad7dbad37e16cf6"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
