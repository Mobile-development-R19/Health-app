import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getFirestore, collection, doc, addDoc, Timestamp } from 'firebase/firestore';
import { auth } from '../firebase/Config';

export default function SleepEntry() {
  const [sleepTime, setSleepTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');

  const calculateDuration = (sleep, wake) => {
    const sleepDate = new Date(`1970-01-01T${sleep}:00`);
    const wakeDate = new Date(`1970-01-01T${wake}:00`);
    if (wakeDate < sleepDate) {
      wakeDate.setDate(wakeDate.getDate() + 1); // yli keskiyön
    }
    const diff = (wakeDate - sleepDate) / (1000 * 60 * 60);
    return diff.toFixed(1);
  };

  const saveSleepData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Kirjaudu sisään tallentaaksesi unidataa.");
        return;
      }

      const duration = calculateDuration(sleepTime, wakeTime);

      const db = getFirestore();
      const userDoc = doc(db, 'users', user.uid);
      const sleepCollection = collection(userDoc, 'sleepData');

      await addDoc(sleepCollection, {
        sleepTime,
        wakeTime,
        duration,
        timestamp: Timestamp.now()
      });

      alert('Uni tallennettu onnistuneesti!');
      setSleepTime('');
      setWakeTime('');
    } catch (error) {
      console.error('Tallennusvirhe:', error.message);
      alert('Virhe unidatan tallennuksessa.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lisää uni</Text>

      <TextInput
        placeholder="Nukkumaanmeno (esim. 22:30)"
        value={sleepTime}
        onChangeText={setSleepTime}
        style={styles.input}
      />

      <TextInput
        placeholder="Herääminen (esim. 07:00)"
        value={wakeTime}
        onChangeText={setWakeTime}
        style={styles.input}
      />

      <Button title="Tallenna uni" onPress={saveSleepData} />

          {/* Lisää navigointinappi */}
          <Button title="Näytä kaikki unet" onPress={() => navigation.navigate('SleepList')} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#eef',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
