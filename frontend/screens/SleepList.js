import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { auth, getFirestore, collection, doc, getDocs } from '../firebase/Config';

export default function SleepList() {
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
        const sorted = entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
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
      <Text style={styles.text}>🛏 Nukkumaan: {item.sleepTime}</Text>
      <Text style={styles.text}>⏰ Herätys: {item.wakeTime}</Text>
      <Text style={styles.text}>🕒 Unen kesto: {item.duration} h</Text>
      <Text style={styles.timestamp}>📅 {new Date(item.timestamp.seconds * 1000).toLocaleDateString()}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  entry: {
    backgroundColor: '#e0ffe0',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 5,
    color: '#555',
  }
});
