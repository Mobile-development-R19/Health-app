import React, { useState, useEffect } from 'react';
import { View, Button, Text, ActivityIndicator } from 'react-native';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, signInWithCredential, GoogleAuthProvider, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import * as Google from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase Configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDvjtqd_dxNuf_l2Z9EczhHcGcMd4YSQdk',
  authDomain: 'signintest-8cacf.firebaseapp.com',
  projectId: 'signintest-8cacf',
  storageBucket: 'signintest-8cacf.appspot.com',
  messagingSenderId: '576453663774',
  appId: '576453663774-v9bmnfcqptgpprn3f3cj6pdirs3cmgui.apps.googleusercontent.com',
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default function App() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '576453663774-v9bmnfcqptgpprn3f3cj6pdirs3cmgui.apps.googleusercontent.com', // Your Google Web Client ID
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      setLoading(true);

      // Sign in to Firebase using the credential
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          setUser(userCredential.user);
          setLoading(false);
          setError(null); // Clear any previous errors
        })
        .catch((error) => {
          console.error(error.message);
          setError(error.message); // Set error if sign-in fails
          setLoading(false);
        });
    }
  }, [response]);

  // Log useful information for debugging
  useEffect(() => {
    console.log('Request:', request);
    console.log('Response:', response);
    console.log('User:', user);
    console.log('Error:', error);
  }, [request, response, user, error]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={{ color: 'red' }}>Error: {error}</Text> // Display any errors
      ) : user ? (
        <Text>Welcome, {user.displayName}</Text>
      ) : (
        <Button
          title="Sign In with Google"
          disabled={!request}
          onPress={() => promptAsync()}
        />
      )}
    </View>
  );
}
