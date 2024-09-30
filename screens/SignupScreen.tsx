import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

interface SignupScreenProps {
  navigation: NavigationProp<any>; // Define the type for navigation prop
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Register as Buyer" onPress={() => navigation.navigate('BuyerSignup')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Register as Seller" onPress={() => navigation.navigate('SellerSignup')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={() => navigation.navigate('Login')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '80%', // Adjusts button width
    marginVertical: 10, // Adds space between the buttons
  },
});

export default SignupScreen;
