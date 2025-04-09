import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import 'expo-dev-client';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🔹 Lisätty

GoogleSignin.configure({
  webClientId: '97763493955-1c1ghhom38h5bteejv8j6dfplcllcl7l.apps.googleusercontent.com',
});

export const onGoogleButtonPress = async () => {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const signInResult = await GoogleSignin.signIn();

  let idToken = signInResult.data?.idToken || signInResult.idToken;
  if (!idToken) throw new Error('No ID token found');

  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  const userSignIn = auth().signInWithCredential(googleCredential);
  userSignIn.then(async (user) => {
    console.log(user);

    // 🔹 Tallennetaan käyttäjätiedot AsyncStorageen
    await AsyncStorage.setItem('authMethod', 'google');
    await AsyncStorage.setItem('userEmail', user.user.email || '');
    await AsyncStorage.setItem('userName', user.user.displayName || '');
  }).catch((error) => {
    console.log(error);
  });
};
