import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GoogleLogin from './screens/googleLogin'; // Import login screen
import HomeScreen from './screens/homeScreen'; // Import home screen

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GoogleLogin" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GoogleLogin" component={GoogleLogin} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
