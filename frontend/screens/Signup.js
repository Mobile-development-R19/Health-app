import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { auth, createUserWithEmailAndPassword, db, doc, setDoc  } from "../firebase/Config";

export default function Signup({ navigation }) {
  // Tilamuuttujat rekisteröitymiselle
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignUp = async() => {
        try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredentials.user

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
        padding: 20
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