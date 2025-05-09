import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Image } from "react-native";
import { auth, signInWithEmailAndPassword, } from "../firebase/Config";

export default function Login({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async() => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            alert('Kirjautuminen onnistui!')
            navigation.navigate('MyDetails')

        } catch (error) {
            alert('Kirjautuminen epäonnistui. ' + error.message)
        }
    }


  return (
        <View style={styles.container}>
            <Image source={require('../assets/Logo.png')} style={styles.logo} />
            <Image source={require('../assets/name.png')} style={styles.name} />
            <TextInput 
              placeholder="Sähköposti"
              placeholderTextColor="#666"
              value={email} 
              onChangeText={setEmail}
              style={styles.input}
            />

            <TextInput 
              placeholder="Salasana"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            <Button title='Kirjaudu sisään' onPress={handleLogin} />
            <Text onPress={() => navigation.navigate('Signup')} style={styles.link}>Ei vielä tiliä? Rekisteröidy</Text>
          </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
      },
      name: {
        width: 200,
        height: 50,
        marginBottom: 30,
      },
    input: {
        backgroundColor: 'white',
        borderRadius:10,
        marginBottom: 15,
        padding: 10,
        width: "60%",
    },
    link: {
        marginTop: 10,
        color: 'blue',
        textAlign: 'center'
    }
})