import React, { createContext, useState, useContext } from "react";

// Create the context
export const ProductsContext = createContext();

// Create the provider component
export const ProductsProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);

  return (
    <ProductsContext.Provider value={{ allProducts, setAllProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};
