
import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Signup from './screens/Signup';
import Login from './screens/Login';
import HomeScreen from './screens/HomeScreen';
import MyDetails from './screens/MyDetails';
import Add from './screens/Add';
import { Provider as PaperProvider } from 'react-native-paper';
import { lightTheme, darkTheme } from './theme/Themes'; 
import { auth, getFirestore, doc, setDoc, getDoc } from './firebase/Config';

const Stack = createStackNavigator();

const navTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: 'transparent'
  }
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  const lightBackground = require('./assets/light-background.png');
  const darkBackground = require('./assets/dark-background.png');

   // Noudan käyttäjän teema Firebase-tietokannasta
   useEffect(() => {
    const fetchTheme = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsDarkMode(userData.theme === 'dark'); // Aseta teema käyttäjän asetusten mukaan
        }
      } catch (error) {
        console.error('Error fetching theme:', error);
      }
    };

    fetchTheme();
  }, []);

  // Teeman vaihtaminen ja tallentaminen Firebaseen
  const handleThemeChange = async (isDark) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Käyttäjä ei ole kirjautunut sisään.');
        return;
      }
  
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
  
      await setDoc(
        userDocRef,
        { theme: isDark ? 'dark' : 'light' },
        { merge: true }
      );
  
      setIsDarkMode(isDark);
    } catch (error) {
      console.error('Virhe teemaa tallentaessa:', error);
      alert('Teeman tallennus epäonnistui. Yritä uudelleen.');
    }
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={currentTheme}>
        <ImageBackground
          source={isDarkMode ? darkBackground : lightBackground}
          style={styles.background}
          resizeMode="cover"
        >
          <SafeAreaView style={styles.container}>
            {/* Pass our transparent theme to NavigationContainer */}
            <NavigationContainer theme={navTheme}>
              <Stack.Navigator initialRouteName="Signup" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Signup">
                  {(props) => <Signup {...props} setIsDarkMode={setIsDarkMode} />}
                </Stack.Screen>
                <Stack.Screen name="Login">
                  {(props) => <Login {...props} setIsDarkMode={setIsDarkMode} />}
                </Stack.Screen>
                <Stack.Screen name="HomeScreen">
                  {(props) => <HomeScreen {...props} setIsDarkMode={setIsDarkMode} />}
                </Stack.Screen>
                <Stack.Screen name="MyDetails">
                  {(props) => <MyDetails {...props} setIsDarkMode={setIsDarkMode} />}
                </Stack.Screen>
                <Stack.Screen name="Add">
                  {(props) => <Add {...props} setIsDarkMode={setIsDarkMode} />}
                </Stack.Screen>
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        </ImageBackground>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1, 
  },
});
