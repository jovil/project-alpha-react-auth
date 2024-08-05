import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalStateContext } from "../../context/Context";
import { useUser } from "../../context/UserContext";
import Cookies from "universal-cookie";
import { apiUrl } from "../../utils/fetchConfig";

export default function Register() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const { state, setState } = useContext(GlobalStateContext);
  const { setUserState } = useUser();
  const [register, setRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    password: "",
    state: "Johor",
    city: "",
  });

  const handleLoginState = () => {
    setState({ ...state, isLoggedIn: true });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const url = `${apiUrl}/register`;

    const configuration = {
      method: "POST", // Specify the request method
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
      body: JSON.stringify(formData), // Convert the data to JSON string
    };

    try {
      const response = await fetch(url, configuration);
      const result = await response.json();

      if (result.error) return setErrorMessage(true);

      await setUserState((prev: any) => {
        return {
          ...prev,
          email: result.email,
          _id: result._id,
          userName: result.userName,
          state: result.state,
          city: result.city,
        };
      });

      cookies.set("TOKEN", result.token, {
        path: "/",
      });
      setRegister(true);
      handleLoginState();

      navigate("/auth");
    } catch (error) {
      console.log("error", error);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prevStep: number) => prevStep - 1);
  };

  const handleNext = () => {
    const form = document.getElementsByTagName("form")[0] as HTMLFormElement;

    if (form.reportValidity()) {
      setCurrentStep((prevStep: number) => prevStep + 1);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-4 w-[500px] mx-auto">
      <h1 className="text-4xl">Register</h1>
      <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-col gap-4">
          {currentStep === 1 && (
            <>
              <div className="flex flex-col gap-2">
                <label>Email address:</label>
                <input
                  className="border border-dark/40 p-3 rounded"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  autoFocus
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label>Username:</label>
                <input
                  className="border border-dark/40 p-3 rounded"
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label>Password:</label>
                <input
                  className="border border-dark/40 p-3 rounded"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="flex flex-col gap-2">
                <label htmlFor="state">State / Federal Territory:</label>
                <select
                  className="border border-dark/40 p-3 rounded"
                  onChange={handleChange}
                  name="state"
                  value={formData.state}
                  required
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
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city/district"
                  required
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2">
          {currentStep === 1 && (
            <button className="btn-primary" type="button" onClick={handleNext}>
              Continue
            </button>
          )}

          {currentStep === 2 && (
            <>
              <button
                className="btn-primary"
                type="submit"
                onSubmit={(e) => handleSubmit(e)}
              >
                Submit
              </button>

              <button
                className="px-5 py-2 text-blue-100 font-medium"
                type="button"
                onClick={handlePrev}
              >
                Go back
              </button>
            </>
          )}
        </div>
        <div>
          {errorMessage && <p className="text-error">Email already exist</p>}

          {/* display success message */}
          {register && (
            <p className="text-success">You are registered successfully</p>
          )}
        </div>
      </form>
    </div>
  );
}
