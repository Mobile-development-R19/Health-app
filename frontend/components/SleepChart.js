import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { getFirestore, collection, doc, getDocs } from 'firebase/firestore';
import { auth } from '../firebase/Config';

const screenWidth = Dimensions.get('window').width - 40;

export default function SleepChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSleepData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const db = getFirestore();
        const sleepRef = collection(doc(db, "users", user.uid), "sleepData");
        const snapshot = await getDocs(sleepRef);

        const rawData = snapshot.docs.map(doc => doc.data());
        const sorted = rawData.sort((a, b) => {
          const dateA = new Date(a.sleepDate || a.timestamp?.seconds * 1000);
          const dateB = new Date(b.sleepDate || b.timestamp?.seconds * 1000);
          return dateA - dateB;
        });

        const transformed = sorted.map(entry => {
          const duration = parseFloat(entry.duration);
          const dateLabel = new Date(entry.sleepDate || entry.timestamp?.seconds * 1000).toLocaleDateString('fi-FI', {
            day: 'numeric', month: 'numeric'
          });
          return {
            value: isNaN(duration) ? 0 : duration,
            label: dateLabel,
            frontColor: '#000000', 
          };
        });

        setData(transformed);
      } catch (error) {
        console.error("Virhe haettaessa unidataa:", error.message);
        alert("Virhe tiedon haussa");
      }
    };

    fetchSleepData();
  }, []);

  if (data.length === 0) {
    return <Text style={styles.loading}>Ladataan unidataa...</Text>;
  }

  const manyData = data.length > 7;
  const barWidth = manyData ? 10 : screenWidth / (2 * data.length);
  const spacing = manyData ? 10 : screenWidth / (2 * data.length);
  const chartWidth = data.length * (barWidth + spacing);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>🛌 Uniseuranta</Text>
      <View style={styles.chartCard}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ width: chartWidth }}>
            <BarChart
              data={data}
              barBorderRadius={6}
              barWidth={barWidth}
              spacing={spacing}
              maxValue={12}
              height={160}
              noOfSections={4}
              yAxisTextStyle={{ color: '#555' }}
              xAxisLabelTextStyle={{ color: '#555', fontSize: 10 }}
              rulesColor="#ddd"
              isAnimated
              showGradient
            />
          </View>
        </ScrollView>
        <Text style={styles.chartNote}>Y-akseli: Tunnit</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  loading: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.0001, 
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1, 
    marginBottom: 20,
  },
  chartNote: {
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
  },
});
