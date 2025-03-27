import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from "./config/firebaseConfig.js"

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [user, setUser] = useState(null);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "1079895983608-u4qha7kfb2suc2jd3q2nniattjs46far.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@samulimv/toimiiko",
    useProxy: true, // Käyttää oikeaa URI:a Expon kanssa!!!!!!!!!
  });

  useEffect(() => {
    const handleSignIn = async () => {
      if (response?.type === 'success') {
        try {
          const { id_token } = response.params;
          const credential = GoogleAuthProvider.credential(id_token);
          const userCredential = await signInWithCredential(auth, credential);
          setUser(userCredential.user);
        } catch (error) {
          console.error('Firebase sign-in error', error);
          Alert.alert('Authentication Error', 'There was an error signing in with Google. Please try again.');
        }
      } else if (response?.type === 'error') {
        Alert.alert('Authentication Error', 'An error occurred during the authentication process. Please try again.');
      }
    };

    handleSignIn();
  }, [response]);

  return (
    <View style={styles.container}>
      {!user ? (
        <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Welcome, {user.displayName}!</Text>
          <TouchableOpacity style={styles.button} onPress={() => setUser(null)}>
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  userInfo: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    borderWidth: 2,
    borderColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  buttonText: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },
});



