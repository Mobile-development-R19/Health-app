import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { getFirestore, collection, doc, getDocs } from 'firebase/firestore';
import { auth } from '../firebase/Config';

const screenWidth = Dimensions.get('window').width - 40;

// SleepChart-näkymä: näyttää unidatan pylväsdiagrammina ja yksityiskohtina
export default function SleepChart({ navigation }) {
  const [data, setData] = useState([]); 
  const [details, setDetails] = useState([]); 

  // Hakee ja käsittelee unidatan Firestoresta käyttäjäkohtaisesti
  useEffect(() => {
    const fetchSleepData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const db = getFirestore();
        const sleepRef = collection(doc(db, "users", user.uid), "sleepData");
        const snapshot = await getDocs(sleepRef);

        // Raakadata jaetaan, lajitellaan päivämäärän mukaan
        const rawData = snapshot.docs.map(doc => doc.data());
        const sorted = rawData.sort((a, b) => {
          const dateA = new Date(a.sleepDate || a.timestamp?.seconds * 1000);
          const dateB = new Date(b.sleepDate || b.timestamp?.seconds * 1000);
          return dateA - dateB;
        });

        // Muodostetaan kaaviolle sopiva data
        const transformed = sorted.map(entry => {
          const duration = parseFloat(entry.duration);
          const dateLabel = new Date(entry.sleepDate || entry.timestamp?.seconds * 1000).toLocaleDateString('fi-FI', {
            day: 'numeric', month: 'numeric'
          });
          return {
            value: isNaN(duration) ? 0 : duration,
            label: dateLabel,
            frontColor: '#4CAF50',
          };
        });

        // Muodostetaan lisätiedot yksityiskohtaiselle näkymälle
        const extra = sorted.map(entry => ({
          date: entry.sleepDate || new Date(entry.timestamp?.seconds * 1000).toLocaleDateString('fi-FI'),
          sleepTime: entry.sleepTime,
          wakeTime: entry.wakeTime,
          duration: entry.duration
        }));

        setData(transformed);
        setDetails(extra);
      } catch (error) {
        console.error("Virhe haettaessa unidataa:", error.message);
        alert("Virhe tiedon haussa");
      }
    };

    fetchSleepData();
  }, []);

  // Näytetään latausviesti jos dataa ei vielä ole
  if (data.length === 0) {
    return <Text style={styles.loading}>Ladataan unidataa...</Text>;
  }

  // Määritellään kaavion asetukset skaalautuvasti
  const manyData = data.length > 7;
  const fixedBarWidth = 20;
  const fixedSpacing = 15;
  const barWidth = manyData ? fixedBarWidth : screenWidth / (2 * data.length);
  const spacing = manyData ? fixedSpacing : screenWidth / (2 * data.length);
  const chartWidth = manyData ? data.length * (barWidth + spacing) : screenWidth;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🛌 Uniseuranta</Text>

      {/* Pylväsdiagrammi kaaviolla ja horisontaalisella skrollauksella */}
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

      {/* Yksityiskohtainen näkymä uniraporteista */}
      <Text style={styles.subtitle}>📋 Yksityiskohdat</Text>
      {details.map((item, i) => (
        <View key={i} style={styles.detailCard}>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.text}>🕒 Kesto: {item.duration} h</Text>
          <Text style={styles.text}>🛏 Nukkumaan: {item.sleepTime}</Text>
          <Text style={styles.text}>⏰ Herätys: {item.wakeTime}</Text>
        </View>
      ))}

      {/* Takaisin-nappi navigointia varten */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Takaisin</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  loading: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 25,
    marginBottom: 10,
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  chartNote: {
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  detailCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  date: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
});
