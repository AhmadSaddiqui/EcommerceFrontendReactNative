import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, Alert, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your Imagga API Key and Secret
const imaggaApiKey = 'acc_2d1b8c44c6a251d';
const imaggaApiSecret = 'a4bece68eb91e737f351872f7b5a7087';

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
        // Retrieve token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        console.log('Token used for fetching products:', token); // Debugging token

        // Fetch all products
        const response = await axios.get('http://10.0.2.2:3000/products', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        });

        if (response.data) {
          setProducts(response.data); // Set fetched products
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

      // Convert image to base64
      const base64Image = await uriToBase64(imageUri);

      // Send base64 image to Imagga API to generate tags
      const tagsResponse = await generateTagsFromImagga(base64Image);

      const tags = tagsResponse.result.tags.map((tag: any) => tag.tag.en);
      console.log('Generated Tags:', tags); 
      // After generating tags, proceed to search products by these tags
      handleSearchByTags(tags);

    } catch (err) {
      console.error('Error generating tags from image:', err);
      setError('Error generating tags');
      setLoading(false);
    }
  };

  const generateTagsFromImagga = async (base64Image: string) => {
    const apiUrl = 'https://api.imagga.com/v2/tags';
    const authHeader = 'Basic ' + btoa(`${imaggaApiKey}:${imaggaApiSecret}`);

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
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      console.log('Token used for search:', token); // Debugging token

      // Search products by tags (adding the token in the request header)
      const productsResponse = await axios.get('http://10.0.2.2:3000/products/search/tags', {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
        params: { tags },
      });

      if (productsResponse.data) {
        setProducts(productsResponse.data); // Update products with search results
      } else {
        setError('No products found');
      }
    } catch (err) {
      console.error('Error searching products by tags:', err);
      setError('Error searching products');
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

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate('ProductDetails', { product: item })}>
      {item.image && <Image source={{ uri: `data:image/png;base64,${item.image}` }} style={styles.productImage} />}
      <Text style={styles.productName}>{item.name}</Text>
      {/* Ensure price is defined and is a number before calling toFixed */}
      <Text style={styles.productPrice}>
        {item.price !== undefined && !isNaN(item.price) ? `$${item.price.toFixed(2)}` : 'Price not available'}
      </Text>
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
  keyExtractor={(item, index) => item.id ? item.id : index.toString()} // Use index as fallback if item.id is missing or not unique
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
  },
  imageUploadButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  imageUploadText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  productCard: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  productName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    color: '#007BFF',
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
