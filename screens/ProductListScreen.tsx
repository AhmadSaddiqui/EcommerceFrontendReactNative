import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Image, 
  TextInput,
  Alert
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchProducts, searchProductsByName } from '../redux/slices/authSlice'; // Ensure correct import
import { NavigationProp } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'; // Import image picker

interface ProductListProps {
  navigation: NavigationProp<any>;
}

const ProductListScreen: React.FC<ProductListProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { products, filteredProducts, loading, error } = useAppSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State to hold the image URI

  useEffect(() => {
    dispatch(fetchProducts()); // Fetch products when the component mounts
  }, [dispatch]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      dispatch(searchProductsByName(text.trim())); // Dispatch search action when there's input
    } else {
      dispatch(fetchProducts()); // Fetch all products if search query is empty
    }
  };

  // Function to handle image selection
  const handleImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose an option to upload image',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  // Open camera
  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: true,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          console.log('Camera error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const imageUri = response.assets[0].uri ? response.assets[0].uri : null; // Handle potential undefined
          setSelectedImage(imageUri); // Set the image URI if available
        }
      }
    );
  };
  
  // Open image gallery
  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled gallery');
        } else if (response.errorCode) {
          console.log('Gallery error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const imageUri = response.assets[0].uri ? response.assets[0].uri : null; // Handle potential undefined
          setSelectedImage(imageUri); // Set the image URI if available
        }
      }
    );
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { product: item })} // Navigate to product details
    >
      {item.image && ( // Check if image exists and render it
        <Image
          source={{ uri: `data:image/png;base64,${item.image}` }} // Assuming the image is stored as base64
          style={styles.productImage}
        />
      )}
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  // Use `filteredProducts` if search query exists, otherwise use `products`
  const dataToRender = searchQuery.trim() ? filteredProducts : products;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by product name"
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#aaa" // Light gray placeholder text
        />
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => navigation.navigate('CartScreen')} // Navigate to cart screen
        >
          <Text style={styles.cartButtonText}>Go to Cart</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.imageUploadButton} onPress={handleImagePicker}>
        <Text style={styles.imageUploadText}>Upload Image</Text>
      </TouchableOpacity>
      
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
      )}

      <FlatList
        data={dataToRender} // Render search results or all products
        renderItem={renderItem}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F7F9FC', // Light background for better contrast
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Add space between search input and cart button
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', // Add a bottom border for separation
    paddingBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderColor: '#007BFF', // Blue border color
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff', // White input background for better contrast
  },
  cartButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#007BFF', // Button color
    borderRadius: 5,
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageUploadButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  imageUploadText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  listContainer: {
    justifyContent: 'space-between',
  },
  productCard: {
    flex: 1,
    padding: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10, // Rounded corners
    alignItems: 'center',
    backgroundColor: '#ffffff',
    elevation: 2, // Shadow effect for better depth
  },
  productImage: {
    width: '100%',
    height: 120,
    marginBottom: 10,
    resizeMode: 'cover',
    borderRadius: 10, // Rounded corners for images
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333', // Darker text color for better readability
  },
  productPrice: {
    fontSize: 14,
    color: '#555',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  loader: {
    marginTop: 20,
  },
});

export default ProductListScreen;
