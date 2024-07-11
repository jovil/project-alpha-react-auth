import React, { createContext, useState, useContext } from "react";

// Create the context
export const PostsContext = createContext();

// Create the provider component
export const PostsProvider = ({ children }) => {
  const [allPosts, setAllPosts] = useState([]);

  return (
    <PostsContext.Provider value={{ allPosts, setAllPosts }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
};
