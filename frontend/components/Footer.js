import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

const Footer = ({ navigation }) => {
  const { colors } = useTheme();
    console.log('Footer component rendered');
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
        onPress={() => console.log('Graafit')} 
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
});

export default Footer;