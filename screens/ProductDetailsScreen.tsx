import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useAppDispatch } from '../redux/store';
import { placeOrder, addToCart } from '../redux/slices/authSlice'; 
import { NavigationProp } from '@react-navigation/native'; 

interface ProductDetailsProps {
  route: any;
  navigation: NavigationProp<any>; // Add navigation prop
}

const ProductDetailsScreen: React.FC<ProductDetailsProps> = ({ route, navigation }) => {
  const { product } = route.params; 
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1); 

  const handleBuyNow = async () => {
    try {
      await dispatch(placeOrder({ productId: product.id, quantity })).unwrap(); 
      Alert.alert('Success', 'Order placed successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to place the order.');
    }
  };

  const handleAddToCart = async () => {
    try {
      await dispatch(addToCart({ product: product.id, quantity })).unwrap(); 
      Alert.alert(
        'Success', 
        'Product added to cart!', 
        [{ text: 'Go to Cart', onPress: () => navigation.navigate('CartScreen') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add product to cart.');
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1); 
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1)); 

  return (
    <View style={styles.container}>
      {product.image && (
        <Image
          source={{ uri: `data:image/png;base64,${product.image}` }} 
          style={styles.productImage}
        />
      )}
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleBuyNow}>
        <Text style={styles.buttonText}>Buy Now</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F9FC', // Light background for better contrast
  },
  productImage: {
    width: '100%', 
    height: 250, // Increased height for better visibility
    resizeMode: 'cover', 
    borderRadius: 10, // Rounded corners
    marginBottom: 15,
    elevation: 5, // Shadow for depth
  },
  productName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333', // Darker text for better readability
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 16,
    color: '#555', // Lighter text color for description
    marginVertical: 10,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF', // Primary color for price
    marginVertical: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'center', // Center the quantity control
  },
  quantityText: {
    fontSize: 20,
    marginHorizontal: 15,
    color: '#333', // Dark text for quantity
  },
  quantityButton: {
    padding: 12,
    backgroundColor: '#007BFF', // Primary color for buttons
    borderRadius: 5,
    width: 40, // Fixed width for consistency
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#007BFF', // Primary color for main buttons
    borderRadius: 5,
    alignItems: 'center',
    elevation: 3, // Shadow for depth
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetailsScreen;
