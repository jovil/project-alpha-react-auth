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

// interface Services {
//   costumeMaking: boolean;
//   makeupAndOrProsthetics: boolean;
//   performanceAndOrActing: boolean;
//   voiceActing: boolean;
//   photography: boolean;
//   otherSkills: string;
// }

interface Services {
  service: string;
  serviceAvailable: boolean;
}

// interface Availability {
//   conventions: boolean;
//   photoshoots: boolean;
//   promotionalEvents: boolean;
//   onlineAppearancesAndOrStreams: boolean;
//   otherAvailability: string;
// }

interface Availability {
  availabilityName: string;
  isAvailable: boolean;
}

interface HiringDetails {
  email: string;
  whatsApp: number | string;
  location: string;
  favoriteCharacters: string;
  services: Services[];
  otherServices: string;
  availability: Availability[];
  otherAvailability: string;
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
    services: [
      { service: "Costume making", serviceAvailable: false },
      { service: "Makeup and/or prosthetics", serviceAvailable: false },
      { service: "Performance/Acting", serviceAvailable: false },
      { service: "Voice acting", serviceAvailable: false },
      { service: "Photography", serviceAvailable: false },
    ],
    otherServices: "",
    availability: [
      { availabilityName: "Conventions", isAvailable: false },
      { availabilityName: "Photoshoots", isAvailable: false },
      { availabilityName: "Promotional events", isAvailable: false },
      { availabilityName: "Online appearances/streams", isAvailable: false },
    ],
    otherAvailability: "",
    preferredSchedule: {
      type: "weekdays",
    },
    travelAvailability: {
      type: "local",
    },
  });
  const [isSavingHiringDetails, setIsSavingHiringDetails] = useState(false);
  const [showSavedHiringDetailsMessage, setShowSavedHiringDetailsMessage] =
    useState(false);

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
      // console.log("result", result);
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
                  ? result.hiringDetails.services.map((service: any) => ({
                      service: service.service,
                      serviceAvailable: service.serviceAvailable,
                    }))
                  : prev.hiringDetails.services,
                otherServices: result.hiringDetails.otherServices,
                availability: result.hiringDetails.availability
                  ? result.hiringDetails.availability.map((available: any) => ({
                      availabilityName: available.availabilityName,
                      isAvailable: available.isAvailable,
                    }))
                  : prev.hiringDetails.availability,
                otherAvailability: result.hiringDetails.otherAvailability,
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
    if (userState.hiringDetails?.email === undefined) {
      setUserState((prev: any) => {
        return {
          ...prev,
          hiringDetails: {
            ...prev.hiringDetails,
            editingMode: true,
          },
        };
      });
    }
  }, [fetchUser]);

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

  const editHiringDetails = (e: any) => {
    e.preventDefault();
    setHiringDetails((prev: any) => {
      return {
        ...prev,
        email: userState.hiringDetails?.email || "",
        whatsApp: userState.hiringDetails?.whatsApp || "",
        location: userState.hiringDetails?.location || "",
        favoriteCharacters: userState.hiringDetails?.favoriteCharacters || "",
        services: userState.hiringDetails.services.map((service: any) => ({
          service: service.service,
          serviceAvailable: service.serviceAvailable,
        })),
        otherServices: userState.hiringDetails?.otherServices || "",
        availability: userState.hiringDetails.availability.map(
          (available: any) => ({
            availabilityName: available.availabilityName,
            isAvailable: available.isAvailable,
          })
        ),
        otherAvailability: userState.hiringDetails?.otherAvailability || "",
        preferredSchedule: userState.hiringDetails?.preferredSchedule,
        travelAvailability: userState.hiringDetails?.travelAvailability,
      };
    });

    setUserState((prev: any) => {
      return {
        ...prev,
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
          preferredSchedule: {
            type: undefined,
          },
          travelAvailability: {
            type: undefined,
          },
          editingMode: true,
        },
      };
    });
  };

  const handleChangeHiringDetailsInput = (e: any) => {
    const { name, value } = e.target;

    setHiringDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    // console.log("availability", hiringDetails.availability);
    // console.log("otherServices", hiringDetails.otherServices);
  }, [hiringDetails]);

  const handleServices = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setHiringDetails((prev) => ({
      ...prev,
      services: prev.services.map((service) =>
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
      ...prev,
      availability: prev.availability.map((available) =>
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
      ...prev,
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
      ...prev,
      travelAvailability: {
        type: value,
      },
    }));
  };

  const submitHiringDetails = async (e: any) => {
    e.preventDefault();
    setIsSavingHiringDetails(true);
    setUserState((prev: any) => {
      return {
        ...prev,
        hiringDetails: {
          ...prev.hiringDetails,
          editingMode: false,
        },
      };
    });
    const postData = {
      email: hiringDetails.email,
      whatsApp: hiringDetails.whatsApp,
      location: hiringDetails.location,
      favoriteCharacters: hiringDetails.favoriteCharacters,
      services: hiringDetails.services.map((service: any) => ({
        service: service.service,
        serviceAvailable: service.serviceAvailable,
      })),
      otherServices: hiringDetails.otherServices,
      availability: hiringDetails.availability.map((available: any) => ({
        availabilityName: available.availabilityName,
        isAvailable: available.isAvailable,
      })),
      otherAvailability: hiringDetails.otherAvailability,
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
      console.log("postData", postData);
      // await fetch(url, configuration);
      // setIsSavingHiringDetails(false);
      // setShowSavedHiringDetailsMessage(true);
      // setTimeout(() => {
      //   setShowSavedHiringDetailsMessage(false);
      //   // window.location.reload();
      // }, 800);
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
                value={
                  userState.hiringDetails?.email
                    ? userState.hiringDetails.email
                    : hiringDetails.email
                }
                onChange={handleChangeHiringDetailsInput}
                required
                // disabled={!userState.hiringDetails?.editingMode}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>WhatsApp:</label>
              <input
                className="border border-dark/40 p-3 rounded"
                type="number"
                placeholder="Phone number"
                name="whatsApp"
                value={
                  userState.hiringDetails?.whatsApp || hiringDetails.whatsApp
                }
                onChange={handleChangeHiringDetailsInput}
                required
                // disabled={!userState.hiringDetails?.editingMode}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Location:</label>
              <input
                className="border border-dark/40 p-3 rounded"
                type="text"
                placeholder="City, Country"
                name="location"
                value={
                  userState.hiringDetails?.location || hiringDetails.location
                }
                onChange={handleChangeHiringDetailsInput}
                required
                // disabled={!userState.hiringDetails?.editingMode}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Favorite characters:</label>
              <input
                className="border border-dark/40 p-3 rounded"
                type="text"
                placeholder="Separate characters by comma (,)"
                name="favoriteCharacters"
                value={
                  userState.hiringDetails?.favoriteCharacters ||
                  hiringDetails.favoriteCharacters
                }
                onChange={handleChangeHiringDetailsInput}
                required
                // disabled={!userState.hiringDetails?.editingMode}
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-medium my-4">Services you offer:</p>

              {hiringDetails.services.map((service, index) => (
                <label className="flex items-center gap-2" key={index}>
                  <input
                    type="checkbox"
                    name={service.service}
                    checked={service.serviceAvailable}
                    onChange={handleServices}
                  />
                  {service.service}
                </label>
              ))}
              {/* <label className="flex items-center gap-2">
                <input
                  className="border border-dark/40 p-3 rounded"
                  type="checkbox"
                  name="Costume making"
                  checked={
                    userState.hiringDetails?.services?.costumeMaking ||
                    hiringDetails.services.costumeMaking
                  }
                  onChange={handleServices}
                  // disabled={!userState.hiringDetails?.editingMode}
                />
                Costume making
              </label>

              <label className="flex items-center gap-2">
                <input
                  className="border border-dark/40 p-3 rounded"
                  type="checkbox"
                  name="Makeup and/or prosthetics"
                  checked={
                    userState.hiringDetails?.services?.makeupAndOrProsthetics ||
                    hiringDetails.services.makeupAndOrProsthetics
                  }
                  onChange={handleServices}
                  // disabled={!userState.hiringDetails?.editingMode}
                />
                Makeup and/or prosthetics
              </label>

              <label className="flex items-center gap-2">
                <input
                  className="border border-dark/40 p-3 rounded"
                  type="checkbox"
                  name="Performance/Acting"
                  checked={
                    userState.hiringDetails?.services?.performanceAndOrActing ||
                    hiringDetails.services.performanceAndOrActing
                  }
                  onChange={handleServices}
                  // disabled={!userState.hiringDetails?.editingMode}
                />
                Performance/Acting
              </label>

              <label className="flex items-center gap-2">
                <input
                  className="border border-dark/40 p-3 rounded"
                  type="checkbox"
                  name="Voice acting"
                  checked={
                    userState.hiringDetails?.services?.voiceActing ||
                    hiringDetails.services.serviceAvailable
                  }
                  onChange={handleServices}
                  // disabled={!userState.hiringDetails?.editingMode}
                />
                Voice acting
              </label>

              <label className="flex items-center gap-2">
                <input
                  className="border border-dark/40 p-3 rounded"
                  type="checkbox"
                  name="Photography"
                  checked={
                    userState.hiringDetails?.services?.photography ||
                    hiringDetails.services.photography
                  }
                  onChange={handleServices}
                  // disabled={!userState.hiringDetails?.editingMode}
                />
                Photography
              </label> */}

              <div className="flex flex-col gap-2 mt-4">
                <label>Other skills:</label>
                <input
                  className="border border-dark/40 p-3 rounded"
                  type="text"
                  placeholder="Separate skills by comma (,)"
                  name="otherServices"
                  value={
                    userState.hiringDetails?.otherServices ||
                    hiringDetails.otherServices
                  }
                  onChange={handleHiringInput}
                  // disabled={!userState.hiringDetails?.editingMode}
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-medium my-4">Availability:</p>
                {hiringDetails.availability.map((available, index) => (
                  <label className="flex items-center gap-2" key={index}>
                    <input
                      type="checkbox"
                      name={available.availabilityName}
                      checked={available.isAvailable}
                      onChange={handleAvailability}
                    />
                    {available.availabilityName}
                  </label>
                ))}

                {/* <label className="flex items-center gap-2">
                  <input
                    className="border border-dark/40 p-3 rounded"
                    type="checkbox"
                    name="Conventions"
                    checked={
                      userState.hiringDetails?.availability?.conventions ||
                      hiringDetails.availability.conventions
                    }
                    onChange={handleAvailability}
                    // disabled={!userState.hiringDetails?.editingMode}
                  />
                  Conventions
                </label>

                <label className="flex items-center gap-2">
                  <input
                    className="border border-dark/40 p-3 rounded"
                    type="checkbox"
                    name="Photoshoots"
                    checked={
                      userState.hiringDetails?.availability?.photoshoots ||
                      hiringDetails.availability.photoshoots
                    }
                    onChange={handleAvailability}
                    // disabled={!userState.hiringDetails?.editingMode}
                  />
                  Photoshoots
                </label>

                <label className="flex items-center gap-2">
                  <input
                    className="border border-dark/40 p-3 rounded"
                    type="checkbox"
                    name="Promotional events"
                    checked={
                      userState.hiringDetails?.availability
                        ?.promotionalEvents ||
                      hiringDetails.availability.promotionalEvents
                    }
                    onChange={handleAvailability}
                    // disabled={!userState.hiringDetails?.editingMode}
                  />
                  Promotional events
                </label>

                <label className="flex items-center gap-2">
                  <input
                    className="border border-dark/40 p-3 rounded"
                    type="checkbox"
                    name="Online appearances/streams"
                    checked={
                      userState.hiringDetails?.availability
                        ?.onlineAppearancesAndOrStreams ||
                      hiringDetails.availability.onlineAppearancesAndOrStreams
                    }
                    onChange={handleAvailability}
                    // disabled={!userState.hiringDetails?.editingMode}
                  />
                  Online appearances/streams
                </label> */}

                <div className="flex flex-col gap-2 mt-4">
                  <label>Other:</label>
                  <input
                    className="border border-dark/40 p-3 rounded"
                    type="text"
                    placeholder="Separate availability by comma (,)"
                    name="otherAvailability"
                    value={
                      userState.hiringDetails?.otherAvailability ||
                      hiringDetails.otherAvailability
                    }
                    onChange={handleHiringInput}
                    // disabled={!userState.hiringDetails?.editingMode}
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
                        userState.hiringDetails?.preferredSchedule?.type ===
                          "weekdays" ||
                        hiringDetails.preferredSchedule.type === "weekdays"
                      }
                      onChange={handleChangePreferredSchedule}
                      required
                      // disabled={!userState.hiringDetails?.editingMode}
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
                        userState.hiringDetails?.preferredSchedule?.type ===
                          "weekends" ||
                        hiringDetails.preferredSchedule?.type === "weekends"
                      }
                      onChange={handleChangePreferredSchedule}
                      required
                      // disabled={!userState.hiringDetails?.editingMode}
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
                        userState.hiringDetails?.preferredSchedule?.type ===
                          "flexible" ||
                        hiringDetails.preferredSchedule?.type === "flexible"
                      }
                      onChange={handleChangePreferredSchedule}
                      required
                      // disabled={!userState.hiringDetails?.editingMode}
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
                        userState.hiringDetails?.travelAvailability?.type ===
                          "local" ||
                        hiringDetails.travelAvailability?.type === "local"
                      }
                      onChange={handleChangeTravelAvailability}
                      required
                      // disabled={!userState.hiringDetails?.editingMode}
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
                        userState.hiringDetails?.travelAvailability?.type ===
                          "national" ||
                        hiringDetails.travelAvailability?.type === "national"
                      }
                      onChange={handleChangeTravelAvailability}
                      required
                      // disabled={!userState.hiringDetails?.editingMode}
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
                        userState.hiringDetails?.travelAvailability?.type ===
                          "international" ||
                        hiringDetails.travelAvailability?.type ===
                          "international"
                      }
                      onChange={handleChangeTravelAvailability}
                      required
                      // disabled={!userState.hiringDetails?.editingMode}
                    />
                    International
                  </label>
                </div>
              </div>

              {/* {userState.hiringDetails?.email ? (
                <>
                  <button
                    onClick={editHiringDetails}
                    className="btn-primary flex justify-center items-center"
                  >
                    Edit
                  </button>
                </>
              ) : ( */}
              <>
                <button
                  onSubmit={submitHiringDetails}
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
              </>
              {/* )} */}
            </div>
          </form>
        </Accordion>
      </section>
    </>
  );
};

export default AuthComponent;
