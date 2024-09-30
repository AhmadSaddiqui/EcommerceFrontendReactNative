import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/store'; // Use typed dispatch and selector
import { verifyOTP } from '../redux/slices/authSlice'; // You will need to add this thunk
import { NavigationProp } from '@react-navigation/native';

interface OTPVerificationProps {
  navigation: NavigationProp<any>;
  route: { params: { email: string; role: string } }; // Email and role passed from registration
}

const OTPVerificationScreen: React.FC<OTPVerificationProps> = ({ navigation, route }) => {
  const { email, role } = route.params; // Get email and role from route params
  const [otp, setOtp] = useState('');
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth); // Select auth state

  const handleOTPVerification = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    try {
      const result = await dispatch(
        verifyOTP({ email, otp, role }) // Dispatch the OTP verification action
      ).unwrap();

      Alert.alert('OTP Verification', 'OTP verified successfully!');
      // Navigate to login screen or main screen after successful OTP verification
      navigation.navigate('Login'); // Or any other screen you prefer
    } catch (error) {
      Alert.alert('Verification Failed', 'Invalid OTP or verification failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>OTP Verification</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        autoCapitalize="none"
      />

      {/* Display error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Loading indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Verify OTP" onPress={handleOTPVerification} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default OTPVerificationScreen;
