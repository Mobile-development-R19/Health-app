import React, { useEffect, useState } from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { auth, getFirestore, collection, doc, getDocs } from '../firebase/Config';

const screenWidth = Dimensions.get('window').width;

export default function SleepChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchSleepData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const db = getFirestore();
      const sleepRef = collection(doc(db, "users", user.uid), "sleepData");
      const snapshot = await getDocs(sleepRef);

      const data = snapshot.docs.map(doc => doc.data());
      // Järjestetään päiväyksen mukaan
      const sorted = data.sort((a, b) => new Date(a.timestamp.seconds * 1000) - new Date(b.timestamp.seconds * 1000));

      const labels = sorted.map(entry =>
        new Date(entry.timestamp.seconds * 1000).toLocaleDateString('fi-FI', { month: 'short', day: 'numeric' })
      );
      const durations = sorted.map(entry => parseFloat(entry.duration));

      setChartData({
        labels,
        datasets: [{ data: durations }]
      });
    };

    fetchSleepData();
  }, []);

  if (!chartData) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>Ladataan unidataa...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unen kesto (tuntia)</Text>
      <BarChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
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
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  }
});
