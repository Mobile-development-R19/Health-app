import { Pedometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { setDoc, db, doc, auth } from "../firebase/Config";

export default function StepCount() {
    const [isPedoMeterAvailable, setIsPedoMeterAvailable] = useState('checking')
    const [pastStepCount, setPastStepCount] = useState(0)   // Viimeisen 24 tunnin askelmäärä, joka haetaan puhelimesta

        // Funktio, joka tarkastaa onko askelmittari saatavilla
    const subscribe = async () => {
        const isAvailable = await Pedometer.isAvailableAsync()
        setIsPedoMeterAvailable(String(isAvailable))
        console.log(isPedoMeterAvailable)

        // Jos askelmittari on saatavilla, hakee askelmäärän viimeisen 24 tunnin ajalta
        if (isAvailable) {
            const end = new Date() // Nykyhetki
            const start = new Date() // Nykyhetkestä tietty määritelty aika taaksepäin
            start.setDate(end.getDate() - 1)    // Määritetään start 24 tunnin päähän (-1 tarkoittaa sitä)

            // Pedometerin getStepCountAsync(start, end) funktio hakee askeleet päiviltä parametrien perusteella
            const pastStepCountResult = await Pedometer.getStepCountAsync(start, end)
            console.log("Step result:", pastStepCountResult)

            const user = auth.currentUser
            const uid = user.uid
            const todayId = new Date().toISOString().split("T")[0]

            if (user && pastStepCountResult) {
                const steps = pastStepCountResult.steps
                setPastStepCount(steps)

                try {
                    await setDoc(doc(db, "users", uid, "steps", todayId), {
                        steps: steps,
                        timestamp: new Date()
                    })
                        console.log("Data saved to Firestore account: ", uid)
                } catch (error) {
                    console.error("Save failed: ", error)
                }
            }
        }
    }
    // Suoritetaan subscribe() -funktio kun komponentti renderöidään
    useEffect(() => {
        subscribe()
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Askeleesi tänään</Text>
                <Text style={styles.stepCount}>{pastStepCount}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6, 
        alignItems: 'center',
        width: '100%',
        maxWidth: 350,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    stepCount: {
        fontSize: 48,
        fontWeight: '700',
        color: 'green', 
    },
})
