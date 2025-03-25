import { View, Text, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function MyDetails() {

const [height, setHeight] = useState(0)
const [weight, setWeight] = useState(0)
const [age, setAge] = useState(0)
const [gender, setGender] = useState("")

const savePersonalInfo =() => {

}

  return (
    <View style={styles.container}>
      <Text>Omat tiedot</Text>
      <Text>Pituus (cm)</Text>
      <TextInput
      value={height}
      onChangeText={setHeight}
      placeholder='Anna pituus'
      keyboardType="numeric"
      />
      <Text>Paino (kg)</Text>
      <TextInput
      value={weight}
      onChangeText={setWeight}
      placeholder='Anna paino'
      keyboardType="numeric"
      />
      <Text>Ikä</Text>
      <TextInput
      value={age}
      onChangeText={setAge}
      placeholder='Anna ikä'
      keyboardType="numeric"
      />
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    width: 200,
    marginVertical: 10,
  },
  picker: {
    width: '105%',
    borderRadius:50
  },
});