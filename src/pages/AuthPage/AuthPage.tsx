import { useState, useCallback, useEffect, useContext } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { GlobalStateContext } from "../../context/Context";
import { useUser } from "../../context/UserContext";
import HeaderSection from "./HeaderSection";
import {
  apiUrl,
  getFetchConfig,
  postFetchConfig,
} from "../../utils/fetchConfig";
import BankDetails from "./BankDetails";
import UserDetails from "./UserDetails";
import Notify from "simple-notify";
import "simple-notify/dist/simple-notify.css";
import TalentProfile from "./TalentProfile";
import Cookies from "universal-cookie";
const cookies = new Cookies();

interface HiringDetails {
  whatsApp?: number | string;
  location?: string;
  talentProfile: {
    title?: String;
    description?: String;
    role?: String;
    talents?: String;
  };
}

const initialHiringDetails: HiringDetails = {
  whatsApp: "",
  talentProfile: {
    title: "",
    description: "",
    role: "",
    talents: "",
  },
};

enum View {
  Account = "Account",
  BankDetails = "BankDetails",
  InviteUser = "InviteUser",
  TalentProfile = "TalentProfile",
}

const AuthComponent = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { state, setState } = useContext(GlobalStateContext);
  const { userState, setUserState } = useUser();
  const [hiringDetails, setHiringDetails] = useState<HiringDetails | null>(
    initialHiringDetails
  );
  const [currentView, setCurrentView] = useState<View>(View.Account);
  const [password, setPassword] = useState<string>("");
  const [emailInvite, setEmailInvite] = useState<string>("");

  const locationQuery = searchParams.get("view");

  useEffect(() => {
    location.pathname === "/auth" &&
      locationQuery == null &&
      setCurrentView(View.Account);

    // eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    if (locationQuery === "talent") return setCurrentView(View.TalentProfile);
    // eslint-disable-next-line
  }, [searchParams]);

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
          talentProfile: result.talentProfile
            ? {
                title: result.talentProfile.title,
                description: result.talentProfile.description,
                role: result.talentProfile.role,
                talents: result.talentProfile.talents,
              }
            : null,
        };
      });
      setPassword(result.password);
      setHiringDetails(result.talentProfile);
    } catch (error) {
      console.log("error", error);
    }
  }, [setUserState, userState._id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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

  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    setState({ ...state, isLoggedIn: false });
    setUserState(null);
  };

  return (
    <>
      <div className="container flex flex-col gap-4">
        <nav>
          <ul className="font-bold text-sm p-1.5 bg-white rounded flex items-start gap-1">
            <li className="w-full">
              <button
                className={`text-left px-4 py-3 rounded-md hover:bg-blue-900 whitespace-nowrap w-full ${
                  currentView === View.Account ? "bg-blue-900" : ""
                }`}
                onClick={() => handleViewClick(View.Account)}
              >
                Account
              </button>
            </li>
            <li className="w-full">
              <button
                className={`text-left px-4 py-3 rounded-md hover:bg-blue-900 whitespace-nowrap w-full ${
                  currentView === View.TalentProfile ? "bg-blue-900" : ""
                }`}
                onClick={() => handleViewClick(View.TalentProfile)}
              >
                Talent profile
              </button>
            </li>
            <li className="w-full">
              <button
                className={`text-left px-4 py-3 rounded-md hover:bg-blue-900 whitespace-nowrap w-full ${
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
                  className={`text-left px-4 py-3 rounded-md hover:bg-blue-900 whitespace-nowrap w-full ${
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
        <div className="p-4 bg-white rounded flex flex-col gap-4">
          <div className="flex justify-end items-center">
            <button
              className="btn-chunky-danger text-xs"
              type="submit"
              onClick={() => logout()}
            >
              Logout
            </button>
          </div>
          <div className="col-span-6">
            {currentView === View.InviteUser && (
              <>
                <form
                  className="max-w-[400px] mx-auto p-4 flex flex-col gap-4"
                  onSubmit={(e) => submitFormInviteUser(e)}
                >
                  <div className="flex flex-col gap-2">
                    <label className="subtitle">Invite user:</label>
                    <input
                      className="border-2 border-[#444] p-3 rounded"
                      value={emailInvite}
                      onChange={(e) => setEmailInvite(e.target.value)}
                      type="email"
                      placeholder="Enter email"
                      name="invite_user"
                    />
                  </div>
                  <button
                    className="btn-chunky-primary"
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
                <section className="max-w-[400px] py-12 mx-auto">
                  <UserDetails isPassword={password} />
                </section>
              </>
            )}

            {currentView === View.TalentProfile && (
              <TalentProfile isHiringDetails={hiringDetails} />
            )}

            {currentView === View.BankDetails && <BankDetails />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthComponent;
