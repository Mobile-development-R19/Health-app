import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';

export default function HomeScreen({ navigation, setIsDarkMode }) {
  const { colors } = useTheme();
  
  const [user, setUser] = useState(null); // State käyttäjän tiedoille

  // Hakee kirjautuneen käyttäjän tiedot
  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Näytetään käyttäjän tiedot */}
        <Text style={styles.t}>Käyttäjä kirjautunut sisään: 
          (valitettavasti ei saatu google loginia yhdistettyä lopulliseen sovellukseen)</Text>
        {user ? (
          <View style={styles.userInfo}>
            <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
            <Text style={styles.userName}>{user.displayName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        ) : (
          <Text>Loading...</Text> 
        )}

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
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: 'gray',
  },
  mainButtons: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  button: {
    marginVertical: 8,
  },
  t: {
    margin: 20,
    padding: 10,
    fontSize: 34,
    fontWeight: 'bold',
  }
});
