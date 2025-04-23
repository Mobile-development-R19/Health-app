import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

export default function Footer({ navigation }) {
  const { colors } = useTheme();

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
