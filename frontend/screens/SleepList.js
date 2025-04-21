import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native'; 
import { getFirestore, collection, doc, getDocs } from 'firebase/firestore'; // Firebase Firestore -kirjaston tuonti
import { auth } from '../firebase/Config'; // Firebase autentikointi

export default function SleepList({ navigation }) {
  const [sleepEntries, setSleepEntries] = useState([]); // Tila tallennettujen unidatan käsittelyyn

  useEffect(() => {
    // Hakee unidatan Firestoresta
    const fetchSleepData = async () => {
      const user = auth.currentUser;
      if (!user) {
        alert("Kirjaudu sisään nähdäksesi unidatan.");
        return;
      }

      try {
        const db = getFirestore(); // Firebase-tietokannan haku
        const sleepRef = collection(doc(db, "users", user.uid), "sleepData"); // Käyttäjän unidata
        const snapshot = await getDocs(sleepRef); // Hakee dokumentit
        const entries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Lajittelee uusin tieto ensimmäiseksi
        const sorted = entries.sort((a, b) => new Date(b.timestamp.seconds * 1000) - new Date(a.timestamp.seconds * 1000));
        setSleepEntries(sorted); // Päivittää unidatat listaksi
      } catch (err) {
        console.error("Virhe haettaessa unidataa:", err.message);
        alert("Tietojen haku epäonnistui.");
      }
    };

    fetchSleepData(); // Kutsuu datan hakemista
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.entry}>
      <Text style={styles.text}>🛏 Nukkumaan: {item.sleepTime} ({new Date(item.sleepDate).toLocaleDateString()})</Text>
      <Text style={styles.text}>⏰ Herätys: {item.wakeTime} ({new Date(item.wakeDate).toLocaleDateString()})</Text>
      <Text style={styles.text}>🕒 Unen kesto: {item.duration} h</Text>
      <Text style={styles.timestamp}>
        📅 Tallennettu: {new Date(item.timestamp.seconds * 1000).toLocaleDateString()} {new Date(item.timestamp.seconds * 1000).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tallennetut unet</Text>
      <FlatList
        data={sleepEntries}
        keyExtractor={(item) => item.id} // Avain arvona dokumentin id
        renderItem={renderItem} // Renderöi unikirjaukset
      />
      
      {/* "Takaisin" painike, joka vie takaisin */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.buttonText}>Takaisin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 60, // Varmistaa, että painike ei mene FlatListin alle
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  entry: {
    backgroundColor: '#e0ffe0',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 5,
    color: '#777',
  },
  backButton: {
    position: 'center',
    bottom: 20,
    padding: 15,
    marginTop: 25,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
