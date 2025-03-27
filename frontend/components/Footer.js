import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

const Footer = ({ navigation }) => {
    console.log('Footer component rendered');
  return (
    <View style={styles.footer}>
      <IconButton 
        icon="home" 
        size={30} 
        onPress={() => console.log('Koti')} 
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
        onPress={() => console.log('Graafit')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
});

export default Footer;