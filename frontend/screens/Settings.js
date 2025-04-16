import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebase/Config'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Settings() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Poistetaan käyttäjän tiedot 
      await AsyncStorage.removeItem('userToken');
      
      // Kirjaudutaan ulos Firebase Authista
      await auth.signOut();

      // Vahvistetaan uloskirjautuminen ja siirretään kirjautumissivulle
      Alert.alert("Uloskirjautuminen onnistui", "Olet kirjautunut ulos.", [
        {
          text: "OK",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Signup' }],
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Uloskirjautuminen epäonnistui: ", error.message);
      Alert.alert("Virhe", "Uloskirjautuminen epäonnistui, yritä uudelleen.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Asetukset</Text>
      <Button title="Kirjaudu ulos" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
});
