import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
//import store from './redux/store'; // Ensure this is the correct path to your Redux store
//import HomeScreen from './screens/HomeScreen'; // Home screen for login/signup selection
import BuyerSignupScreen from './screens/BuyerSignupScreen'; // Buyer signup screen
import SellerSignupScreen from './screens/SellerSignupScreen'; // Seller signup screen
import LoginScreen from './screens/LoginScreen'; // Login screen
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './redux/store';
import BuyerHome from './screens/BuyerHome';
import SignupScreen from './screens/SignupScreen';
import HelloScreen from './screens/HelloScreen';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Initial">
          <Stack.Screen name="Home" component={SignupScreen} options={{ title: 'Welcome' }} />
          <Stack.Screen name="BuyerSignup" component={BuyerSignupScreen} options={{ title: 'Buyer Signup' }} />
          <Stack.Screen name="SellerSignup" component={SellerSignupScreen} options={{ title: 'Seller Signup' }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="Hello" component={HelloScreen} />
         
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
