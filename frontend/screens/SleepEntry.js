import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { getFirestore, collection, doc, addDoc, Timestamp } from 'firebase/firestore';
import { auth } from '../firebase/Config';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SleepEntry({ navigation }) {
  const [sleepDate, setSleepDate] = useState(new Date());
  const [wakeDate, setWakeDate] = useState(new Date());
  const [sleepTime, setSleepTime] = useState(new Date());
  const [wakeTime, setWakeTime] = useState(new Date());
  const [showSleepDatePicker, setShowSleepDatePicker] = useState(false);
  const [showWakeDatePicker, setShowWakeDatePicker] = useState(false);
  const [showSleepTimePicker, setShowSleepTimePicker] = useState(false);
  const [showWakeTimePicker, setShowWakeTimePicker] = useState(false);

  const { colors } = useTheme();

  // Muotoilee päivämäärän ISO-muotoon (esim. "2025-04-14")
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Muotoilee kellonajan "hh:mm" muotoon
  const formatTime = (date) => {
    return date.toTimeString().slice(0, 5);
  };

  // Laskee unen keston kahden ajan (nukkumaanmenon ja heräämisen) välillä
  const calculateDuration = (sleep, wake) => {
    const sleepDate = new Date(`1970-01-01T${formatTime(sleep)}:00`);
    const wakeDate = new Date(`1970-01-01T${formatTime(wake)}:00`);
    if (wakeDate < sleepDate) {
      wakeDate.setDate(wakeDate.getDate() + 1); // Yli keskiyön menevä aika
    }
    const diff = (wakeDate - sleepDate) / (1000 * 60 * 60);
    return diff.toFixed(1); // Palauttaa kellonajan eron tunteina
  };

  // Tallentaa unen tiedot Firebase-tietokantaan
  const saveSleepData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Kirjaudu sisään tallentaaksesi unidataa.");
        return;
      }

      const duration = calculateDuration(sleepTime, wakeTime);
      const db = getFirestore();
      const sleepCollection = collection(doc(db, 'users', user.uid), 'sleepData');

      await addDoc(sleepCollection, {
        sleepTime: formatTime(sleepTime),
        wakeTime: formatTime(wakeTime),
        duration,
        sleepDate: formatDate(sleepDate),
        wakeDate: formatDate(wakeDate),
        timestamp: Timestamp.now()
      });

      alert('Uni tallennettu onnistuneesti!');
    } catch (error) {
      console.error('Tallennusvirhe:', error.message);
      alert('Virhe unidatan tallennuksessa.');
    }
  };

  // Näyttää tai piilottaa päivämäärä- ja kellonaikavalitsimia
  const toggleDatePicker = (pickerType) => {
    switch (pickerType) {
      case 'sleepDate':
        setShowSleepDatePicker(!showSleepDatePicker);
        setShowWakeDatePicker(false);
        setShowSleepTimePicker(false);
        setShowWakeTimePicker(false);
        break;
      case 'wakeDate':
        setShowWakeDatePicker(!showWakeDatePicker);
        setShowSleepDatePicker(false);
        setShowSleepTimePicker(false);
        setShowWakeTimePicker(false);
        break;
      case 'sleepTime':
        setShowSleepTimePicker(!showSleepTimePicker);
        setShowSleepDatePicker(false);
        setShowWakeDatePicker(false);
        setShowWakeTimePicker(false);
        break;
      case 'wakeTime':
        setShowWakeTimePicker(!showWakeTimePicker);
        setShowSleepDatePicker(false);
        setShowWakeDatePicker(false);
        setShowSleepTimePicker(false);
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lisää uni</Text>

      {/* Sleep Date Picker */}
      <Pressable onPress={() => toggleDatePicker('sleepDate')} style={styles.timeField}>
        <Text style={styles.timeText}>📅 Nukkumaanmeno: {formatDate(sleepDate)}</Text>
      </Pressable>
      {showSleepDatePicker && (
        <DateTimePicker
          value={sleepDate}
          mode="date"
          is24Hour={true}
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowSleepDatePicker(Platform.OS === 'ios');
            if (selectedDate) setSleepDate(selectedDate);
          }}
        />
      )}

      {/* Sleep Time Picker */}
      <Pressable onPress={() => toggleDatePicker('sleepTime')} style={styles.timeField}>
        <Text style={styles.timeText}>🛏 Nukkumaanmeno: {formatTime(sleepTime)}</Text>
      </Pressable>
      {showSleepTimePicker && (
        <DateTimePicker
          value={sleepTime}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowSleepTimePicker(Platform.OS === 'ios');
            if (selectedDate) setSleepTime(selectedDate);
          }}
        />
      )}

      {/* Wake Date Picker */}
      <Pressable onPress={() => toggleDatePicker('wakeDate')} style={styles.timeField}>
        <Text style={styles.timeText}>📅 Herääminen: {formatDate(wakeDate)}</Text>
      </Pressable>
      {showWakeDatePicker && (
        <DateTimePicker
          value={wakeDate}
          mode="date"
          is24Hour={true}
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowWakeDatePicker(Platform.OS === 'ios');
            if (selectedDate) setWakeDate(selectedDate);
          }}
        />
      )}

      {/* Wake Time Picker */}
      <Pressable onPress={() => toggleDatePicker('wakeTime')} style={styles.timeField}>
        <Text style={styles.timeText}>⏰ Herääminen: {formatTime(wakeTime)}</Text>
      </Pressable>
      {showWakeTimePicker && (
        <DateTimePicker
          value={wakeTime}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowWakeTimePicker(Platform.OS === 'ios');
            if (selectedDate) setWakeTime(selectedDate);
          }}
        />
      )}
      <View style={[styles.buttonWrapper, { backgroundColor: colors.primary }]}>
        <Button mode="contained" onPress={saveSleepData} color={colors.onPrimary}>
          Tallenna uni
        </Button>
      </View>
      <View style={[styles.buttonWrapper, { backgroundColor: colors.primary }]}>
        <Button mode="contained" onPress={() => navigation.navigate('SleepList')} color={colors.onPrimary}>
          Näytä kaikki unet
        </Button>
      </View>
      <View style={[styles.buttonWrapper, { backgroundColor: colors.primary }]}>
        <Button mode="contained" onPress={() => navigation.goBack()} color={colors.onPrimary}>
          Takaisin
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  timeField: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
  },
  timeText: {
    fontSize: 18,
    color: '#333',
  },
  buttonWrapper: {
    marginVertical: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },  
});
