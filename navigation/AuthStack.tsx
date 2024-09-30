import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your screens
import InitialScreen from '../screens/InitialScreen';
import SignupScreen from '../screens/SignupScreen';
import BuyerSignupScreen from '../screens/BuyerSignupScreen';
import SellerSignupScreen from '../screens/SellerSignupScreen';
import LoginScreen from '../screens/LoginScreen';
import BuyerHome from '../screens/BuyerHome';
import SellerHome from '../screens/SellerHome';
import AdminDashboard from '../screens/AdminDashboard';
import WriteOTPScreen from '../screens/WriteOTPScreen'; // Import the OTP screen

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Initial">
      <Stack.Screen name="Initial" component={InitialScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="BuyerSignup" component={BuyerSignupScreen} />
      <Stack.Screen name="SellerSignup" component={SellerSignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="BuyerHome" component={BuyerHome} />
      <Stack.Screen name="SellerHome" component={SellerHome} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      
      {/* Add the OTP screen, making sure the route can receive necessary params like email and role */}
      
    </Stack.Navigator>
  );
};

export default AuthStack;
