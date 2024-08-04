import { useState, useCallback, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import HeaderSection from "./HeaderSection";
import HiringDetailsComponent from "./HiringDetails";
import { getFetchConfig } from "../../utils/fetchConfig";
import BankDetails from "./BankDetails";
import UserDetails from "./UserDetails";

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
  const [showAccount, setShowAccount] = useState<boolean>(true);
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const handleEditingMode = (value: boolean) => {
    setIsEditing(value);
  };

  const fetchUser = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/user/${userState._id}`;

    try {
      const response = await fetch(url, getFetchConfig);
      const result = await response.json();
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
      setPassword(result.password);

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
      <div className="container grid grid-cols-12 gap-4">
        <aside className="col-span-3 border border-grey rounded">
          <nav>
            <ul className="p-1.5 bg-white rounded flex flex-col items-start gap-1">
              <li className="w-full">
                <button
                  className={`text-xs text-left px-4 py-3 rounded-md hover:bg-blue-900 whitespace-nowrap w-full ${
                    showAccount ? "bg-blue-900" : ""
                  }`}
                  onClick={() => {
                    setShowAccount(true);
                    setShowUserDetails(false);
                  }}
                >
                  Account
                </button>
              </li>
              <li className="w-full">
                <button
                  className={`text-xs text-left px-4 py-3 rounded-md hover:bg-blue-900 whitespace-nowrap w-full ${
                    showUserDetails ? "bg-blue-900" : ""
                  }`}
                  onClick={() => {
                    setShowAccount(false);
                    setShowUserDetails(true);
                  }}
                >
                  User details
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        <div className="col-span-9">
          {showAccount && (
            <>
              <HeaderSection />
              <section className="max-w-[580px] py-16 mx-auto">
                <BankDetails />
                <HiringDetailsComponent
                  isEditing={isEditing}
                  onHandleEditingMode={handleEditingMode}
                  isHiringDetails={hiringDetails}
                  hasHiringDetails={userState.hasHiringDetails}
                />
              </section>
            </>
          )}
          {showUserDetails && <UserDetails isPassword={password} />}
        </div>
      </div>
    </>
  );
};

export default AuthComponent;
