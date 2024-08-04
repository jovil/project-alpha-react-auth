import { useState, useCallback, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import HeaderSection from "./HeaderSection";
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
          {showUserDetails && (
            <>
              <form className="text-sm max-w-[580px] mx-auto flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label>Email:</label>
                  <input
                    className="border border-dark/40 p-3 rounded"
                    type="email"
                    value={userState.email}
                    placeholder="Enter email"
                    required
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label>Username:</label>
                  <input
                    className="border border-dark/40 p-3 rounded"
                    type="text"
                    value={userState.userName}
                    placeholder="Enter username"
                    required
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label>Password:</label>
                  <input
                    className="border border-dark/40 p-3 rounded"
                    type="password"
                    value={password}
                    placeholder="Password"
                    required
                    disabled
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="state">State / Federal Territory:</label>
                  <select
                    className="border border-dark/40 p-3 rounded"
                    name="state"
                    value={userState.state}
                    required
                    disabled
                  >
                    <option value="Johor">Johor</option>
                    <option value="Kedah">Kedah</option>
                    <option value="Kelantan">Kelantan</option>
                    <option value="Malacca">Malacca</option>
                    <option value="Negeri Sembilan">Negeri Sembilan</option>
                    <option value="Pahang">Pahang</option>
                    <option value="Penang">Penang</option>
                    <option value="Perak">Perak</option>
                    <option value="Perlis">Perlis</option>
                    <option value="Sabah">Sabah</option>
                    <option value="Sarawak">Sarawak</option>
                    <option value="Selangor">Selangor</option>
                    <option value="Terengganu">Terengganu</option>
                    <option value="Kuala lumpur">Kuala Lumpur</option>
                    <option value="Putrajaya">Putrajaya</option>
                    <option value="Labuan">Labuan</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label>City / District:</label>
                  <input
                    className="border border-dark/40 p-3 rounded"
                    type="text"
                    name="city"
                    value={userState.city}
                    placeholder="Enter city/district"
                    required
                    disabled
                  />
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthComponent;
