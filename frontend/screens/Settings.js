import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

const Settings = ({ navigation }) => {

  const handleLogout = async () => {
    try {
      await auth().signOut(); // Firebase uloskirjautuminen
      await AsyncStorage.clear(); // Poistaa tallennetun kirjautumistavan ja tiedot

      Alert.alert('Uloskirjauduttu', 'Sinut on kirjattu ulos.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }]
      });
    } catch (error) {
      console.error('Uloskirjautumisvirhe:', error);
      Alert.alert('Virhe', 'Uloskirjautuminen epäonnistui.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Kirjaudu ulos" onPress={handleLogout} color="#d11a2a" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});

export default Settings;
