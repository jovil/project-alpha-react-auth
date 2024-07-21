import { useState, useCallback, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import HeaderSection from "./HeaderSection";
import CreatePost from "./CreatePost";
import CreateProduct from "./CreateProduct";
import HiringDetailsComponent from "./HiringDetails";
import { getFetchConfig } from "../../utils/fetchConfig";
import BankDetails from "./BankDetails";

interface PreferredSchedule {
  type: "weekdays" | "weekends" | "flexible";
}

interface TravelAvailability {
  type: "local" | "national" | "international";
}

interface Services {
  service: string;
  serviceAvailable: boolean;
}

interface Availability {
  availabilityName: string;
  isAvailable: boolean;
}

interface HiringDetails {
  email?: string;
  whatsApp?: number | string;
  location?: string;
  favoriteCharacters?: string;
  services?: Services[];
  otherServices?: string;
  availability?: Availability[];
  otherAvailability?: string;
  preferredSchedule?: PreferredSchedule;
  travelAvailability?: TravelAvailability;
}

const initialServices: Services[] = [
  { service: "Costume making", serviceAvailable: false },
  { service: "Makeup and/or prosthetics", serviceAvailable: false },
  { service: "Performance/Acting", serviceAvailable: false },
  { service: "Voice acting", serviceAvailable: false },
  { service: "Photography", serviceAvailable: false },
];

const initialAvailability: Availability[] = [
  { availabilityName: "Conventions", isAvailable: false },
  { availabilityName: "Photoshoots", isAvailable: false },
  { availabilityName: "Promotional events", isAvailable: false },
  { availabilityName: "Online appearances/streams", isAvailable: false },
];

const initialHiringDetails: HiringDetails = {
  email: "",
  whatsApp: "",
  location: "",
  favoriteCharacters: "",
  services: initialServices,
  otherServices: "",
  availability: initialAvailability,
  otherAvailability: "",
  preferredSchedule: { type: "weekdays" },
  travelAvailability: { type: "local" },
};

const AuthComponent = () => {
  const { userState, setUserState } = useUser();
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [hiringDetails, setHiringDetails] = useState<HiringDetails | null>(
    initialHiringDetails
  );

  const handleEditingMode = (value: boolean) => {
    setIsEditing(value);
  };

  const fetchUser = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/user/${userState._id}`;

    try {
      const response = await fetch(url, getFetchConfig);
      const result = await response.json();
      console.log("result", result);
      setUserState((prev: any) => {
        return {
          ...prev,
          avatar: result.avatar,
          bankAccountDetails: result.bankAccountDetails
            ? {
                accountHoldersName:
                  result.bankAccountDetails?.accountHoldersName,
                accountNumber: result.bankAccountDetails?.accountNumber,
                bankName: result.bankAccountDetails?.bankName,
              }
            : null,
          hasHiringDetails: result.hasHiringDetails,
        };
      });

      if (result.hasHiringDetails) {
        setHiringDetails(result.hiringDetails);
        setIsEditing(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [setUserState, userState._id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    setIsEditing(true);
  }, []);

  return (
    <>
      <HeaderSection />
      <section className="flex justify-center gap-6 py-16">
        <CreatePost />
        <CreateProduct />
      </section>
      <section className="max-w-[580px] mx-auto">
        <BankDetails />
        <HiringDetailsComponent
          isEditing={isEditing}
          onHandleEditingMode={handleEditingMode}
          isHiringDetails={hiringDetails}
          hasHiringDetails={userState.hasHiringDetails}
        />
      </section>
    </>
  );
};

export default AuthComponent;
