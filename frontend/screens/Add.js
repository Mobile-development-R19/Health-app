import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { auth, getFirestore, doc, collection, addDoc } from '../firebase/Config';

const Add = ({ navigation }) => {
  const { colors } = useTheme();
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const handleSave = async () => {
    if (!activity || !duration) {
      alert('Täytä kaikki kentät ennen tallennusta.');
      return;
    }

    if (isNaN(duration) || parseInt(duration) <= 0) {  //Varmista että treeniaika on positiivinen luku
      alert('Anna kelvollinen treeniaika (minuutteina).'); 
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Kirjaudu ensin sisään.');
        return;
      }

      const db = getFirestore();
      const activityCollection = collection(doc(db, 'users', user.uid), 'activities');

       // Tallenna aktiviteetti Firestoreen
       await addDoc(activityCollection, {
        activity,
        duration: parseInt(duration),
        date: date.toISOString(),
      });

      alert('Aktiviteetti tallennettu onnistuneesti!');
      navigation.goBack();
    } catch (error) {
      console.error('Virhe tallennettaessa aktiviteettia:', error);
      alert('Virhe tallennettaessa aktiviteettia. Yritä uudelleen.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.onPrimary }]}>Kirjaa aktiivisuutesi</Text>
      </View>

      {/* Aktiviteetti */}
      <TextInput
        label="Aktiviteetti"
        value={activity}
        onChangeText={setActivity}
        mode="outlined"
        style={styles.input}
        placeholder="Esim: Juoksu, Pyöräily"
        placeholderTextColor={colors.placeholder}
      />

      {/* Treeniaika */}
      <TextInput
        label="Aika (minuutteina)"
        value={duration}
        onChangeText={setDuration}
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
        placeholder="Esim: 30"
        placeholderTextColor={colors.placeholder}
      />

      {/* Päivämäärä */}
      <Button
        mode="outlined"
        onPress={showDatePicker}
        style={styles.dateButton}
        textColor={colors.primary}
      >
        {`Date: ${date.toLocaleDateString()}`}
      </Button>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
        buttonColor={colors.primary}
        textColor={colors.onPrimary}
      >
        Save
      </Button>

      <Button
        mode="contained"
        buttonColor={colors.tertiary}
        textColor={colors.onTertiary}
        onPress={() => navigation.goBack()}
        style={styles.saveButton}
      >
        Cancel
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  titleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  dateButton: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 8,
  },
});

export default Add;