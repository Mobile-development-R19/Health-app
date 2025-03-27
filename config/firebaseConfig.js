import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyDI3bW6bhPxPTmPYiCgLC5sl2RVuobQA0Y",
    authDomain: "healthapp-454818.firebaseapp.com",
    projectId: "healthapp-454818",
    storageBucket: "healthapp-454818.firebasestorage.app",
    messagingSenderId: "264758485796",
    appId: "1:264758485796:web:734c01b0f2943945cec9b1"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
