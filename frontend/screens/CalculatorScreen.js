import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase/Config';

export default function CalculatorScreen() {
  const [age, setAge] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('sedentary');
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [calories, setCalories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bmrValue, setBmrValue] = useState(null);


  // Hae tiedot Firestoresta
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert('Virhe', 'Käyttäjä ei ole kirjautunut sisään.');
          setLoading(false);
          return;
        }

        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setAge(data.age || 0);
          setHeight(data.height || 0);
          setWeight(data.weight || 0);
          setGender(data.gender || '');
        } else {
          Alert.alert('Virhe', 'Käyttäjän tietoja ei löydy. Syötä tiedot ensin Omat tiedot -sivulla.');
        }
      } catch (error) {
        Alert.alert('Virhe', 'Tietojen haku epäonnistui: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const calculateResults = () => {
    if (!age || !height || !weight || !gender) {
      Alert.alert('Virhe', 'Kaikki tiedot eivät ole saatavilla. Tarkista omat tiedot.');
      return;
    }

    const heightInCm = parseFloat(height);
    const weightInKg = parseFloat(weight);
    const ageNum = parseInt(age);

    if (heightInCm <= 0 || weightInKg <= 0 || ageNum <= 0) {
      Alert.alert('Virhe', 'Anna kelvolliset arvot.');
      return;
    }

    // BMI-laskenta
    const heightInMeters = heightInCm / 100;
    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    setBmi(bmiValue.toFixed(1));

    let category = '';
    if (bmiValue < 18.5) {
      category = 'Alipaino';
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      category = 'Normaalipaino';
    } else if (bmiValue >= 25 && bmiValue < 30) {
      category = 'Ylipaino';
    } else {
      category = 'Merkittävä ylipaino';
    }
    setBmiCategory(category);

    // Kalorilaskenta (Harris-Benedict)
    let bmr;
    if (gender === 'male') {
      bmr = 66.5 + 13.75 * weightInKg + 5.003 * heightInCm - 6.75 * ageNum;
    } else {
      bmr = 655.1 + 9.563 * weightInKg + 1.850 * heightInCm - 4.676 * ageNum;
    }
    setBmrValue(bmr);
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };
    const totalCalories = bmr * activityMultipliers[activityLevel];
    setCalories(Math.round(totalCalories));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Ladataan tietoja...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>BMI- ja Kalorilaskuri</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Ikä: {age} vuotta</Text>
          <Text style={styles.label}>Pituus: {height} cm</Text>
          <Text style={styles.label}>Paino: {weight} kg</Text>
          <Text style={styles.label}>
            Sukupuoli: {gender === 'male' ? 'Mies' : gender === 'female' ? 'Nainen' : 'Ei määritelty'}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Aktiivisuustaso:</Text>
          <Picker
            selectedValue={activityLevel}
            style={styles.picker}
            onValueChange={(itemValue) => setActivityLevel(itemValue)}
          >
            <Picker.Item label="Vähän liikuntaa" value="sedentary" />
            <Picker.Item label="Kevyt liikunta 1-2 krt/vko" value="light" />
            <Picker.Item label="Kohtuullinen liikunta 2-3 krt/vko" value="moderate" />
            <Picker.Item label="Aktiivinen liikunta 4-5 krt/vko" value="active" />
            <Picker.Item label="Erittäin aktiivinen 6-7 krt/vko" value="veryActive" />
          </Picker>
        </View>

        <Button title="Laske tulokset" onPress={calculateResults} color="#007AFF" />

        {(bmi || calories || bmrValue) && (
          <View style={styles.resultContainer}>
            {bmi && (
              <>
                <Text style={styles.resultText}>BMI: {bmi}</Text>
                <Text style={styles.resultText}>Kategoria: {bmiCategory}</Text>
              </>
            )}
            {calories && (
              <Text style={styles.resultText}>
                Päivittäinen kaloritarve: {calories} kcal
              </Text>
            )}
            {bmrValue && (
              <Text style={styles.resultText}>
                Perusaineenvaihdunta (BMR): {Math.round(bmrValue)} kcal
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
  },
});