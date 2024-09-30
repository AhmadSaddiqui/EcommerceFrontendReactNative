import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BuyerHome = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome Buyer!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BuyerHome;
