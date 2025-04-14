import React, { useEffect, useState } from 'react';
import { View, Dimensions, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { getFirestore, collection, doc, getDocs } from 'firebase/firestore';
import { auth } from '../firebase/Config';

const screenWidth = Dimensions.get('window').width;

export default function SleepChart({ navigation }) {
  const [chartData, setChartData] = useState(null);
  const [sleepDetails, setSleepDetails] = useState([]);

  useEffect(() => {
    const fetchSleepData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const db = getFirestore();
        const sleepRef = collection(doc(db, "users", user.uid), "sleepData");
        const snapshot = await getDocs(sleepRef);

        const data = snapshot.docs.map(doc => doc.data());

        if (data.length === 0) {
          alert("Ei löydetty unidataa.");
          return;
        }

        // Järjestetään sleepDate:n mukaan (tai timestamp jos puuttuu)
        const sorted = data.sort((a, b) => {
          const dateA = new Date(a.sleepDate || a.timestamp?.seconds * 1000);
          const dateB = new Date(b.sleepDate || b.timestamp?.seconds * 1000);
          return dateA - dateB;
        });

        const labels = sorted.map(entry =>
          new Date(entry.sleepDate || entry.timestamp?.seconds * 1000).toLocaleDateString('fi-FI', {
            month: 'short',
            day: 'numeric'
          })
        );

        const durations = sorted.map(entry => {
          const duration = parseFloat(entry.duration);
          return isNaN(duration) ? 0 : duration;
        });

        const details = sorted.map(entry => ({
          date: entry.sleepDate || new Date(entry.timestamp?.seconds * 1000).toLocaleDateString('fi-FI'),
          sleepTime: entry.sleepTime,
          wakeTime: entry.wakeTime,
          duration: entry.duration
        }));

        setChartData({
          labels,
          datasets: [{ data: durations }]
        });

        setSleepDetails(details);
      } catch (error) {
        console.error("Virhe haettaessa unidataa:", error.message);
        alert("Virhe tiedon haussa");
      }
    };

    fetchSleepData();
  }, []);

  if (!chartData) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>Ladataan unidataa...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Unen kesto (tuntia)</Text>

      {/* ScrollView ympäröimässä BarChart komponenttia */}
      <ScrollView horizontal={true} style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={screenWidth * 2}  // Aseta leveys suuremmaksi, jotta kaikki data mahtuu
          height={240}
          yAxisSuffix="h"
          chartConfig={{
            backgroundGradientFrom: '#f0fff0',
            backgroundGradientTo: '#c8e6c9',
            color: (opacity = 1) => `rgba(0, 100, 0, ${opacity})`,
            labelColor: () => '#333',
            style: {
              borderRadius: 16
            }
          }}
          verticalLabelRotation={30}
          style={styles.chart}
        />
      </ScrollView>

      <Text style={styles.subtitle}>Yksityiskohdat:</Text>
      {sleepDetails.map((item, index) => (
        <View key={index} style={styles.entry}>
          <Text style={styles.entryDate}>📅 {item.date}</Text>
          <Text style={styles.entryText}>🛏 Nukkumaan: {item.sleepTime}</Text>
          <Text style={styles.entryText}>⏰ Herätys: {item.wakeTime}</Text>
          <Text style={styles.entryText}>🕒 Kesto: {item.duration} h</Text>
        </View>
      ))}

      {/* Takaisin-nappi alareunassa */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.buttonText}>Takaisin</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    textAlign: 'center',
    color: '#333'
  },
  chartContainer: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chart: {
    borderRadius: 16,
  },
  entry: {
    backgroundColor: '#e0f7e0',
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
  },
  entryDate: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4
  },
  entryText: {
    fontSize: 14,
    color: '#333',
  },
  backButton: {
    position: 'center', 
    bottom: 20,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
