import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Signup from './screens/Signup';
import Login from './screens/Login';
import HomeScreen from './screens/HomeScreen';
import MyDetails from './screens/MyDetails';
import ChartPreviewScreen from './screens/ChartPreviewScreen';
import ChartScreen from './screens/ChartScreen';
import SleepEntry from './screens/SleepEntry';
import SleepList from './screens/SleepList'
import SleepChart from './components/SleepChart'
import AuthLoadingScreen from './screens/AuthLoadingScreen'
import Settings from './screens/Settings';
import CalculatorScreen from './screens/CalculatorScreen';
import Add from './screens/Add';
import Header from './components/Header';
import Footer from './components/Footer';
import { Provider as PaperProvider } from 'react-native-paper';
import { lightTheme, darkTheme } from './theme/Themes'; 
import { auth, getFirestore, doc, setDoc, getDoc } from './firebase/Config';
import FoodScreen from './screens/FoodScreen';
import SportsData from './screens/SportsData';
import StepsChart from './screens/StepsChart';

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
          setIsDarkMode(userData.theme === 'dark'); // Käytetään käyttäjän valitsemaa teemaa
        }
      } catch (error) {
        console.error('Error fetching theme:', error);
      }
    };

    fetchTheme();

    // Seurataan kirjautumistilan muutoksia
    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchTheme();
    });

    return unsubscribe;
  }, []);

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
            <Stack.Navigator initialRouteName="AuthLoadingScreen" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="AuthLoadingScreen">
                    {(props) => <AuthLoadingScreen {...props} setIsDarkMode={setIsDarkMode} />}
                  </Stack.Screen>
                  <Stack.Screen name="Signup">
                  {(props) => <Signup {...props} setIsDarkMode={setIsDarkMode} />}
                </Stack.Screen>
                <Stack.Screen name="Login">
                  {(props) => <Login {...props} setIsDarkMode={setIsDarkMode} />}
                </Stack.Screen>
                <Stack.Screen name="HomeScreen">
                  {(props) => (
                    <Layout navigation={props.navigation}>
                      <HomeScreen {...props} setIsDarkMode={setIsDarkMode} />
                    </Layout>
                  )}
                </Stack.Screen>
                <Stack.Screen name="MyDetails">
                  {(props) => (
                    <Layout navigation={props.navigation}>
                      <MyDetails {...props} setIsDarkMode={setIsDarkMode} />
                    </Layout>
                  )}
                </Stack.Screen>
                <Stack.Screen name="Add">
                  {(props) => (
                    <Layout navigation={props.navigation}>
                      <Add {...props} setIsDarkMode={setIsDarkMode} />
                    </Layout>
                  )}
                </Stack.Screen>
                <Stack.Screen name="ChartPreviewScreen">
                  {(props) => (
                    <Layout navigation={props.navigation}>
                      <ChartPreviewScreen {...props} setIsDarkMode={setIsDarkMode} />
                    </Layout>
                  )}
                </Stack.Screen>
                <Stack.Screen name="ChartScreen">
                  {(props) => (
                    <Layout navigation={props.navigation}>
                      <ChartScreen {...props} setIsDarkMode={setIsDarkMode} />
                    </Layout>
                  )}
                </Stack.Screen>
                <Stack.Screen name="StepsChart">
                  {(props) => (
                    <Layout navigation={props.navigation}>
                      <StepsChart {...props} setIsDarkMode={setIsDarkMode} />
                    </Layout>
                  )}
                </Stack.Screen>
                <Stack.Screen name="SleepEntry">
                  {(props) => (
                    <Layout navigation={props.navigation}>
                      <SleepEntry {...props} setIsDarkMode={setIsDarkMode} />
                    </Layout>
                  )}
                </Stack.Screen>
                <Stack.Screen name="SleepList">
                  {(props) => (
                    <Layout navigation={props.navigation}>
                      <SleepList {...props} setIsDarkMode={setIsDarkMode} />
                    </Layout>
                  )}
                </Stack.Screen>
                <Stack.Screen name="SleepChart">
                  {(props) => (
                    <Layout navigation={props.navigation}>
                      <SleepChart {...props} setIsDarkMode={setIsDarkMode} />
                    </Layout>
                  )}
                </Stack.Screen>
                <Stack.Screen name="CalculatorScreen">
                  {(props) => (
                    <Layout navigation={props.navigation}>
                      <CalculatorScreen {...props} setIsDarkMode={setIsDarkMode} />
                    </Layout>
                  )}
                </Stack.Screen>
                <Stack.Screen name="Food">
                  {(props) => (
                    <Layout navigation={props.navigation}>
                      <FoodScreen {...props} setIsDarkMode={setIsDarkMode} />
                    </Layout>
                  )}
                </Stack.Screen>
                <Stack.Screen name="Settings">
                  {(props) => (
                    <Layout navigation={props.navigation}>
                      <Settings {...props} setIsDarkMode={setIsDarkMode} />
                    </Layout>
                  )}
                </Stack.Screen>
                <Stack.Screen name="SportsData">
                  {(props) => (
                    <Layout navigation={props.navigation}>
                      <SportsData {...props} setIsDarkMode={setIsDarkMode} />
                    </Layout>
                  )}
                </Stack.Screen>
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        </ImageBackground>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const Layout = ({ children, navigation }) => (
  <View style={styles.layout}>
    <Header navigation={navigation} />
    <View style={styles.content}>{children}</View>
    <Footer navigation={navigation} />
  </View>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  layout: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
