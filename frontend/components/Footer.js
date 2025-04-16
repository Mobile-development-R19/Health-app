import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

const Footer = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.footer}>
      <IconButton 
        icon="home" 
        size={30} 
        onPress={() => navigation.navigate("HomeScreen")} 
      />

      <IconButton 
        icon="plus-circle" 
        size={30} 
        color="purple" 
        onPress={() => console.log('Lisää')} 
      />

      <IconButton 
        icon="chart-bar" 
        size={30} 
        onPress={() => setModalVisible(true)} 
      />

      {/* Modal-valikko */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => { navigation.navigate("SleepChart"); setModalVisible(false); }}>
              <Text style={styles.modalItem}>SleepChart</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate("ChartPreview"); setModalVisible(false); }}>
              <Text style={styles.modalItem}>ChartPreview</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate("Chart"); setModalVisible(false); }}>
              <Text style={styles.modalItem}>Chart</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: "#ddd",
    borderRadius: 20,
    marginHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalItem: {
    fontSize: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});

export default Footer;
