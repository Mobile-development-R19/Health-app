import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { auth, signInWithEmailAndPassword, doc, getDoc, db } from "../firebase/Config";

export default function Login({ navigation }) {
    // Tilamuuttujat kirjautumiselle, joita käytetään textinputeissa
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Kirjautumisfunktio, joka toteutetaan kun käyttäjä painaa "kirjaudu" -nappia
    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const keys = Object.keys(data);

                if (keys.length > 1) {
                    // Käyttäjä on täyttänyt jo tietonsa, joten hypätään omien tietojen yli etusivulle
                    navigation.navigate('HomeScreen');
                } else {
                    // Vain email löytyy, joten siirrytään omiin tietoihin
                    navigation.navigate('MyDetails');
                }
            } 
        } catch (error) {
            alert('Kirjautuminen epäonnistui. ' + error.message);
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

            <Button title='Kirjaudu sisään' onPress={handleLogin} />
            <Text onPress={() => navigation.navigate('Signup')} style={styles.link}>Ei vielä tiliä? Rekisteröidy</Text>
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
        borderRadius:10,
        marginBottom: 15,
        padding: 10
    },
    link: {
        marginTop: 10,
        color: 'blue',
        textAlign: 'center'
    }
})