import { StyleSheet } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Signup from './screens/Signup';
import Login from './screens/Login';
import HomeScreen from './screens/HomeScreen';
import MyDetails from './screens/mydetails';

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Signup' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Signup' component={Signup} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='HomeScreen' component={HomeScreen} />
        <Stack.Screen name='mydetails' component={MyDetails} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
