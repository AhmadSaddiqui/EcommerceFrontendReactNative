import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { useAppDispatch } from '../redux/store'; // Import typed dispatch
import { registerBuyer } from '../redux/slices/authSlice';
import { NavigationProp } from '@react-navigation/native';

interface BuyerSignupScreenProps {
  navigation: NavigationProp<any>; // Define the type for navigation prop
}

const BuyerSignupScreen: React.FC<BuyerSignupScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const dispatch = useAppDispatch(); // Typed dispatch

  const handleSignup = async () => {
    // Basic validation
    if (!email || !password || !firstName || !lastName || !username || !address || !phoneNumber) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      // Dispatch the register action
      const result = await dispatch(
        registerBuyer({
          email,
          password,
          firstName,
          lastName,
          username,
          address,
          phoneNumber,
          role: 'buyer', // Buyer role
        })
      ).unwrap(); // Unwrap to handle fulfilled/rejected cases

      // If successful, navigate to login screen
      navigation.navigate('Login');
    } catch (error) {
      // Handle error if registration fails
      if (error instanceof Error) {
        Alert.alert('Registration Failed', error.message); // Cast error to Error object
      } else {
        Alert.alert('Registration Failed', 'An unexpected error occurred');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <Button title="Register" onPress={handleSignup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default BuyerSignupScreen;
