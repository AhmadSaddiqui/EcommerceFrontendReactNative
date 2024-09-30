import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAppDispatch } from '../redux/store'; // Make sure you import the typed dispatch
import { login } from '../redux/slices/authSlice';
import { NavigationProp } from '@react-navigation/native';
import SignupScreen from './SignupScreen';

interface LoginScreenProps {
  navigation: NavigationProp<any>; // Define the type for navigation prop
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller' | 'admin'>('buyer'); // Role state

  const dispatch = useAppDispatch(); // Use typed dispatch

  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert('Error', 'Email and Password are required');
      return;
    }
  
    try {
      // Dispatch the login action
      const result = await dispatch(
        login({ email, password, role }) // Ensure to pass the correct types
      ).unwrap(); // Unwrap to handle fulfilled/rejected cases
  
      // If successful, navigate to the Hello screen
      console.log('Login successful', result);
      navigation.navigate('Hello'); // Navigate to the Hello screen
  
    } catch (error) {
      // Handle error if login fails
      if (error instanceof Error) {
        Alert.alert('Login Failed', error.message); // Cast error to Error object
      } else {
        Alert.alert('Login Failed', 'An unexpected error occurred');
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
      <View style={styles.roleContainer}>
        <Button title="Login as Buyer" onPress={() => setRole('buyer')} />
        <Button title="Login as Seller" onPress={() => setRole('seller')} />
        <Button title="Login as Admin" onPress={() => setRole('admin')} />
        
      </View>
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Register" onPress={() => navigation.navigate('Home')} /> 
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
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});

export default LoginScreen;
