import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { auth, signInWithEmailAndPassword } from "../firebase/Config";
import { onGoogleButtonPress } from "./GoogleLogin";
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🔹 Lisätty

export default function Login({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // 🔹 Tallennetaan kirjautumistapa ja käyttäjätiedot AsyncStorageen
      await AsyncStorage.setItem('authMethod', 'email');
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userName', ''); // Ei nimeä sähköpostikirjautumisessa

      alert('Kirjautuminen onnistui!')
      navigation.navigate('MyDetails');
    } catch (error) {
      alert('Kirjautuminen epäonnistui. ' + error.message);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="Sähköposti"
        value={email} 
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput 
        placeholder="Salasana"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title='Kirjaudu sisään' onPress={handleLogin} />

      <View style={{ marginVertical: 10 }} />

      <Button
        title="Sign in with Google"
        onPress={async () => {
          try {
            await onGoogleButtonPress(); // hoitaa AsyncStorage tallennuksen
            console.log('Signed in with Google!');
            navigation.navigate('HomeScreen');
          } catch (error) {
            console.error('Error during Google Sign-In:', error);
          }
        }}
      />

      <Text onPress={() => navigation.navigate('Signup')} style={styles.link}>
        Ei vielä tiliä? Rekisteröidy
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10
  },
  link: {
    marginTop: 10,
    color: 'blue',
    textAlign: 'center'
  }
});
