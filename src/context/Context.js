import React, { createContext, useState, useEffect } from "react";

// Create the context
export const GlobalStateContext = createContext();

// Create the provider component
export const GlobalStateProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const savedState = localStorage.getItem("globalState");
    return savedState
      ? JSON.parse(savedState)
      : {
          isLoggedIn: false,
          postsView: "grid",
          showPostsCaption: false,
          productsView: "grid",
          seriesView: "grid",
          hiringView: "grid",
        };
  });

  useEffect(() => {
    // Save state to local storage whenever it changes
    localStorage.setItem("globalState", JSON.stringify(state));
  }, [state]);

  return (
    <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
