import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminDashboard = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome Admin!</Text>
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

export default AdminDashboard;
