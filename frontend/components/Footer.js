import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

const Footer = ({ navigation }) => {
  // console.log('Footer component rendered');
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
        onPress={() => navigation.navigate("ChartPreview")}
      />
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
});

export default Footer;