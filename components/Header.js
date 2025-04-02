import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

const Header = ({ navigation }) => {
    console.log('Header component rendered');
  return (
    <View style={styles.header}>
      <IconButton 
        icon="cog" 
        size={30} 
        onPress={() => console.log('Asetukset')} 
      />
      <IconButton 
        icon="account" 
        size={30} 
        onPress={() => navigation.navigate('MyDetails')} 
      />
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
    marginTop: 30,
  },
});

export default Header;