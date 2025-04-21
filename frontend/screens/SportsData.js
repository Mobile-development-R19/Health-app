import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useTheme, Card } from 'react-native-paper';
import { auth, getFirestore, collection, doc, getDocs } from '../firebase/Config';

const SportsData = () => {
  const { colors } = useTheme();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          alert('Kirjaudu ensin sisään.');
          return;
        }

        const db = getFirestore();
        const activitiesRef = collection(doc(db, 'users', user.uid), 'activities');
        const snapshot = await getDocs(activitiesRef);

        const fetchedActivities = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Järjestetään uusimmat ensin
        fetchedActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
        setActivities(fetchedActivities);
      } catch (error) {
        console.error('Virhe haettaessa aktiviteetteja:', error);
        alert('Virhe haettaessa aktiviteetteja.');
      }
    };

    fetchActivities();
  }, []);

  const renderItem = ({ item }) => (
    <Card style={[styles.card, { backgroundColor: colors.surface }]} key={item.id}>
      <Card.Content>
        <Text style={styles.activity}>{item.activity}</Text>
        <Text>Kesto: {item.duration} min</Text>
        <Text>Päivämäärä: {new Date(item.date).toLocaleDateString()}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Ei tallennettuja aktiviteetteja.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
  },
  activity: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});

export default SportsData;
