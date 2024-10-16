import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SellerHomes = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome Seller!</Text>
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

export default SellerHomes;
