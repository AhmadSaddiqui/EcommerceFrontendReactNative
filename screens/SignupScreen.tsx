import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Button from '../components/Button'; // Import your custom Button component

interface SignupScreenProps {
  navigation: NavigationProp<any>;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  // Animation state
  const buttonScale = new Animated.Value(1);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleButtonPress = (route: string) => {
    animateButton();
    // Delay navigation to ensure animation completes
    setTimeout(() => {
      navigation.navigate(route);
    }, 150);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Button onPress={() => handleButtonPress('BuyerSignup')}>
            Register as Buyer
          </Button>
        </Animated.View>
      </View>
      <View style={styles.buttonContainer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Button onPress={() => handleButtonPress('SellerSignup')}>
            Register as Seller
          </Button>
        </Animated.View>
      </View>
      <View style={styles.buttonContainer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Button onPress={() => handleButtonPress('Login')}>
            Login
          </Button>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', // Set the background color to black
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
  },
});

export default SignupScreen;
