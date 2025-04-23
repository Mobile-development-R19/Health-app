import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Image } from "react-native";
import { auth, createUserWithEmailAndPassword, getFirestore, doc, setDoc  } from "../firebase/Config";

export default function Signup({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignUp = async() => {
        try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredentials.user

        const db = getFirestore()

        await setDoc(doc(db, 'users/' + user.uid), {
            email: user.email
        })
            
            alert('Rekisteröityminen onnistui!')
            
            navigation.navigate('Login')
        } catch (error) {
            alert('Rekisteröityminen epäonnistui. ' + error.message)
            console.log(error.message)
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

      <Button title='Rekisteröidy' onPress={handleSignUp} />
      <Text onPress={() => navigation.navigate('Login')} style={styles.link}>Oletko jo rekisteröitynyt? Kirjaudu sisään</Text>
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
        borderRadius: 10,
        marginBottom: 15,
        padding: 10
    },
    link: {
        marginTop: 10,
        color: 'blue',
        textAlign: 'center'
    }
})