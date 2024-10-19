import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, Alert, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProductListProps {
  navigation: NavigationProp<any>;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

const ProductListScreen: React.FC<ProductListProps> = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products when component mounts
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token used for fetching products:', token);

        const response = await axios.get('http://10.0.2.2:3000/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setProducts(response.data);
        } else {
          setError('No products found');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

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

  const openCamera = () => {
    launchCamera({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0]?.uri ?? null;
        setSelectedImage(imageUri);
        handleGenerateTags(imageUri);
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0]?.uri ?? null;
        setSelectedImage(imageUri);
        handleGenerateTags(imageUri);
      }
    });
  };

  const handleGenerateTags = async (imageUri: string | null) => {
    if (!imageUri) return;

    try {
      setLoading(true);
      setError(null);

      const base64Image = await uriToBase64(imageUri);

      const tagsResponse = await generateTagsFromImagga(base64Image);

      const tags = tagsResponse.result.tags.map((tag: any) => tag.tag.en);
      console.log('Generated Tags:', tags);

      handleSearchByTags(tags);
    } catch (err) {
      console.error('Error generating tags from image:', err);
      setError('Error generating tags');
      setLoading(false);
    }
  };

  const generateTagsFromImagga = async (base64Image: string) => {
    const apiUrl = 'https://api.imagga.com/v2/tags';
    const authHeader = 'Basic ' + btoa(`acc_2d1b8c44c6a251d:a4bece68eb91e737f351872f7b5a7087`); // Your Imagga API key and secret

    const formData = new FormData();
    formData.append('image_base64', base64Image);

    const response = await axios.post(apiUrl, formData, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  };

  const handleSearchByTags = async (tags: string[]) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token used for search:', token);

      const productsResponse = await axios.get('http://10.0.2.2:3000/products/search/tags', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { tags },
      });

      if (productsResponse.data) {
        setProducts(productsResponse.data);
      } else {
        setError('No products found');
      }
    } catch (err) {
      //console.error('Error searching products by tags:', err);
      setError('no products');
    } finally {
      setLoading(false);
    }
  };

  const uriToBase64 = async (uri: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      fetch(uri)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        })
        .catch(error => reject(error));
    });
  };

  const handleAddToCart = (product: Product) => {
    Alert.alert('Add to Cart', `Product "${product.name}" added to cart.`);
  };

  const handleBuyNow = (product: Product) => {
    Alert.alert('Buy Now', `Proceeding to buy "${product.name}".`);
    // Navigate to the checkout screen if implemented
  };

  // Function to navigate to product details
  const navigateToProductDetails = (product: Product) => {
    navigation.navigate('ProductDetails', { product });  // Pass product details to ProductDetails screen
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity onPress={() => navigateToProductDetails(item)}>
      <View style={styles.productCard}>
        {item.image && <Image source={{ uri: `data:image/png;base64,${item.image}` }} style={styles.productImage} />}
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>
          {item.price !== undefined && !isNaN(item.price) ? `$${item.price.toFixed(2)}` : 'Price not available'}
        </Text>
        {/* Add buttons below the product details */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buyNowButton} onPress={() => handleBuyNow(item)}>
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddToCart(item)}>
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageUploadButton} onPress={handleImagePicker}>
        <Text style={styles.imageUploadText}>Upload Image to Search</Text>
      </TouchableOpacity>

      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.selectedImage} />}

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id ? item.id : index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default ProductListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#1a1a1a',
  },
  imageUploadButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
    alignItems: 'center',
  },
  imageUploadText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  productCard: {
    flex: 1,
    margin: 5,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
  productName: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  productPrice: {
    color: '#007BFF',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buyNowButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: '#ffc107',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
