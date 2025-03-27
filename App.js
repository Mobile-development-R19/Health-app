import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Appbar } from "react-native-paper";
// import Constants from "expo-constants";
import ChartPreviewScreen from "./screens/ChartPreviewScreen.js";
import ChartScreen from "./screens/ChartScreen.js";

const Stack = createStackNavigator();

const NavBar = ({navigation, back}) => {
    return (
        <Appbar.Header>
            {back
            ?   <>
                    <Appbar.BackAction
                        onPress={navigation.goBack}
                    />
                    <Appbar.Content title="Askeleet" />
                </>
            :   <Appbar.Content title="Kuvaajat" />
            }
        </Appbar.Header>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="chart-preview"
                screenOptions={{
                    header: (props) => <NavBar {...props} />
                }}>
                <Stack.Screen
                    name="chart-preview"
                    component={ChartPreviewScreen}
                />
                <Stack.Screen
                    name="chart"
                    component={ChartScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
