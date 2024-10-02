import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchCart, removeFromCart } from '../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cart, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCart()); // Fetch cart items on component mount
  }, [dispatch]);

  const handleRemoveItem = async (productId: string) => {
    const buyerId = await AsyncStorage.getItem('buyerId'); // Assuming buyerId is stored in AsyncStorage
    if (!buyerId) {
      Alert.alert('Error', 'Unable to fetch buyer ID');
      return;
    }

    try {
      await dispatch(removeFromCart({ buyerId, productId })).unwrap();
      Alert.alert('Success', 'Item removed from cart');
    } catch {
      Alert.alert('Error', 'Failed to remove item from cart');
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
      <TouchableOpacity onPress={() => handleRemoveItem(item._id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <FlatList
          data={cart}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cartItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  productName: {
    fontSize: 18,
  },
  productPrice: {
    fontSize: 16,
    color: '#555',
  },
  removeButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
  },
});

export default CartScreen;
