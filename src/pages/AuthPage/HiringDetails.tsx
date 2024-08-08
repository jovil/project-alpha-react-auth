import { useCallback, useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import "../../components/Accordion/Accordion.css";
import Notify from "simple-notify";
import "simple-notify/dist/simple-notify.css";

const Accordion = ({
  isEditing,
  onHandleEditingMode,
  isHiringDetails,
  hasHiringDetails,
}: {
  isEditing: boolean;
  onHandleEditingMode: (value: boolean) => void;
  isHiringDetails: any | null;
  hasHiringDetails: boolean;
}) => {
  const { userState } = useUser();
  const [isActive, setIsActive] = useState(false);
  const [hiringDetails, setHiringDetails] = useState<any | null>(
    isHiringDetails || null
  );
  const [showErrorBlock, setShowErrorBlock] = useState(false);
  const [noServiceChecked, setNoServiceChecked] = useState(false);
  const [noAvailabilityChecked, setNoAvailabilityChecked] = useState(false);

  const onLoad = useCallback(() => {
    setHiringDetails(isHiringDetails);
  }, [isHiringDetails]);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  const editHiringDetails = (e: any) => {
    e.preventDefault();
    onHandleEditingMode(true);
  };

  const handleChangeHiringDetailsInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setHiringDetails((prev: any) => ({
      ...(prev || {}),
      [name]: value,
    }));
  };

  const handleServices = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setHiringDetails((prev: any) => ({
      ...prev,
      services: prev?.services?.map((service: any) =>
        service.service === name
          ? { ...service, serviceAvailable: checked }
          : service
      ),
    }));
  };

  const handleHiringInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setHiringDetails((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvailability = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setHiringDetails((prev: any) => ({
      ...prev,
      availability: prev?.availability?.map((available: any) =>
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

  const isAtLeastOneCheckedService = () => {
    return hiringDetails.services.some((e: any) => e.serviceAvailable);
  };

  const isAtLeastOneCheckedAvailability = () => {
    return hiringDetails.availability.some((e: any) => e.isAvailable);
  };

  const submitHiringDetails = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAtLeastOneCheckedService()) {
      setShowErrorBlock(true);
      setNoServiceChecked(true);
    } else {
      setNoServiceChecked(false);
    }

    if (!isAtLeastOneCheckedAvailability()) {
      setShowErrorBlock(true);
      setNoAvailabilityChecked(true);
    } else {
      setNoAvailabilityChecked(false);
    }

    if (!isAtLeastOneCheckedService()) return;
    if (!isAtLeastOneCheckedAvailability()) return;

    setShowErrorBlock(false);

    const postData = {
      whatsApp: hiringDetails.whatsApp || "",
      favoriteCharacters: hiringDetails.favoriteCharacters || "",
      services:
        hiringDetails.services?.map((service: any) => ({
          service: service.service,
          serviceAvailable: service.serviceAvailable,
        })) || [],
      otherServices: hiringDetails.otherServices || "",
      availability:
        hiringDetails.availability?.map((available: any) => ({
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
      setIsActive(false);
      onHandleEditingMode(false);

      new Notify({
        title: "Profile created successfully",
        text: "Your hiring profile is now live.",
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`accordion-item ${isActive ? "active" : ""}`}>
      <div
        className="accordion-title p-4 flex justify-between items-center gap-4"
        onClick={handleToggle}
      >
        Add a “Book me” button to your profile
        {hasHiringDetails && (
          <p className="bg-[#4fde8e33] text-xs font-medium text-[#10a854] rounded-full px-4 py-1.5">
            Saved
          </p>
        )}
      </div>
      {isActive && (
        <div className="accordion-content p-4 pb-6">
          <p className="text-dark/80 mb-8 max-w-[480px]">
            Let fans and potential clients know you're available for gigs,
            events, and photoshoots!
          </p>
          <form className="flex flex-col gap-4" onSubmit={submitHiringDetails}>
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

              {hiringDetails?.services?.map(
                (service: Record<string, any>, index: number) => (
                  <label className="flex items-center gap-2" key={index}>
                    <input
                      className="appearance-auto"
                      type="checkbox"
                      name={service.service}
                      checked={service.serviceAvailable}
                      onChange={handleServices}
                      disabled={!isEditing}
                    />
                    {service.service}
                  </label>
                )
              ) || <p>No services options set</p>}

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
                {hiringDetails?.availability?.map(
                  (available: Record<string, any>, index: number) => (
                    <label className="flex items-center gap-2" key={index}>
                      <input
                        className="appearance-auto"
                        type="checkbox"
                        name={available.availabilityName}
                        checked={available.isAvailable}
                        onChange={handleAvailability}
                        disabled={!isEditing}
                      />
                      {available.availabilityName}
                    </label>
                  )
                ) || <p>No availability options set</p>}

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
                      className="appearance-auto border border-dark/40 p-3 rounded"
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
                      className="appearance-auto border border-dark/40 p-3 rounded"
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
                      className="appearance-auto border border-dark/40 p-3 rounded"
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
                      className="appearance-auto border border-dark/40 p-3 rounded"
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
                      className="appearance-auto border border-dark/40 p-3 rounded"
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
                      className="appearance-auto border border-dark/40 p-3 rounded"
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
                onSubmit={submitHiringDetails}
                className="btn-primary flex justify-center items-center"
                type="submit"
              >
                Save
              </button>
            )}

            {showErrorBlock && (
              <ul className="bg-red text-sm rounded-2xl px-6 py-6 list-disc list-inside flex flex-col gap-2">
                {noServiceChecked && (
                  <li className="text-red-900">
                    At least one service needs to be checked.
                  </li>
                )}
                {noAvailabilityChecked && (
                  <li className="text-red-900">
                    At least one availability needs to be checked.
                  </li>
                )}
              </ul>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Accordion;
