import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth } from "../firebase/Config";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"; // Oikeat tuonnit

export default function MyDetails({ navigation }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Haetaan tiedot käyttäjältä ja täytetään kentät
  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setUserName(user.displayName || "Nimi ei saatavilla");  // Käyttäjän nimi
      setUserEmail(user.email || "Sähköposti ei saatavilla"); // Käyttäjän sähköposti

      try {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          const data = userDoc.data();
          setHeight(data.height?.toString() || "");
          setWeight(data.weight?.toString() || "");
          setAge(data.age?.toString() || "");
          setGender(data.gender || "");
        }
      } catch (error) {
        console.error("Virhe haettaessa tietoja:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const savePersonalInfo = async () => {
    try {
      const user = auth.currentUser;
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
      navigation.navigate('HomeScreen'); // Siirretään käyttäjä HomeScreeniin
    } catch (error) {
      alert('Tietojen tallentaminen epäonnistui. ' + error.message);
      console.log('VIRHE: ' + error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Ladataan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Omat tiedot</Text>

      {/* Näytetään käyttäjän nimi ja sähköposti */}
      <Text>Käyttäjän nimi: {userName}</Text>
      <Text>Käyttäjän sähköposti: {userEmail}</Text>

      <Text>Pituus (cm)</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={height}
          onChangeText={setHeight}
          placeholder='Anna pituus'
          placeholderTextColor="#666"
          keyboardType="numeric"
          returnKeyType='done'
          style={styles.input}
        />
      </View>

      <Text>Paino (kg)</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={weight}
          onChangeText={setWeight}
          placeholder='Anna paino'
          placeholderTextColor="#666"
          keyboardType="numeric"
          returnKeyType='done'
          style={styles.input}
        />
      </View>

      <Text>Ikä</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={age}
          onChangeText={setAge}
          placeholder='Anna ikä'
          placeholderTextColor="#666"
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

      <Button title='Tallenna' onPress={savePersonalInfo} />
    </View>
  );
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
