import { useState, useCallback, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import HeaderSection from "./HeaderSection";
import CreatePost from "./CreatePost";
import CreateProduct from "./CreateProduct";
import Accordion from "../../components/Accordion";
import loading from "../../assets/images/loading.gif";

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
  costumeMaking: boolean;
  makeupAndOrProsthetics: boolean;
  performanceAndOrActing: boolean;
  voiceActing: boolean;
  photography: boolean;
  otherSkills: string;
}

interface Availability {
  conventions: boolean;
  photoshoots: boolean;
  promotionalEvents: boolean;
  onlineAppearancesAndOrStreams: boolean;
  otherAvailability: string;
}

interface HiringDetails {
  email: string;
  whatsApp: number | string;
  location: string;
  favoriteCharacters: string;
  services: Services;
  availability: Availability;
  preferredSchedule: PreferredSchedule;
  travelAvailability: TravelAvailability;
}

const AuthComponent = () => {
  const { userState, setUserState } = useUser();
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountHoldersName: "",
    bankName: "",
    accountNumber: "",
  });
  const [isSavingBankDetails, setIsSavingBankDetails] = useState(false);
  const [showSavedBankDetailsMessage, setShowSavedBankDetailsMessage] =
    useState(false);
  const [hiringDetails, setHiringDetails] = useState<HiringDetails>({
    email: "",
    whatsApp: "",
    location: "",
    favoriteCharacters: "",
    services: {
      costumeMaking: false,
      makeupAndOrProsthetics: false,
      performanceAndOrActing: false,
      voiceActing: false,
      photography: false,
      otherSkills: "",
    },
    availability: {
      conventions: false,
      photoshoots: false,
      promotionalEvents: false,
      onlineAppearancesAndOrStreams: false,
      otherAvailability: "",
    },
    preferredSchedule: {
      type: "weekdays",
    },
    travelAvailability: {
      type: "local",
    },
  });

  const fetchUser = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/user/${userState._id}`;

    const configuration = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(url, configuration);
      const result = await response.json();
      console.log("result", result);
      setUserState((prev: any) => {
        return {
          ...prev,
          avatar64: result.avatar,
          bankAccountDetails: result.bankAccountDetails
            ? {
                accountHoldersName:
                  result.bankAccountDetails.accountHoldersName,
                accountNumber: result.bankAccountDetails.accountNumber,
                bankName: result.bankAccountDetails.bankName,
              }
            : prev.bankAccountDetails, // Preserve previous state if bankAccountDetails is undefined
          hiringDetails: result.hiringDetails
            ? {
                email: result.hiringDetails.email,
                whatsApp: result.hiringDetails.whatsApp,
                location: result.hiringDetails.location,
                favoriteCharacters: result.hiringDetails.favoriteCharacters,
                services: result.hiringDetails.services
                  ? {
                      costumeMaking:
                        result.hiringDetails.services.costumeMaking,
                      makeupAndOrProsthetics:
                        result.hiringDetails.services.makeupAndOrProsthetics,
                      performanceAndOrActing:
                        result.hiringDetails.services.performanceAndOrActing,
                      voiceActing: result.hiringDetails.services.voiceActing,
                      photography: result.hiringDetails.services.photography,
                      otherSkills: result.hiringDetails.services.otherSkills,
                    }
                  : prev.hiringDetails.services,
                availability: result.hiringDetails.availability
                  ? {
                      conventions:
                        result.hiringDetails.availability.conventions,
                      photoshoots:
                        result.hiringDetails.availability.photoshoots,
                      promotionalEvents:
                        result.hiringDetails.availability.promotionalEvents,
                      onlineAppearancesAndOrStreams:
                        result.hiringDetails.availability
                          .onlineAppearancesAndOrStreams,
                      otherAvailability:
                        result.hiringDetails.availability.otherAvailability,
                    }
                  : prev.hiringDetails.availability,
                preferredSchedule: result.hiringDetails.preferredSchedule,
                travelAvailability: result.hiringDetails.travelAvailability,
              }
            : prev.hiringDetails,
        };
      });
    } catch (error) {
      console.log("error", error);
    }
  }, [setUserState, userState._id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    console.log("u", userState);
  }, [userState]);

  const submitBankDetails = async (e: any) => {
    e.preventDefault();
    setIsSavingBankDetails(true);
    const postData = {
      name: bankDetails.accountHoldersName,
      bank: bankDetails.bankName,
      account: bankDetails.accountNumber,
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
        accountHoldersName: userState.bankAccountDetails.accountHoldersName,
        bankName: userState.bankAccountDetails.bankName,
        accountNumber: userState.bankAccountDetails.accountNumber,
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

  const handleChangeHiringDetailsInput = (e: any) => {
    const { name, value } = e.target;

    setHiringDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    setUserState((prev: any) => {
      return {
        ...prev,
        hiringDetails: {
          ...prev.hiringDetails,
          [name]: value,
        },
      };
    });
  };

  const handleServices = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setHiringDetails((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [name]: checked,
      },
    }));

    setUserState((prev: any) => ({
      ...prev,
      hiringDetails: {
        ...prev.hiringDetails,
        services: {
          ...prev.hiringDetails?.services,
          [name]: checked,
        },
      },
    }));
  };

  const handleServicesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setHiringDetails((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [name]: value,
      },
    }));

    setUserState((prev: any) => ({
      ...prev,
      hiringDetails: {
        ...prev.hiringDetails,
        services: {
          ...prev.hiringDetails?.services,
          [name]: value,
        },
      },
    }));
  };

  const handleAvailability = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setHiringDetails((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [name]: checked,
      },
    }));

    setUserState((prev: any) => ({
      ...prev,
      hiringDetails: {
        ...prev.hiringDetails,
        availability: {
          ...prev.hiringDetails?.availability,
          [name]: checked,
        },
      },
    }));
  };

  const handleAvailabilityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setHiringDetails((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [name]: value,
      },
    }));

    setUserState((prev: any) => ({
      ...prev,
      hiringDetails: {
        ...prev.hiringDetails,
        availability: {
          ...prev.hiringDetails?.availability,
          [name]: value,
        },
      },
    }));
  };

  const handleChangePreferredSchedule = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;

    setHiringDetails((prev: any) => ({
      ...prev,
      preferredSchedule: {
        type: value,
      },
    }));

    setUserState((prev: any) => ({
      ...prev,
      hiringDetails: {
        ...prev.hiringDetails,
        preferredSchedule: {
          type: value,
        },
      },
    }));
  };

  const handleChangeTravelAvailability = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;

    setHiringDetails((prev: any) => ({
      ...prev,
      travelAvailability: {
        type: value,
      },
    }));

    setUserState((prev: any) => ({
      ...prev,
      hiringDetails: {
        ...prev.hiringDetails,
        travelAvailability: {
          type: value,
        },
      },
    }));
  };

  const submitHiringDetails = async (e: any) => {
    e.preventDefault();

    const postData = {
      email: hiringDetails.email,
      whatsApp: hiringDetails.whatsApp,
      location: hiringDetails.location,
      favoriteCharacters: hiringDetails.favoriteCharacters,
      services: {
        costumeMaking: hiringDetails.services.costumeMaking,
        makeupAndOrProsthetics: hiringDetails.services.makeupAndOrProsthetics,
        performanceAndOrActing: hiringDetails.services.performanceAndOrActing,
        voiceActing: hiringDetails.services.voiceActing,
        photography: hiringDetails.services.photography,
        otherSkills: hiringDetails.services.otherSkills,
      },
      availability: {
        conventions: hiringDetails.availability.conventions,
        photoshoots: hiringDetails.availability.photoshoots,
        promotionalEvents: hiringDetails.availability.promotionalEvents,
        onlineAppearancesAndOrStreams:
          hiringDetails.availability.onlineAppearancesAndOrStreams,
        otherAvailability: hiringDetails.availability.otherAvailability,
      },
      preferredSchedule: hiringDetails.preferredSchedule,
      travelAvailability: hiringDetails.travelAvailability,
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
      const response = await fetch(url, configuration);
      const result = await response.json();
      console.log("result", result);
    } catch (error) {
      console.log("error", error);
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
        <Accordion title="Add your bank account details for payouts">
          <form className="flex flex-col gap-4" onSubmit={submitBankDetails}>
            <div className="flex flex-col gap-2">
              <label>Account holder's name:</label>
              <input
                className="border border-dark/40 p-3 rounded"
                type="text"
                placeholder="Account holder's name"
                name="accountHoldersName"
                value={
                  userState.bankAccountDetails.accountHoldersName
                    ? userState.bankAccountDetails.accountHoldersName
                    : bankDetails.accountHoldersName
                }
                onChange={handleChangeBankDetailsInput}
                required
                autoFocus
                disabled={
                  userState.bankAccountDetails.accountHoldersName ? true : false
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
                  userState.bankAccountDetails.bankName
                    ? userState.bankAccountDetails.bankName
                    : bankDetails.bankName
                }
                onChange={handleChangeBankDetailsInput}
                required
                disabled={userState.bankAccountDetails.bankName ? true : false}
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
                  userState.bankAccountDetails.accountNumber
                    ? userState.bankAccountDetails.accountNumber
                    : bankDetails.accountNumber
                }
                onChange={handleChangeBankDetailsInput}
                required
                disabled={
                  userState.bankAccountDetails.accountNumber ? true : false
                }
              />
            </div>
            {userState.bankAccountDetails.accountHoldersName &&
            userState.bankAccountDetails.bankName &&
            userState.bankAccountDetails.accountNumber ? (
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
                  onClick={submitBankDetails}
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
        <Accordion title="Add a “Hire Me” button to your profile">
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
                value={hiringDetails.email}
                onChange={handleChangeHiringDetailsInput}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>WhatsApp:</label>
              <input
                className="border border-dark/40 p-3 rounded"
                type="number"
                placeholder="Phone number"
                name="whatsApp"
                value={hiringDetails.whatsApp}
                onChange={handleChangeHiringDetailsInput}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Location:</label>
              <input
                className="border border-dark/40 p-3 rounded"
                type="text"
                placeholder="City, Country"
                name="location"
                value={hiringDetails.location}
                onChange={handleChangeHiringDetailsInput}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Favorite characters:</label>
              <input
                className="border border-dark/40 p-3 rounded"
                type="text"
                placeholder="Separate characters by comma (,)"
                name="favoriteCharacters"
                value={hiringDetails.favoriteCharacters}
                onChange={handleChangeHiringDetailsInput}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-medium my-4">Services you offer:</p>
              <label className="flex items-center gap-2">
                <input
                  className="border border-dark/40 p-3 rounded"
                  type="checkbox"
                  name="costumeMaking"
                  checked={hiringDetails.services.costumeMaking}
                  onChange={handleServices}
                  required
                />
                Costume making
              </label>

              <label className="flex items-center gap-2">
                <input
                  className="border border-dark/40 p-3 rounded"
                  type="checkbox"
                  name="makeupAndOrProsthetics"
                  checked={hiringDetails.services.makeupAndOrProsthetics}
                  onChange={handleServices}
                  required
                />
                Makeup and/or prosthetics
              </label>

              <label className="flex items-center gap-2">
                <input
                  className="border border-dark/40 p-3 rounded"
                  type="checkbox"
                  name="performanceAndOrActing"
                  checked={hiringDetails.services.performanceAndOrActing}
                  onChange={handleServices}
                  required
                />
                Performance/Acting
              </label>

              <label className="flex items-center gap-2">
                <input
                  className="border border-dark/40 p-3 rounded"
                  type="checkbox"
                  name="voiceActing"
                  checked={hiringDetails.services.voiceActing}
                  onChange={handleServices}
                  required
                />
                Voice acting
              </label>

              <label className="flex items-center gap-2">
                <input
                  className="border border-dark/40 p-3 rounded"
                  type="checkbox"
                  name="photography"
                  checked={hiringDetails.services.photography}
                  onChange={handleServices}
                  required
                />
                Photography
              </label>

              <div className="flex flex-col gap-2 mt-4">
                <label>Other skills:</label>
                <input
                  className="border border-dark/40 p-3 rounded"
                  type="text"
                  placeholder="Separate skills by comma (,)"
                  name="otherSkills"
                  value={hiringDetails.services.otherSkills}
                  onChange={handleServicesInput}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-medium my-4">Availability:</p>
                <label className="flex items-center gap-2">
                  <input
                    className="border border-dark/40 p-3 rounded"
                    type="checkbox"
                    name="conventions"
                    checked={hiringDetails.availability.conventions}
                    onChange={handleAvailability}
                    required
                  />
                  Conventions
                </label>

                <label className="flex items-center gap-2">
                  <input
                    className="border border-dark/40 p-3 rounded"
                    type="checkbox"
                    name="photoshoots"
                    checked={hiringDetails.availability.photoshoots}
                    onChange={handleAvailability}
                    required
                  />
                  Photoshoots
                </label>

                <label className="flex items-center gap-2">
                  <input
                    className="border border-dark/40 p-3 rounded"
                    type="checkbox"
                    name="promotionalEvents"
                    checked={hiringDetails.availability.promotionalEvents}
                    onChange={handleAvailability}
                    required
                  />
                  Promotional events
                </label>

                <label className="flex items-center gap-2">
                  <input
                    className="border border-dark/40 p-3 rounded"
                    type="checkbox"
                    name="onlineAppearancesAndOrStreams"
                    checked={
                      hiringDetails.availability.onlineAppearancesAndOrStreams
                    }
                    onChange={handleAvailability}
                    required
                  />
                  Online appearances/streams
                </label>

                <div className="flex flex-col gap-2 mt-4">
                  <label>Other:</label>
                  <input
                    className="border border-dark/40 p-3 rounded"
                    type="text"
                    placeholder="Separate availability by comma (,)"
                    name="otherAvailability"
                    value={hiringDetails.availability.otherAvailability}
                    onChange={handleAvailabilityInput}
                    required
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
                        hiringDetails.preferredSchedule.type === "weekdays"
                      }
                      onChange={handleChangePreferredSchedule}
                      required
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
                        hiringDetails.preferredSchedule?.type === "weekends"
                      }
                      onChange={handleChangePreferredSchedule}
                      required
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
                        hiringDetails.preferredSchedule?.type === "flexible"
                      }
                      onChange={handleChangePreferredSchedule}
                      required
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
                        hiringDetails.travelAvailability?.type === "local"
                      }
                      onChange={handleChangeTravelAvailability}
                      required
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
                        hiringDetails.travelAvailability?.type === "national"
                      }
                      onChange={handleChangeTravelAvailability}
                      required
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
                        hiringDetails.travelAvailability?.type ===
                        "international"
                      }
                      onChange={handleChangeTravelAvailability}
                      required
                    />
                    International
                  </label>
                </div>
              </div>

              <button
                onClick={submitHiringDetails}
                className="btn-primary flex justify-center items-center"
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
        </Accordion>
      </section>
    </>
  );
};

export default AuthComponent;
