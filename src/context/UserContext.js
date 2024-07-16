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
          hasPosted: undefined,
          hasProducts: undefined,
          bankAccountDetails: {
            accountHoldersName: undefined,
            accountNumber: undefined,
            bankName: undefined,
          },
          hiringDetails: {
            email: undefined,
            whatsApp: undefined,
            location: undefined,
            favoriteCharacters: undefined,
            services: [
              { service: "Costume making", serviceAvailable: false },
              { service: "Makeup and/or prosthetics", serviceAvailable: false },
              { service: "Performance/Acting", serviceAvailable: false },
              { service: "Voice acting", serviceAvailable: false },
              { service: "Photography", serviceAvailable: false },
            ],
            otherServices: undefined,
            availability: [
              { availabilityName: "Conventions", isAvailable: false },
              { availabilityName: "Photoshoots", isAvailable: false },
              { availabilityName: "Promotional events", isAvailable: false },
              {
                availabilityName: "Online appearances/streams",
                isAvailable: false,
              },
            ],
            otherAvailability: undefined,
            preferredSchedule: undefined,
            travelAvailability: undefined,
            editingMode: true,
          },
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
      hasPosted: undefined,
      hasProducts: undefined,
      bankAccountDetails: {
        accountHoldersName: undefined,
        accountNumber: undefined,
        bankName: undefined,
      },
      hiringDetails: {
        email: undefined,
        whatsApp: undefined,
        location: undefined,
        favoriteCharacters: undefined,
        services: [
          { service: "Costume making", serviceAvailable: false },
          { service: "Makeup and/or prosthetics", serviceAvailable: false },
          { service: "Performance/Acting", serviceAvailable: false },
          { service: "Voice acting", serviceAvailable: false },
          { service: "Photography", serviceAvailable: false },
        ],
        otherServices: undefined,
        availability: [
          { availabilityName: "Conventions", isAvailable: false },
          { availabilityName: "Photoshoots", isAvailable: false },
          { availabilityName: "Promotional events", isAvailable: false },
          {
            availabilityName: "Online appearances/streams",
            isAvailable: false,
          },
        ],
        otherAvailability: undefined,
        preferredSchedule: undefined,
        travelAvailability: undefined,
        editingMode: true,
      },
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
