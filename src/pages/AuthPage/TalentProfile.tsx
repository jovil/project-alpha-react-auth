import { useCallback, useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import "../../components/Accordion/Accordion.css";
import Notify from "simple-notify";
import "simple-notify/dist/simple-notify.css";
import { apiUrl, postFetchConfig } from "../../utils/fetchConfig";

const TalentProfile = ({
  isHiringDetails,
}: {
  isHiringDetails: any | null;
}) => {
  const { userState, setUserState } = useUser();
  const [hiringDetails, setHiringDetails] = useState<any | null>(
    isHiringDetails || null
  );
  const [enableProfile, setEnableProfile] = useState(
    userState.talentProfileActive || false
  );

  useEffect(() => {
    updateTalentProfile(enableProfile);

    // eslint-disable-next-line
  }, [enableProfile]);

  const onLoad = useCallback(() => {
    setHiringDetails(isHiringDetails);
  }, [isHiringDetails]);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  const handleTalentInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setHiringDetails((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHiringDetails = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      whatsApp: hiringDetails.whatsApp || "",
      talentProfile: {
        title: hiringDetails.title,
        description: hiringDetails.description,
        role: hiringDetails.role,
        talents: hiringDetails.talents.toString(),
      },
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
      await fetch(url, configuration);
      new Notify({
        title: "Profile created successfully",
        text: "Your hiring profile is now live.",
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateTalentProfile = async (newEnableProfile: boolean) => {
    const url = `${apiUrl}/user/toggle/talentProfile/${userState._id}`;

    const data = {
      talentProfileActive: newEnableProfile,
    };

    try {
      const response = await fetch(url, postFetchConfig(data));
      const talentProfileActive = await response.json();
      setUserState((prevState: Record<string, any>) => ({
        ...prevState,
        talentProfileActive,
      }));
      setEnableProfile(talentProfileActive);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleToggleProfile = () => {
    setEnableProfile((prevState: boolean) => !prevState);
  };

  return (
    <>
      <div className="flex flex-col gap-16 p-4 pt-0 w-full">
        <div className="flex flex-col justify-between gap-4 border-2 border-[#444] rounded-md p-6">
          <div className="flex items-center gap-2">
            <p className="text-sm">Enable</p>
            <button
              className={`toggle-btn ${enableProfile ? "toggled" : ""}`}
              onClick={handleToggleProfile}
            >
              <div className="thumb"></div>
            </button>
          </div>

          <p className="font-bold">Activate your talent profile</p>
        </div>

        <form className="flex flex-col gap-10" onSubmit={submitHiringDetails}>
          <div className="grid grid-cols-12 gap-6 w-full">
            <div className="col-span-4 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="subtitle">Creative role:</label>
                <input
                  className="border-2 border-[#444] p-3 rounded"
                  type="text"
                  placeholder="Primary role (e.g., Costume Designer, Makeup Artist)"
                  name="role"
                  value={hiringDetails?.role ? hiringDetails.role : ""}
                  onChange={handleTalentInput}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="subtitle">Talents:</label>
                <textarea
                  className="border-2 border-[#444] p-3 rounded"
                  rows={4}
                  placeholder="Your talents (e.g., Painting, Content Creation)"
                  name="talents"
                  value={
                    hiringDetails?.talents
                      ? hiringDetails.talents.toString()
                      : ""
                  }
                  onChange={handleTalentInput}
                  required
                />
              </div>
            </div>

            <div className="col-span-4 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="subtitle">Headline:</label>
                <input
                  className="border-2 border-[#444] p-3 rounded"
                  type="text"
                  placeholder="Catchy title or tagline"
                  name="title"
                  value={hiringDetails?.title ? hiringDetails.title : ""}
                  onChange={handleTalentInput}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="subtitle">Description:</label>
                <textarea
                  className="border-2 border-[#444] p-3 rounded"
                  rows={4}
                  placeholder="Describe your work and what you offer"
                  name="description"
                  value={
                    hiringDetails?.description ? hiringDetails.description : ""
                  }
                  onChange={handleTalentInput}
                  required
                />
              </div>
            </div>

            <div className="col-span-4 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="subtitle">WhatsApp:</label>
                <input
                  className="border-2 border-[#444] p-3 rounded"
                  type="number"
                  placeholder="Phone number"
                  name="whatsApp"
                  value={hiringDetails?.whatsApp ? hiringDetails.whatsApp : ""}
                  onChange={handleTalentInput}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onSubmit={submitHiringDetails}
              className="btn-chunky-primary flex justify-center items-center"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TalentProfile;
