// types.ts or navigationTypes.ts
export type RootStackParamList = {
    Initial: undefined; // No params
    Signup: undefined; // No params
    BuyerSignup: undefined; // No params
    SellerSignup: undefined; // No params
    Login: undefined; // No params
    BuyerHome: undefined; // No params
    SellerHomes: undefined; // No params
    AdminDashboard: undefined; // No params
    ProductList: undefined;
    ProductDetailsScreen: { product: { id: string; name: string; description: string; price: number } };
     // Define the product param
     CartScreen : undefined;
  };
  