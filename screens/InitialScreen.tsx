import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
interface InitialScreenProps {
    navigation: NavigationProp<any>; // Define the type for navigation prop
  }

const InitialScreen : React.FC<InitialScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button title="Signup" onPress={() => navigation.navigate('Signup')} />
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
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

export default InitialScreen;
