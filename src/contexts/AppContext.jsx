// src/context/AppContext.js
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { AddressProvider } from "./AddressContext";
import { ProductProvider } from "./ProductContext";
import { HistoryProvider } from "./HistoryContext";

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        <AddressProvider>
          <ProductProvider>
            <HistoryProvider>{children}</HistoryProvider>
          </ProductProvider>
        </AddressProvider>
      </CartProvider>
    </AuthProvider>
  );
};
