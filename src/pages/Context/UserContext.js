import { createContext, useState, useEffect, useContext } from "react";

export const UserContext = createContext();

const getInitialState = () => {
  try {
    const savedState = localStorage.getItem("userState");
    return savedState
      ? JSON.parse(savedState)
      : {
          _id: undefined,
          user: undefined,
          email: undefined,
          userName: undefined,
          avatar: undefined,
          avatar64: undefined,
        };
  } catch (error) {
    console.error("Error parsing localStorage userState:", error);
    return {
      _id: undefined,
      user: undefined,
      email: undefined,
      userName: undefined,
      avatar: undefined,
      avatar64: undefined,
    };
  }
};

export const UserProvider = ({ children }) => {
  const [userState, setUserState] = useState(getInitialState);

  useEffect(() => {
    try {
      localStorage.setItem("userState", JSON.stringify(userState));
    } catch (error) {
      console.error("Error saving userState to localStorage:", error);
    }
  }, [userState]);

  return (
    <UserContext.Provider value={{ userState, setUserState }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
