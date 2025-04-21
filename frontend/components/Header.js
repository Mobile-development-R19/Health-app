import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

const Header = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      {/* Asetukset */}
      <View style={[styles.roundButton, { backgroundColor: colors.primary }]}>
        <IconButton
          icon="cog"
          size={30}
          iconColor={colors.onPrimary}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      {/* Oma profiili / tietoni */}
      <View style={[styles.roundButton, { backgroundColor: colors.primary }]}>
        <IconButton
          icon="account"
          size={30}
          iconColor={colors.onPrimary}
          onPress={() => navigation.navigate('MyDetails')}
        />
      </View>
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
    backgroundColor: 'transparent',
  },
  roundButton: {
    borderRadius: 50,
  },
});

export default Header;
