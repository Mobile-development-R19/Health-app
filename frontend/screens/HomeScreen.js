import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} />

      <View style={styles.mainButtons}>
        <Button 
          mode="contained" 
          buttonColor="green" 
          onPress={() => console.log('Askeleet')} 
          style={styles.button} 
          icon="walk"
        >
          Askeleet
        </Button>
        <Button 
          mode="contained" 
          buttonColor="green" 
          onPress={() => navigation.navigate('SleepEntry')} 
          style={styles.button} 
          icon="moon-waning-crescent"
        >
          Unen seuranta
        </Button>
        <Button 
          mode="contained" 
          buttonColor="green" 
          onPress={() => console.log('Liikunta ja treeni')} 
          style={styles.button} 
          icon="calendar"
        >
          Liikunta ja treenit
        </Button>
        <Button 
          mode="contained" 
          buttonColor="green" 
          onPress={() => console.log('Laskurit')} 
          style={styles.button} 
          icon="calculator"
        >
          Laskurit (BMI, kalorit jne.)
        </Button>
        <Button 
          mode="contained" 
          buttonColor="green" 
          onPress={() => console.log('Ruutuaika')} 
          style={styles.button} 
          icon="cellphone"
        >
          Ruutuaika
        </Button>
      </View>
      <Footer navigation={navigation} /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    paddingBottom: 30,
  },
  mainButtons: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  button: {
    marginVertical: 8,
  },
});

export default HomeScreen;