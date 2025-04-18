import React, { useState } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { auth, getFirestore, doc, setDoc } from '../firebase/Config';


const Header = ({ navigation, setIsDarkMode }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useTheme();

  const handleThemeChange = async (theme) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('User is not logged in.');
        return;
      }
  
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
  
      // Tallenna teema Firebaseen
      await setDoc(
        userDocRef,
        { theme: theme }, // Tallenna valittu teema
        { merge: true } // Yhdistä olemassa olevaan dokumenttiin  
      );
  
      setIsDarkMode(theme === 'dark');
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving theme:', error);
      alert('Failed to save theme. Please try again.');
    }
  };

    console.log('Header component rendered');

  return (
    <View style={styles.header}>

       <View style={[styles.roundButton, { backgroundColor: colors.primary }]}>
      <IconButton 
        icon="cog" 
        size={30} 
        color={colors.onPrimary}
        iconColor={colors.onPrimary}
        onPress={() => setModalVisible(true)} 
      />
      </View>
      <View style={[styles.roundButton, { backgroundColor: colors.primary }]}>
      <IconButton 
        icon="account" 
        size={30} 
        color={colors.onPrimary}
        iconColor={colors.onPrimary}
        onPress={() => navigation.navigate('MyDetails')} 

      {/* Asetukset-painike 
      <IconButton 
        icon="cog" 
        size={30} 
        onPress={() => navigation.navigate('Settings')}  // Navigointi Asetukset-näyttöön
      />
*/}
      
      />
      </View>
      {/* Modal for theme selection */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)} 
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Valitse Teema</Text>
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={() => handleThemeChange('light')}
            >
              <Text style={styles.optionText}>Vaalea</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={() => handleThemeChange('dark')}
            >
              <Text style={styles.optionText}>Tumma</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.optionText}>Peruuta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 10,
        backgroundColor: 'transparent', // Ensure transparency
  },
  roundButton: {
    borderRadius: 50, // Makes the button round
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    padding: 10,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
  },
});

export default Header;
