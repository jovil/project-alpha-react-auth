import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { apiUrl, postFetchConfig } from "../../utils/fetchConfig";
import Notify from "simple-notify";
import "simple-notify/dist/simple-notify.css";

const UserDetails = ({ isPassword }: { isPassword: string }) => {
  const { userState, setUserState } = useUser();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState(userState);

  const editUserDetails = (e: any) => {
    e.preventDefault();
    setIsEditing(true);

    setFormData((prevState: Record<string, any>) => ({
      ...prevState,
      talentProfile: {
        ...prevState.talentProfile,
        talents: formData.talents && formData.talents.toString(),
      },
    }));
  };

  const handleFormInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevState: Record<string, any>) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTalentFormInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevState: Record<string, any>) => ({
      ...prevState,
      talentProfile: {
        ...prevState.talentProfile,
        [name]: value,
      },
    }));
  };

  const submitUserDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `${apiUrl}/user/update/userDetails/${userState._id}`;

    try {
      await fetch(url, postFetchConfig(formData));

      setUserState((prevState: Record<string, any>) => ({
        ...prevState,
        ...formData,
      }));
      setIsEditing(false);
      new Notify({
        title: "User details saved successfully",
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <form className="max-w-[400px] mx-auto flex flex-col gap-6 p-4 w-full">
        <div className="flex flex-col gap-2">
          <label className="text-sm uppercase tracking-wide font-bold">
            Email:
          </label>
          <input
            className="border-2 border-[#444] p-3 rounded"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFormInput}
            placeholder="Enter email"
            required
            disabled={!isEditing}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm uppercase tracking-wide font-bold">
            Username:
          </label>
          <input
            className="border-2 border-[#444] p-3 rounded"
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleFormInput}
            placeholder="Enter username"
            required
            disabled={!isEditing}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm uppercase tracking-wide font-bold">
            Password:
          </label>
          <input
            className="border-2 border-[#444] p-3 rounded"
            type="password"
            name="password"
            value={isPassword}
            placeholder="Password"
            required
            disabled
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm uppercase tracking-wide font-bold">
            Creative role:
          </label>
          <input
            className="border-2 border-[#444] p-3 rounded"
            type="text"
            name="role"
            value={formData?.talentProfile?.role}
            onChange={handleTalentFormInput}
            placeholder="Primary role (e.g., Costume Designer, Makeup Artist)"
            required
            disabled={!isEditing}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm uppercase tracking-wide font-bold">
            Talents:
          </label>
          <input
            className="border-2 border-[#444] p-3 rounded"
            type="text"
            name="talents"
            value={formData?.talentProfile?.talents?.toString()}
            onChange={handleTalentFormInput}
            placeholder="Your talents (e.g., Painting, Content Creation)"
            required
            disabled={!isEditing}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="text-sm uppercase tracking-wide font-bold"
            htmlFor="state"
          >
            State / Federal Territory:
          </label>
          <select
            className="border-2 border-[#444] p-3 rounded"
            name="state"
            value={formData.state}
            onChange={handleFormInput}
            required
            disabled={!isEditing}
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
          <label className="text-sm uppercase tracking-wide font-bold">
            City / District:
          </label>
          <input
            className="border-2 border-[#444] p-3 rounded"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleFormInput}
            placeholder="Enter city/district"
            required
            disabled={!isEditing}
          />
        </div>

        {!isEditing ? (
          <button
            className="btn-chunky-primary flex justify-center items-center"
            onClick={editUserDetails}
          >
            Edit
          </button>
        ) : (
          <button
            className="btn-chunky-primary flex justify-center items-center"
            onClick={submitUserDetails}
            type="submit"
          >
            Save
          </button>
        )}
      </form>
    </>
  );
};

export default UserDetails;
