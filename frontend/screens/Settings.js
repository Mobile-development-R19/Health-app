import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Modal, TouchableOpacity } from 'react-native';
import { auth } from '../firebase/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { deleteUser } from 'firebase/auth';
import { getFirestore, doc, deleteDoc, setDoc } from 'firebase/firestore';

export default function Settings({ setIsDarkMode }) {
  const navigation = useNavigation();
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  // Kirjaudutaan ulos ja poistetaan token AsyncStoragesta
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await auth.signOut();

      Alert.alert('Uloskirjautuminen onnistui', 'Olet kirjautunut ulos.', [
        {
          text: 'OK',
          onPress: () => {
            // Resetoidaan navigointi kirjautumissivulle
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]);
    } catch (error) {
      console.error('Uloskirjautuminen epäonnistui: ', error.message);
      Alert.alert('Virhe', 'Uloskirjautuminen epäonnistui, yritä uudelleen.');
    }
  };

  // Kysytään vahvistus käyttäjätilin poistamisesta ja poistetaan tiedot
  const handleDeleteAccount = async () => {
    Alert.alert(
      'Vahvista tilin poisto',
      'Haluatko varmasti poistaa tilisi ja kaiken datasi pysyvästi?',
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: async () => {
            const user = auth.currentUser;
            if (!user) {
              alert('Käyttäjää ei ole kirjautunut sisään.');
              return;
            }

            try {
              const db = getFirestore();
              // Poistetaan käyttäjä tietokannasta
              await deleteDoc(doc(db, 'users', user.uid));
              await deleteUser(user);
              await AsyncStorage.removeItem('userToken');

              alert('Käyttäjä ja tiedot poistettu.');
              // Resetoidaan navigointi kirjautumissivulle
              navigation.reset({ index: 0, routes: [{ name: 'Signup' }] });
            } catch (error) {
              console.error('Virhe poistettaessa käyttäjää: ', error.message);
              alert('Poistaminen epäonnistui: ' + error.message);
            }
          },
        },
      ]
    );
  };

  // Vaihdetaan käyttäjän teema ja tallennetaan valinta Firestoreen
  const handleThemeChange = async (theme) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Käyttäjä ei ole kirjautunut sisään.');
        return;
      }

      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid);
      // Tallennetaan teema Firestoreen
      await setDoc(userDocRef, { theme }, { merge: true });

      // Päivitetään teema sovelluksessa
      setIsDarkMode(theme === 'dark');
      setThemeModalVisible(false);
    } catch (error) {
      console.error('Virhe tallennettaessa teemaa:', error);
      alert('Teeman tallennus epäonnistui.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Asetukset</Text>

      <TouchableOpacity style={styles.themeButton} onPress={() => setThemeModalVisible(true)}>
        <Text style={styles.themeButtonText}>🎨 Valitse teema</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cardButton} onPress={handleLogout}>
        <Text style={styles.cardButtonText}>🚪 Kirjaudu ulos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.cardButton, styles.deleteButton]} onPress={handleDeleteAccount}>
        <Text style={styles.cardButtonText}>🗑️ Poista tili ja tiedot</Text>
      </TouchableOpacity>

      {/* Teema Modal */}
      <Modal
        visible={themeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Valitse Teema</Text>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleThemeChange('light')}>
              <Text style={styles.optionText}>Vaalea</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleThemeChange('dark')}>
              <Text style={styles.optionText}>Tumma</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => setThemeModalVisible(false)}>
              <Text style={styles.optionText}>Peruuta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    borderRadius: 15, 
    padding: 16, 
    marginHorizontal: 20, 
    marginVertical: 40, 
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0, 
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#000000',
  },
  themeButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 25,
    width: '100%',
    alignItems: 'center',
  },
  themeButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: '#FFFFFF',
  },
  cardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    padding: 12,
    marginVertical: 8,
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
});
