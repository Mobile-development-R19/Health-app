import { StyleSheet } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
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

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='AuthLoadingScreen' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthLoadingScreen" component={AuthLoadingScreen} />
        <Stack.Screen name='Signup' component={Signup} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='HomeScreen' component={HomeScreen} />
        <Stack.Screen name='MyDetails' component={MyDetails} />
        <Stack.Screen name="ChartPreview" component={ChartPreviewScreen} />
        <Stack.Screen name="Chart" component={ChartScreen} />
        <Stack.Screen name="SleepEntry" component={SleepEntry} />
        <Stack.Screen name="SleepList" component={SleepList} />
        <Stack.Screen name="SleepChart" component={SleepChart} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Calculator" component={CalculatorScreen} />
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
