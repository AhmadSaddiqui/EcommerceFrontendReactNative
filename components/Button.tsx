import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onPress, children }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1E1E1E', // Dark button background
    borderRadius: 25, // Rounded corners
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Shadow on Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    width: '100%', // Full width for the button
  },
  buttonText: {
    color: '#FFFFFF', // White text color
    fontSize: 18, // Font size
    fontWeight: 'bold', // Bold font
    textAlign: 'center',
  },
});

export default Button;
