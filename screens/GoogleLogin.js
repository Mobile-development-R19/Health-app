import { View, Text } from 'react-native'
import React from 'react'
import auth from '@react-native-firebase/auth';
import { useState } from 'react';
import 'expo-dev-client';
import { GoogleSignin, GoogleSigninButton  } from '@react-native-google-signin/google-signin';

export default function GoogleLogin({ navigation }) {
  const [isInProgress, setIsInProgress] = useState(false);

    GoogleSignin.configure({
        webClientId: '97763493955-1c1ghhom38h5bteejv8j6dfplcllcl7l.apps.googleusercontent.com',
      });

       const onGoogleButtonPress = async () => {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token
        const signInResult = await GoogleSignin.signIn();
  
        idToken = signInResult.data?.idToken;
        if (!idToken) {
          // if you are using older versions of google-signin, try old style result
          idToken = signInResult.idToken;
        }
        if (!idToken) {
          throw new Error('No ID token found');
        }
      
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(signInResult.data.idToken);

        const userSignIn = auth().signInWithCredential(googleCredential);
        userSignIn
        .then((user) => {
            console.log(user);
            navigation.navigate('HomeScreen');
        })
        .catch((error) => {
            console.log(error);
        })
      }

      return (
        <GoogleSigninButton
          style={{ marginTop: 20, alignSelf: 'center' }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={onGoogleButtonPress}
          disabled={isInProgress}
        />
      );
    }