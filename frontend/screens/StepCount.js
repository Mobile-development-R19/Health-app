import { useEffect, useState, } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { initialize, requestPermission, readRecords } from "react-native-health-connect"; 
import { Pedometer } from "expo-sensors";
import { setDoc, db, doc, auth } from "../firebase/Config";

export default function StepCount() {
  const [isAvailable, setIsAvailable] = useState("checking")  // Tilamuuttuja debuggaukseen, onko data saatavilla
  const [stepCount, setStepCount] = useState(0)

  const todayId = new Date().toISOString().split("T")[0] // esim. "2025-04-18"

  // Funktio, joka lukee askeldatan Androidilta
  const readAndroidData = async () => {
    try {
      const isInitialized = await initialize()  // Alustetaan Health Connect
      if (!isInitialized) {
        setIsAvailable("Initialization failed")
        return
      }

      // Pyydetään käyttäjältä lupa Health Connectissa lukea askelia
      const permissions = [
        { accessType: 'read', recordType: 'Steps' },
      ];

      // Jos lupaa ei myönnetä, ei tehdä mitään
      const permissionResult = await requestPermission(permissions)
      if (!permissionResult) {
        setIsAvailable("Permission not granted")
        console.log(isAvailable)
        return
      }

      // Lupa myönnetty, haetaan askeleet tämän päivän ajalta (00.00-23.59)
      const now = new Date()
      const startTime = new Date(now)
      startTime.setHours(0, 0, 0, 0)

      const endTime = new Date(now)
      endTime.setHours(23, 59, 59, 999)

      const stepsData = await readRecords('Steps', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
      });

      // Kaikki päivän askeleet summattuna
      const steps = stepsData.records.reduce((sum, cur) => sum + cur.count, 0)
      setStepCount(steps);

      // Varmistetaan, että käyttäjä on kirjautunut sisään ja tallennetaan nykyinen askelmäärä Firestoreen
      const user = auth.currentUser
      if (user) {
        await setDoc(doc(db, "users", user.uid, "steps", todayId), {
          steps: steps,
          timestamp: new Date(),
        })
      }
      setIsAvailable("Data fetched successfully")
    } catch (error) {
      console.error("Error fetching health data:", error)
      setIsAvailable("Error fetching data")
    }
  };


  // Funktio, joka lukee askeldatan iOS:lta
  const readIosData = async () => {
    // Pyydetään käyttäjältä lupa lukea askeltietoja
    const { status } = await Pedometer.requestPermissionsAsync()
    if (status !== "granted") {
      setIsAvailable("Permission denied")
      return
    }

    // Tarkistetaan, onko laitteessa Pedometer-toimintoa 
    const isPedometerAvailable = await Pedometer.isAvailableAsync()
    setIsAvailable(String(isPedometerAvailable))

    // Jos askelmittari on saatavilla, haetaan päivän (00.00-23.59) askeleet
    if (isPedometerAvailable) {
      const start = new Date()
      start.setHours(0, 0, 0, 0)

      const end = new Date();
      end.setHours(23, 59, 59, 999)
      

      const result = await Pedometer.getStepCountAsync(start, end)
      const steps = result.steps || 0
      setStepCount(steps)

      // Jos käyttäjä on kirjautunut sisään, tallennetaan askelmäärä Firestoreen
      const user = auth.currentUser
      if (user) {
        await setDoc(doc(db, "users", user.uid, "steps", todayId), {
          steps: steps,
          timestamp: new Date(),
        })
      }
    }
  }

  // Suoritetaan komponentin renderöityessä
  useEffect(() => {
    if (Platform.OS === 'android') {
      readAndroidData()
      //console.log(isAvailable)
    } else if (Platform.OS === 'ios') {
      readIosData()
      //console.log(isAvailable)
  }
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Askeleesi tänään</Text>
        <Text style={styles.stepCount}>{stepCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    alignItems: "center",
    width: "100%",
    maxWidth: 350,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  stepCount: {
    fontSize: 48,
    fontWeight: "700",
    color: "green",
  },
});
