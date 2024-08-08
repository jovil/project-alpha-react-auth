import { useState, useCallback, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import HeaderSection from "./HeaderSection";
import HiringDetailsComponent from "./HiringDetails";
import {
  apiUrl,
  getFetchConfig,
  postFetchConfig,
} from "../../utils/fetchConfig";
import BankDetails from "./BankDetails";
import UserDetails from "./UserDetails";
import Notify from "simple-notify";
import "simple-notify/dist/simple-notify.css";

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
  headline?: String;
  subheading?: String;
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
  headline: "",
  subheading: "",
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

enum View {
  Account = "Account",
  UserDetails = "UserDetails",
  BankDetails = "BankDetails",
  InviteUser = "InviteUser",
}

const AuthComponent = () => {
  const { userState, setUserState } = useUser();
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [hiringDetails, setHiringDetails] = useState<HiringDetails | null>(
    initialHiringDetails
  );
  const [currentView, setCurrentView] = useState<View>(View.Account);
  const [password, setPassword] = useState<string>("");
  const [emailInvite, setEmailInvite] = useState<string>("");

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

  const handleViewClick = (view: View) => {
    setCurrentView(view);
  };

  const submitFormInviteUser = async (e: any) => {
    e.preventDefault();
    const url = `${apiUrl}/create/invite`;

    try {
      await fetch(url, postFetchConfig({ email: emailInvite }));
      new Notify({
        title: "Invite code created successfully",
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <div className="container grid grid-cols-12 gap-4">
        <aside className="col-span-3 border border-grey-100 rounded">
          <nav>
            <ul className="p-1.5 bg-white rounded flex flex-col items-start gap-1">
              <li className="w-full">
                <button
                  className={`text-xs text-left px-4 py-3 rounded-md hover:bg-blue-900 whitespace-nowrap w-full ${
                    currentView === View.Account ? "bg-blue-900" : ""
                  }`}
                  onClick={() => handleViewClick(View.Account)}
                >
                  Account
                </button>
              </li>
              <li className="w-full">
                <button
                  className={`text-xs text-left px-4 py-3 rounded-md hover:bg-blue-900 whitespace-nowrap w-full ${
                    currentView === View.UserDetails ? "bg-blue-900" : ""
                  }`}
                  onClick={() => handleViewClick(View.UserDetails)}
                >
                  User details
                </button>
              </li>
              <li className="w-full">
                <button
                  className={`text-xs text-left px-4 py-3 rounded-md hover:bg-blue-900 whitespace-nowrap w-full ${
                    currentView === View.BankDetails ? "bg-blue-900" : ""
                  }`}
                  onClick={() => handleViewClick(View.BankDetails)}
                >
                  Bank account details
                </button>
              </li>
              {userState.email === "hi@jovil.dev" && (
                <li className="w-full">
                  <button
                    className={`text-xs text-left px-4 py-3 rounded-md hover:bg-blue-900 whitespace-nowrap w-full ${
                      currentView === View.InviteUser ? "bg-blue-900" : ""
                    }`}
                    onClick={() => handleViewClick(View.InviteUser)}
                  >
                    Invite user
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </aside>
        <div className="col-span-9">
          {currentView === View.InviteUser && (
            <>
              <form
                className="text-sm max-w-[580px] mx-auto p-4 flex flex-col gap-4"
                onSubmit={(e) => submitFormInviteUser(e)}
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="invite_user">Invite user:</label>
                  <input
                    className="border border-dark/40 p-3 rounded"
                    value={emailInvite}
                    onChange={(e) => setEmailInvite(e.target.value)}
                    type="email"
                    placeholder="Enter email"
                    name="invite_user"
                  />
                </div>
                <button
                  className="btn-primary"
                  onSubmit={(e) => submitFormInviteUser(e)}
                  type="submit"
                >
                  Invite user
                </button>
              </form>
            </>
          )}
          {currentView === View.Account && (
            <>
              <HeaderSection />
              <section className="max-w-[580px] py-16 mx-auto">
                <HiringDetailsComponent
                  isEditing={isEditing}
                  onHandleEditingMode={handleEditingMode}
                  isHiringDetails={hiringDetails}
                  hasHiringDetails={userState.hasHiringDetails}
                />
              </section>
            </>
          )}
          {currentView === View.UserDetails && (
            <UserDetails isPassword={password} />
          )}

          {currentView === View.BankDetails && <BankDetails />}
        </div>
      </div>
    </>
  );
};

export default AuthComponent;
