import { useState, useCallback, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import HeaderSection from "./HeaderSection";
import CreatePost from "./CreatePost";
import CreateProduct from "./CreateProduct";
import Accordion from "./Accordion";
import loading from "../../assets/images/loading.gif";
import { getFetchConfig } from "../../utils/fetchConfig";

interface BankDetails {
  accountHoldersName: string;
  bankName: string;
  accountNumber: number | string;
}

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
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountHoldersName: "",
    bankName: "",
    accountNumber: "",
  });
  const [isSavingBankDetails, setIsSavingBankDetails] = useState(false);
  const [showSavedBankDetailsMessage, setShowSavedBankDetailsMessage] =
    useState(false);
  const [hiringDetails, setHiringDetails] = useState<HiringDetails | null>(
    initialHiringDetails
  );
  const [isSavingHiringDetails, setIsSavingHiringDetails] = useState(false);
  const [showSavedHiringDetailsMessage, setShowSavedHiringDetailsMessage] =
    useState(false);
  const [showSavedMessageBankDetails, setShowSavedMessageBankDetails] =
    useState(false);
  const [showSavedMessageHiringDetails, setShowSavedMessageHiringDetails] =
    useState(false);

  const fetchUser = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/user/${userState._id}`;

    try {
      const response = await fetch(url, getFetchConfig);
      const result = await response.json();
      console.log("result", result);
      setUserState((prev: any) => {
        return {
          ...prev,
          avatar64: result.avatar,
          bankAccountDetails: result.bankAccountDetails
            ? {
                accountHoldersName:
                  result.bankAccountDetails?.accountHoldersName,
                accountNumber: result.bankAccountDetails?.accountNumber,
                bankName: result.bankAccountDetails?.bankName,
              }
            : null,
        };
      });

      const isHiringDetailsEmpty =
        !result.hiringDetails ||
        (!result.hiringDetails.email &&
          !result.hiringDetails.whatsApp &&
          !result.hiringDetails.location &&
          !result.hiringDetails.favoriteCharacters &&
          (!result.hiringDetails.services ||
            result.hiringDetails.services.length === 0) &&
          !result.hiringDetails.otherServices &&
          (!result.hiringDetails.availability ||
            result.hiringDetails.availability.length === 0) &&
          !result.hiringDetails.otherAvailability &&
          !result.hiringDetails.preferredSchedule &&
          !result.hiringDetails.travelAvailability);

      if (!isHiringDetailsEmpty) {
        setHiringDetails(result.hiringDetails);
        setIsEditing(false);
      } else {
        setHiringDetails(initialHiringDetails);
        setIsEditing(true);
      }

      setShowSavedMessageBankDetails(result.bankAccountDetails ? true : false);
      setShowSavedMessageHiringDetails(result.hasHiringDetails ? true : false);
    } catch (error) {
      console.log("error", error);
    }
  }, [setUserState, userState._id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    setHiringDetails(initialHiringDetails);
    setIsEditing(true);
  }, []);

  const submitBankDetails = async (e: any) => {
    e.preventDefault();
    setIsSavingBankDetails(true);
    const postData = {
      name: bankDetails?.accountHoldersName,
      bank: bankDetails?.bankName,
      account: bankDetails?.accountNumber,
    };
    const url = `${process.env.REACT_APP_API_URL}/user/update/bankDetails/${userState._id}`;
    const configuration = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    };

    try {
      await fetch(url, configuration);
      setIsSavingBankDetails(false);
      setShowSavedBankDetailsMessage(true);
      setTimeout(() => {
        setShowSavedBankDetailsMessage(false);
        window.location.reload();
      }, 800);
    } catch (error) {
      console.log("error", error);
    }
  };

  const editBankDetails = (e: any) => {
    e.preventDefault();
    setBankDetails((prev: any) => {
      return {
        ...prev,
        accountHoldersName: userState.bankAccountDetails?.accountHoldersName,
        bankName: userState.bankAccountDetails?.bankName,
        accountNumber: userState.bankAccountDetails?.accountNumber,
      };
    });

    setUserState((prev: any) => {
      return {
        ...prev,
        bankAccountDetails: {
          accountHoldersName: undefined,
          accountNumber: undefined,
          bankName: undefined,
        },
      };
    });
  };

  const handleChangeBankDetailsInput = (e: any) => {
    const { name, value } = e.target;

    setBankDetails((prev: any) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const editHiringDetails = (e: any) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleChangeHiringDetailsInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setHiringDetails((prev) => ({
      ...(prev || {}),
      [name]: value,
    }));
  };

  const handleServices = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setHiringDetails((prev) => ({
      ...prev!,
      services: prev!.services!.map((service) =>
        service.service === name
          ? { ...service, serviceAvailable: checked }
          : service
      ),
    }));
  };

  const handleHiringInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setHiringDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvailability = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setHiringDetails((prev) => ({
      ...prev!,
      availability: prev!.availability!.map((available) =>
        available.availabilityName === name
          ? { ...available, isAvailable: checked }
          : available
      ),
    }));
  };

  const handleChangePreferredSchedule = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;

    setHiringDetails((prev: any) => ({
      ...prev!,
      preferredSchedule: {
        type: value,
      },
    }));
  };

  const handleChangeTravelAvailability = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;

    setHiringDetails((prev: any) => ({
      ...prev!,
      travelAvailability: {
        type: value,
      },
    }));
  };

  const submitHiringDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHiringDetails(true);

    if (!hiringDetails) {
      // Handle case where hiringDetails is not defined
      setIsSavingHiringDetails(false);
      return;
    }

    const postData = {
      email: hiringDetails.email || "",
      whatsApp: hiringDetails.whatsApp || "",
      location: hiringDetails.location || "",
      favoriteCharacters: hiringDetails.favoriteCharacters || "",
      services:
        hiringDetails.services?.map((service) => ({
          service: service.service,
          serviceAvailable: service.serviceAvailable,
        })) || [],
      otherServices: hiringDetails.otherServices || "",
      availability:
        hiringDetails.availability?.map((available) => ({
          availabilityName: available.availabilityName,
          isAvailable: available.isAvailable,
        })) || [],
      otherAvailability: hiringDetails.otherAvailability || "",
      preferredSchedule: hiringDetails.preferredSchedule || {
        type: "weekdays",
      },
      travelAvailability: hiringDetails.travelAvailability || { type: "local" },
      hasHiringDetails: true,
    };

    const url = `${process.env.REACT_APP_API_URL}/user/update/hiringDetails/${userState._id}`;
    const configuration = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    };

    try {
      console.log("postData", postData);
      await fetch(url, configuration);
      setIsSavingHiringDetails(false);
      setShowSavedHiringDetailsMessage(true);
      setTimeout(() => {
        setShowSavedHiringDetailsMessage(false);
        window.location.reload();
      }, 800);
    } catch (error) {
      console.log("error", error);
      setIsSavingHiringDetails(false);
    }
  };

  return (
    <>
      <HeaderSection />
      <section className="flex justify-center gap-6 py-16">
        <CreatePost />
        <CreateProduct />
      </section>
      <section className="max-w-[580px] mx-auto">
        <Accordion
          title="Add your bank account details for payouts"
          isDetailsSaved={showSavedMessageBankDetails}
        >
          <form className="flex flex-col gap-4" onSubmit={submitBankDetails}>
            <div className="flex flex-col gap-2">
              <label>Account holder's name:</label>
              <input
                className="border border-dark/40 p-3 rounded"
                type="text"
                placeholder="Account holder's name"
                name="accountHoldersName"
                value={
                  userState.bankAccountDetails?.accountHoldersName
                    ? userState.bankAccountDetails?.accountHoldersName
                    : bankDetails?.accountHoldersName
                }
                onChange={handleChangeBankDetailsInput}
                required
                autoFocus
                disabled={
                  userState.bankAccountDetails?.accountHoldersName
                    ? true
                    : false
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Bank name:</label>
              <input
                className="border border-dark/40 p-3 rounded"
                type="text"
                placeholder="Bank name"
                name="bankName"
                value={
                  userState.bankAccountDetails?.bankName
                    ? userState.bankAccountDetails?.bankName
                    : bankDetails.bankName
                }
                onChange={handleChangeBankDetailsInput}
                required
                disabled={userState.bankAccountDetails?.bankName ? true : false}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Account number:</label>
              <input
                className="border border-dark/40 p-3 rounded"
                type="number"
                placeholder="Account number"
                name="accountNumber"
                value={
                  userState.bankAccountDetails?.accountNumber
                    ? userState.bankAccountDetails?.accountNumber
                    : bankDetails.accountNumber
                }
                onChange={handleChangeBankDetailsInput}
                required
                disabled={
                  userState.bankAccountDetails?.accountNumber ? true : false
                }
              />
            </div>
            {userState.bankAccountDetails?.accountHoldersName &&
            userState.bankAccountDetails?.bankName &&
            userState.bankAccountDetails?.accountNumber ? (
              <>
                <button
                  onClick={editBankDetails}
                  className="btn-primary flex justify-center items-center"
                >
                  Edit
                </button>
              </>
            ) : (
              <>
                <button
                  onSubmit={submitBankDetails}
                  className="btn-primary flex justify-center items-center"
                  type="submit"
                >
                  {showSavedBankDetailsMessage ? (
                    "Saved!"
                  ) : (
                    <>
                      {isSavingBankDetails ? (
                        <img className="w-6 h-6" src={loading} alt="" />
                      ) : (
                        "Save"
                      )}
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </Accordion>
        <Accordion
          title="Add a “Hire Me” button to your profile"
          isDetailsSaved={showSavedMessageHiringDetails}
        >
          <p className="text-dark/80 mb-8 max-w-[480px]">
            Let fans and potential clients know you're available for gigs,
            events, and photoshoots!
          </p>
          <form className="flex flex-col gap-4" onSubmit={submitHiringDetails}>
            <div className="flex flex-col gap-2">
              <label>Email address:</label>
              <input
                className="border border-dark/40 p-3 rounded"
                type="text"
                placeholder="Email address"
                name="email"
                value={hiringDetails?.email}
                onChange={handleChangeHiringDetailsInput}
                required
                disabled={!isEditing}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>WhatsApp:</label>
              <input
                className="border border-dark/40 p-3 rounded"
                type="number"
                placeholder="Phone number"
                name="whatsApp"
                value={hiringDetails?.whatsApp}
                onChange={handleChangeHiringDetailsInput}
                required
                disabled={!isEditing}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Location:</label>
              <input
                className="border border-dark/40 p-3 rounded"
                type="text"
                placeholder="City, Country"
                name="location"
                value={hiringDetails?.location}
                onChange={handleChangeHiringDetailsInput}
                required
                disabled={!isEditing}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Favorite characters:</label>
              <input
                className="border border-dark/40 p-3 rounded"
                type="text"
                placeholder="Separate characters by comma (,)"
                name="favoriteCharacters"
                value={hiringDetails?.favoriteCharacters}
                onChange={handleChangeHiringDetailsInput}
                required
                disabled={!isEditing}
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-medium my-4">Services you offer:</p>

              {hiringDetails?.services?.map((service, index) => (
                <label className="flex items-center gap-2" key={index}>
                  <input
                    type="checkbox"
                    name={service.service}
                    checked={service.serviceAvailable}
                    onChange={handleServices}
                    disabled={!isEditing}
                  />
                  {service.service}
                </label>
              )) || <p>No services options set</p>}

              <div className="flex flex-col gap-2 mt-4">
                <label>Other skills:</label>
                <input
                  className="border border-dark/40 p-3 rounded"
                  type="text"
                  placeholder="Separate skills by comma (,)"
                  name="otherServices"
                  value={hiringDetails?.otherServices}
                  onChange={handleHiringInput}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-medium my-4">Availability:</p>
                {hiringDetails?.availability?.map((available, index) => (
                  <label className="flex items-center gap-2" key={index}>
                    <input
                      type="checkbox"
                      name={available.availabilityName}
                      checked={available.isAvailable}
                      onChange={handleAvailability}
                      disabled={!isEditing}
                    />
                    {available.availabilityName}
                  </label>
                )) || <p>No availability options set</p>}

                <div className="flex flex-col gap-2 mt-4">
                  <label>Other:</label>
                  <input
                    className="border border-dark/40 p-3 rounded"
                    type="text"
                    placeholder="Separate availability by comma (,)"
                    name="otherAvailability"
                    value={hiringDetails?.otherAvailability}
                    onChange={handleHiringInput}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <p className="font-medium my-4">Preferred schedule:</p>
                  <label className="flex items-center gap-2">
                    <input
                      className="border border-dark/40 p-3 rounded"
                      type="radio"
                      name="preferredSchedule"
                      value="weekdays"
                      checked={
                        (hiringDetails?.preferredSchedule?.type || "") ===
                        "weekdays"
                      }
                      onChange={handleChangePreferredSchedule}
                      required
                      disabled={!isEditing}
                    />
                    Weekdays
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      className="border border-dark/40 p-3 rounded"
                      type="radio"
                      name="preferredSchedule"
                      value="weekends"
                      checked={
                        (hiringDetails?.preferredSchedule?.type || "") ===
                        "weekends"
                      }
                      onChange={handleChangePreferredSchedule}
                      required
                      disabled={!isEditing}
                    />
                    Weekends
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      className="border border-dark/40 p-3 rounded"
                      type="radio"
                      name="preferredSchedule"
                      value="flexible"
                      checked={
                        (hiringDetails?.preferredSchedule?.type || "") ===
                        "flexible"
                      }
                      onChange={handleChangePreferredSchedule}
                      required
                      disabled={!isEditing}
                    />
                    Flexible
                  </label>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="font-medium my-4">Travel availability:</p>

                  <label className="flex items-center gap-2">
                    <input
                      className="border border-dark/40 p-3 rounded"
                      type="radio"
                      name="travelAvailability"
                      value="local"
                      checked={
                        hiringDetails?.travelAvailability?.type === "local"
                      }
                      onChange={handleChangeTravelAvailability}
                      required
                      disabled={!isEditing}
                    />
                    Local
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      className="border border-dark/40 p-3 rounded"
                      type="radio"
                      name="travelAvailability"
                      value="national"
                      checked={
                        hiringDetails?.travelAvailability?.type === "national"
                      }
                      onChange={handleChangeTravelAvailability}
                      required
                      disabled={!isEditing}
                    />
                    National
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      className="border border-dark/40 p-3 rounded"
                      type="radio"
                      name="travelAvailability"
                      value="international"
                      checked={
                        hiringDetails?.travelAvailability?.type ===
                        "international"
                      }
                      onChange={handleChangeTravelAvailability}
                      required
                      disabled={!isEditing}
                    />
                    International
                  </label>
                </div>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={editHiringDetails}
                className="btn-primary flex justify-center items-center"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={submitHiringDetails}
                className="btn-primary flex justify-center items-center"
                type="submit"
              >
                {showSavedHiringDetailsMessage ? (
                  "Saved!"
                ) : (
                  <>
                    {isSavingHiringDetails ? (
                      <img className="w-6 h-6" src={loading} alt="" />
                    ) : (
                      "Save"
                    )}
                  </>
                )}
              </button>
            )}
          </form>
        </Accordion>
      </section>
    </>
  );
};

export default AuthComponent;
