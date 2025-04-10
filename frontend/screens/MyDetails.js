import { View, Text, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Header } from 'react-native/Libraries/NewAppScreen';
import { auth, db, doc, setDoc  } from "../firebase/Config";

export default function MyDetails({ navigation }) {

  const [height, setHeight] = useState(0)
  const [weight, setWeight] = useState(0)
  const [age, setAge] = useState(0)
  const [gender, setGender] = useState("")


  const savePersonalInfo = async() => {
    try{

      const user = auth.currentUser
      if (!user) {
        alert('Käyttäjä ei ole kirjautunut sisään.')
        return
      }

      console.log(user)

    
      await setDoc(doc(db, "users", user.uid), {
        height: parseInt(height),
        weight: parseInt(weight),
        age: parseInt(age),
        gender: gender
      }, { merge: true }); // "merge: true" säilyttää vanhat tiedot, jos niitä on jo tallennettu
      alert('Tiedot tallennettu.')
      navigation.navigate('HomeScreen')

    } catch (error) {
      alert('Tietojen tallentaminen epäonnistui. ' + error.message)
      console.log('VIRHE: ' + error.message)

    }
    
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Omat tiedot</Text>

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
          itemStyle={{ color: '#666' }}
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