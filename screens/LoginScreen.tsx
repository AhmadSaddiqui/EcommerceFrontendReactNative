import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useAppDispatch } from '../redux/store';
import { login } from '../redux/slices/authSlice';
import { NavigationProp } from '@react-navigation/native';

interface LoginScreenProps {
  navigation: NavigationProp<any>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller' | 'admin'>('buyer');

  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and Password are required');
      return;
    }

    try {
      const result = await dispatch(
        login({ email, password, role })
      ).unwrap();

      console.log('Login successful', result);
      if (role === 'buyer') {
        navigation.navigate('ProductList');
      } else if (role === 'seller') {
        navigation.navigate('SellerHome');
      } else if (role === 'admin') {
        navigation.navigate('AdminDashboard');
      }

    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Login Failed', error.message);
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
        placeholderTextColor="#aaa" 
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#aaa" // Light gray placeholder text
      />
      
      <View style={styles.roleContainer}>
        <TouchableOpacity 
          style={[styles.roleButton, role === 'buyer' && styles.activeRole]} 
          onPress={() => setRole('buyer')}
        >
          <Text style={[styles.roleButtonText, role === 'buyer' && styles.activeRoleText]}>Buyer</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.roleButton, role === 'seller' && styles.activeRole]} 
          onPress={() => setRole('seller')}
        >
          <Text style={[styles.roleButtonText, role === 'seller' && styles.activeRoleText]}>Seller</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.roleButton, role === 'admin' && styles.activeRole]} 
          onPress={() => setRole('admin')}
        >
          <Text style={[styles.roleButtonText, role === 'admin' && styles.activeRoleText]}>Admin</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.registerButton}>
        <Text style={styles.registerText}>Go to Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000000', 
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#444', // Dark border color
    borderRadius: 8,
    backgroundColor: '#1E1E1E', // Dark input background
    color: '#fff', // White text color
    elevation: 1,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  roleButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#1E1E1E', // Dark button background
    elevation: 2,
  },
  roleButtonText: {
    color: '#007BFF', // Button text color
    fontWeight: 'bold',
  },
  activeRole: {
    backgroundColor: '#007BFF', // Active role background
  },
  activeRoleText: {
    color: '#fff', // Active role text color
  },
  loginButton: {
    backgroundColor: '#007BFF', // Button color
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
  },
  loginButtonText: {
    color: '#fff', // Button text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#007BFF', // Register link color
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
