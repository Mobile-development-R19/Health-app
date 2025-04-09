import { Pedometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function StepCount() {
    const [isPedoMeterAvailable, setIsPedoMeterAvailable] = useState('checking')
    const [pastStepCount, setPastStepCount] = useState(0)

    const subscribe = async () => {
        const isAvailable = await Pedometer.isAvailableAsync()
        setIsPedoMeterAvailable(String(isAvailable))

        if (isAvailable) {
            const end = new Date()
            const start = new Date()
            start.setDate(end.getDate() - 1)

            const pastStepCountResult = await Pedometer.getStepCountAsync(start, end)
            console.log("Step result:", pastStepCountResult)
            if (pastStepCountResult) {
                setPastStepCount(pastStepCountResult.steps)
            }
        }
    }

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
        padding: 24,
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
