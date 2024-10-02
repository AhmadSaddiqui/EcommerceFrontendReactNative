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
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import ProductListScreen from '../screens/ProductListScreen';
import { RootStackParamList } from './navigationTypes';
import CartScreen from '../screens/CartScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();

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
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />


    </Stack.Navigator>
  );
};


export default AuthStack;
