import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { getFirestore, collection, doc, getDocs } from 'firebase/firestore'; 
import { auth } from '../firebase/Config';

export default function SleepList({ navigation }) {
  const [sleepEntries, setSleepEntries] = useState([]);

  useEffect(() => {
    const fetchSleepData = async () => {
      const user = auth.currentUser;
      if (!user) {
        alert("Kirjaudu sisään nähdäksesi unidatan.");
        return;
      }

      try {
        const db = getFirestore();
        const sleepRef = collection(doc(db, "users", user.uid), "sleepData");
        const snapshot = await getDocs(sleepRef);
        const entries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Lajitellaan uusimmat ensin:
        const sorted = entries.sort((a, b) => new Date(b.timestamp.seconds * 1000) - new Date(a.timestamp.seconds * 1000));
        setSleepEntries(sorted);
      } catch (err) {
        console.error("Virhe haettaessa unidataa:", err.message);
        alert("Tietojen haku epäonnistui.");
      }
    };

    fetchSleepData();
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
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      
      {/* "Takaisin" painike asetettu alareunaan */}
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
    backgroundColor: '#f9f9f9',
    paddingBottom: 60, // Varmistaa, että painike ei mene FlatListin alle
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
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
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
