import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

export default function Footer({ navigation }) {
  const { colors } = useTheme();
  console.log('Footer component rendered');

  //const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.footer}>
      <View style={[styles.roundButton, { backgroundColor: colors.primary }]}>
      <IconButton
        icon="home"
        size={28}
        color={colors.onPrimary}
        iconColor={colors.onPrimary}
        onPress={() => navigation.navigate('HomeScreen')}
      />
      </View>
      <View style={[styles.roundButton, { backgroundColor: colors.primary }]}>
      <IconButton
        icon="plus-circle"
        size={28}
        color={colors.onPrimary}
        iconColor={colors.onPrimary}
        onPress={() => navigation.navigate('Add')}
      />

      </View>
      <View style={[styles.roundButton, { backgroundColor: colors.primary }]}>
      <IconButton
        icon="chart-bar"
        size={28}
        color={colors.onPrimary}
        iconColor={colors.onPrimary}
        onPress={() => navigation.navigate('ChartScreen')}
      />
      </View>

     {/* <IconButton
        icon="chart-bar"
        size={30}
        onPress={() => setModalVisible(true)}
      />

       Modal-valikko
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
      */}

    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: 'transparent', // Ensure transparency
  },
  roundButton: {
    borderRadius: 50, // Makes the button round
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
