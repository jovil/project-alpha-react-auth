import { useUser } from "../../context/UserContext";

const UserDetails = ({ isPassword }: { isPassword: string }) => {
  const { userState } = useUser();

  return (
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
            value={isPassword}
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
  );
};

export default UserDetails;
