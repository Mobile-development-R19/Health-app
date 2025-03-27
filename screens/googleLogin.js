import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from "../config/firebaseConfig"; // Ensure Firebase config is correct

WebBrowser.maybeCompleteAuthSession();  // Ensure to complete the auth session

export default function GoogleLogin({ navigation }) {
  const [user, setUser] = useState(null);

  // Use correct redirectUri and clientId
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "97763493955-1c1ghhom38h5bteejv8j6dfplcllcl7l.apps.googleusercontent.com", // Use your actual client ID
    redirectUri: "https://auth.expo.io/@samulimv/Health_app", // Use your actual redirect URI for Expo Go
    useProxy: true,  // Ensure useProxy is true for Expo Go
  });

  // Handling the sign-in process
  useEffect(() => {
    const handleSignIn = async () => {
      if (response?.type === 'success') {
        try {
          const { id_token } = response.params;
          const credential = GoogleAuthProvider.credential(id_token);
          const userCredential = await signInWithCredential(auth, credential);
          setUser(userCredential.user);
          navigation.replace("HomeScreen"); // Navigate after successful login
        } catch (error) {
          console.error('Firebase sign-in error', error);
          Alert.alert('Authentication Error', 'There was an error signing in with Google. Please try again.');
        }
      } else if (response?.type === 'error') {
        console.error('Authentication error', response.error);  // Log the actual error
        Alert.alert('Authentication Error', 'An error occurred during the authentication process. Please try again.');
      }
    };

    handleSignIn();
  }, [response]); // Re-run the effect when the response changes

  return (
    <View style={styles.container}>
      {!user ? (
        <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Welcome, {user.displayName}!</Text>
          <TouchableOpacity style={styles.button} onPress={() => {
            // Sign out logic
            setUser(null);
            auth.signOut(); // Ensure Firebase sign out is done
          }}>
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
