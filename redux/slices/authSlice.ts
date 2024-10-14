import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the initial state for authSlice
interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  products: any[];
  filteredProducts: any[]; // Add a separate list for filtered search results
  cart: any[];
  order: any | null;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
  products: [],
  filteredProducts: [], // Empty filtered product list initially
  cart: [],
  order: null,
};

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, role }: { email: string; password: string; role: string }, thunkAPI) => {
    try {
      const response = await api.post(`/auth/login`, { email, password, role });
      const token = response.data.token;
      await AsyncStorage.setItem('token', token);
      return token;
    } catch (error) {
      return thunkAPI.rejectWithValue('Invalid credentials');
    }
  }
);

// Async thunk for seller registration
export const registerSeller = createAsyncThunk(
  'auth/registerSeller',
  async (sellerData: any, thunkAPI) => {
    try {
      const response = await api.post(`/sellers/register`, sellerData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Seller registration failed');
    }
  }
);

// Async thunk for buyer registration
export const registerBuyer = createAsyncThunk(
  'auth/registerBuyer',
  async (buyerData: any, thunkAPI) => {
    try {
      const response = await api.post(`/buyers/register`, buyerData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Buyer registration failed');
    }
  }
);

// Async thunk for OTP verification
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp, role }: { email: string; otp: string; role: string }, thunkAPI) => {
    try {
      const response = await api.post(`/auth/otp/verify`, { email, otp, role });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('OTP verification failed');
    }
  }
);

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk('buyer/fetchProducts', async (_, thunkAPI) => {
  try {
    const response = await api.get('/products');
    return response.data; // Assuming the response returns a list of products
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to fetch products');
  }
});

// Async thunk for searching products by name
export const searchProductsByName = createAsyncThunk(
  'buyer/searchProductsByName',
  async (title: string, thunkAPI) => {
    try {
      const response = await api.get(`/products/name/${title}`);
      return response.data; // Assuming the response returns the list of matching products
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to search products');
    }
  }
);

// Async thunk for adding product to the cart
export const addToCart = createAsyncThunk(
  'buyer/addToCart',
  async ({ product, quantity }: { product: string; quantity: number }, thunkAPI) => {
    try {
      const response = await api.post(`/cart/add`, { product, quantity }); // Adjusted field name from productId to product
      return response.data; // Return the updated cart
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to add product to cart');
    }
  }
);

// Async thunk for fetching the cart
export const fetchCart = createAsyncThunk('buyer/fetchCart', async (_, thunkAPI) => {
  try {
    const response = await api.get('/cart');
    return response.data; // Assuming the response returns the cart
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to fetch cart');
  }
});

// Async thunk for removing an item from the cart
export const removeFromCart = createAsyncThunk(
  'buyer/removeFromCart',
  async ({ buyerId, productId }: { buyerId: string; productId: string }, thunkAPI) => {
    try {
      const response = await api.delete(`/cart/${buyerId}/items/${productId}`);
      return response.data; // Return the updated cart after removal
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to remove product from cart');
    }
  }
);

// Async thunk for placing an order
export const placeOrder = createAsyncThunk('buyer/placeOrder', async (orderData: any, thunkAPI) => {
  try {
    const response = await api.post('/orders', orderData); // Assuming orderData contains necessary order info
    return response.data; // Assuming the response contains the order details
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to place order');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.products = [];
      state.filteredProducts = []; // Clear the filtered products on logout
      state.cart = [];
      state.order = null;
      AsyncStorage.removeItem('token');
    },
    clearSearchResults: (state) => {
      state.filteredProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Login reducers
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Seller registration reducers
      .addCase(registerSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerSeller.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Buyer registration reducers
      .addCase(registerBuyer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerBuyer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerBuyer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // OTP verification reducers
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch products reducers
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Search products by name reducers
      .addCase(searchProductsByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProductsByName.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProducts = action.payload; // Update with search results
      })
      .addCase(searchProductsByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add to cart reducers
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch cart reducers
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Remove from cart reducers
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload; // Update cart after removal
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Place order reducers
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearSearchResults } = authSlice.actions;

export default authSlice.reducer;
