import auth from '@react-native-firebase/auth';
import { View, Text, TextInput, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, doc, setDoc } from "../firebase/Config";
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🔹 Lisätty

export default function MyDetails({ navigation }) {
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // 🔹 Haetaan tiedot AsyncStoragesta
        const method = await AsyncStorage.getItem('authMethod');
        const email = await AsyncStorage.getItem('userEmail');
        const name = await AsyncStorage.getItem('userName');

        if (method === 'google') {
          setUserEmail(email || 'Ei sähköpostia');
          setUserName(name || 'Ei nimeä');
        } else {
          setUserEmail(email || 'Ei sähköpostia');
          setUserName('Sähköpostikäyttäjä');
        }
      } catch (error) {
        console.log('Käyttäjätietojen haku epäonnistui:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const savePersonalInfo = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        alert('Käyttäjä ei ole kirjautunut sisään.');
        return;
      }

      const db = getFirestore();
      await setDoc(doc(db, "users", user.uid), {
        height: parseInt(height),
        weight: parseInt(weight),
        age: parseInt(age),
        gender: gender
      }, { merge: true });

      alert('Tiedot tallennettu.');
      navigation.navigate('HomeScreen');
    } catch (error) {
      alert('Tietojen tallentaminen epäonnistui. ' + error.message);
      console.log('VIRHE: ' + error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Omat tiedot</Text>

      {/* 🔹 Näytetään AsyncStoragesta haetut käyttäjätiedot */}
      <Text style={styles.info}>Nimi: {userName}</Text>
      <Text style={styles.info}>Sähköposti: {userEmail}</Text>

      <Text>Pituus (cm)</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={height.toString()}
          onChangeText={setHeight}
          placeholder='Anna pituus'
          keyboardType="numeric"
          returnKeyType='done'
          style={styles.input}
        />
      </View>

      <Text>Paino (kg)</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={weight.toString()}
          onChangeText={setWeight}
          placeholder='Anna paino'
          keyboardType="numeric"
          returnKeyType='done'
          style={styles.input}
        />
      </View>

      <Text>Ikä</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={age.toString()}
          onChangeText={setAge}
          placeholder='Anna ikä'
          keyboardType="numeric"
          returnKeyType='done'
          style={styles.input}
        />
      </View>

      <Text>Sukupuoli</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Valitse sukupuoli" value="" />
          <Picker.Item label="Mies" value="male" />
          <Picker.Item label="Nainen" value="female" />
        </Picker>
      </View>

      <Button
        title='Tallenna'
        onPress={savePersonalInfo}
      />
      <View style={{ marginVertical: 10 }} />

      <Button
        title="Go Back"
        onPress={() => navigation.navigate('HomeScreen')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    width: 110,
    padding: 5,
    marginVertical: 5,
  },
  input: {
    width: '100%',
    height: 40,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    width: 210,
    marginVertical: 10,
  },
  picker: {
    width: '100%',
  },
});
