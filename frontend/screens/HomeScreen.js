import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation, setIsDarkMode }) => {
  const { colors } = useTheme();
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
     { <Header navigation={navigation} setIsDarkMode={setIsDarkMode} /> }
      

      <View style={styles.mainButtons}>
        <Button 
          mode="contained" 
          buttonColor={colors.primary} 
          textColor={colors.onPrimary}
          onPress={() => console.log('Askeleet')} 
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
          onPress={() => console.log('Liikunta ja treeni')} 
          style={styles.button} 
          icon="calendar"
        >
          Liikunta ja treenit
        </Button>
        <Button 
          mode="contained" 
 Toinen-Aleksi
          buttonColor={colors.primary}
          textColor={colors.onPrimary}
          onPress={() => {
            navigation.navigate('Calculator'); 
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
          onPress={() => console.log('Ruutuaika')} 
          style={styles.button} 
          icon="cellphone"
        >
          Ruutuaika
        </Button>
      </View>
      
      <Footer navigation={navigation} /> 
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
  
  mainButtons: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  footerContainer: {
    flex: 0,
  },
  button: {
    marginVertical: 8,
  },
});

export default HomeScreen;