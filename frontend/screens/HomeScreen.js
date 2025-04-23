import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import StepCount from '../components/StepCount';

export default function HomeScreen({ navigation, setIsDarkMode }) {
  const { colors } = useTheme();
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
    <View style={styles.imageContainer}>
          <Image
            source={require('../assets/name.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <StepCount />

      <View style={styles.mainButtons}>
        <Button 
          mode="contained" 
          buttonColor={colors.primary} 
          textColor={colors.onPrimary}
          onPress={() => navigation.navigate('StepsChart')} 
          style={styles.button} 
          icon="walk"
        >
          Askeleet
        </Button>
        <Button 
          mode="contained" 

          buttonColor={colors.primary}
          textColor={colors.onPrimary}  
          onPress={() => navigation.navigate('SleepEntry')} 

          style={styles.button} 
          icon="moon-waning-crescent"
        >
          Unen seuranta
        </Button>
        <Button 
          mode="contained" 
          buttonColor={colors.primary}
          textColor={colors.onPrimary} 
          onPress={() => navigation.navigate('SportsData')}
          style={styles.button} 
          icon="calendar"
        >
          Liikunta ja treenit
        </Button>
        <Button 
          mode="contained" 
          buttonColor={colors.primary}
          textColor={colors.onPrimary}
          onPress={() => {
            navigation.navigate('CalculatorScreen'); 
          }}

          style={styles.button} 
          icon="calculator"
        >
          Laskurit (BMI, kalorit jne.)
        </Button>
        <Button
          mode="contained"
          buttonColor={colors.primary}
          textColor={colors.onPrimary}
          onPress={() => navigation.navigate("Food")}
          style={styles.button}
          icon="food"
        >
          Ruokapäiväkirja
        </Button>
      </View>
    
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'transparent',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 100,
  },
  mainButtons: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  footerContainer: {
    flex: 0,
  },
  button: {
    marginVertical: 8,
  },
  
});
