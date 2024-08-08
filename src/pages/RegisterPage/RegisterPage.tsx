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
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    password: "",
    state: "Johor",
    city: "",
    code: "",
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

      if (response.status === 400) {
        setShowErrorMessage(true);
        setErrorMessage(result.message);
        return;
      } else if (response.status === 404) {
        setShowErrorMessage(true);
        setErrorMessage(result.message);
        return;
      } else if (response.status === 500) {
        setShowErrorMessage(true);
        setErrorMessage(result.message);
        return;
      } else {
        setShowErrorMessage(false);
      }

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
    showErrorMessage && setShowErrorMessage(false);

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="grid grid-cols-12 flex-grow w-full">
      <div className="col-span-5 flex flex-col justify-center px-4">
        <div className="flex flex-col gap-6 max-w-[400px] h-[380px] mx-auto w-full">
          <h1 className="text-2xl">Create your account</h1>
          <form
            className="flex flex-col justify-between gap-4 h-full relative"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="flex flex-col gap-4">
              {currentStep === 1 && (
                <div className="flex flex-col gap-2">
                  <label className="text-black-200">Invite code:</label>
                  <input
                    className="bg-blue-900 border-b border-dark/40 p-5 py-2.5"
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Invite code"
                    autoFocus
                    required
                  />
                </div>
              )}
              {currentStep === 2 && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-black-200">Email address:</label>
                    <input
                      className="bg-blue-900 border-b border-dark/40 p-5 py-2.5"
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
                    <label className="text-black-200">Username:</label>
                    <input
                      className="bg-blue-900 border-b border-dark/40 p-5 py-2.5"
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      placeholder="Enter username"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-black-200">Password:</label>
                    <input
                      className="bg-blue-900 border-b border-dark/40 p-5 py-2.5"
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

              {currentStep === 3 && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-black-200" htmlFor="state">
                      State / Federal Territory:
                    </label>
                    <div className="relative">
                      <select
                        className="h-[45px] bg-blue-900 border-b border-dark/40 p-5 py-2.5 w-full"
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

                      <div className="absolute right-5 top-1/2 -translate-y-1/2">
                        <svg
                          className="h-5 w-5 pointer-events-none"
                          width="24"
                          height="25"
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 8.86035L12 15.8604L19 8.86035"
                            stroke="#5D5A88"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-black-200">City / District:</label>
                    <input
                      className="bg-blue-900 border-b border-dark/40 p-5 py-2.5"
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
              {(currentStep === 1 || currentStep === 2) && (
                <button
                  className="btn-primary shadow-none"
                  type="button"
                  onClick={handleNext}
                >
                  Continue
                </button>
              )}

              {currentStep === 2 && (
                <button
                  className="px-5 py-2 text-blue-100 font-medium"
                  type="button"
                  onClick={handlePrev}
                >
                  Go back
                </button>
              )}

              {currentStep === 3 && (
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
            {showErrorMessage && (
              <p className="text-error absolute -bottom-3 translate-y-full">
                {errorMessage}
              </p>
            )}

            {/* display success message */}
            {register && (
              <p className="text-success">You are registered successfully</p>
            )}
          </form>
        </div>
      </div>
      <div className="col-span-7 pb-4 px-4">
        <div className="text-white bg-[#093cf4] p-16 rounded-xl h-full">
          <div className="max-w-[570px] flex flex-col gap-16">
            <div className="flex flex-col gap-6">
              <h1 className="font-medium text-3xl leading-tight">
                Exclusive Platform for Creators to Share, Sell, and Shine
              </h1>

              <p>
                Join a community of talented creators showcasing their work,
                selling unique products, and offering bespoke services. Our
                platform ensures a dedicated space for your creativity to
                flourish and your income to grow.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <p className="font-semibold">Why Sign Up?</p>

                <ul className="list-disc max-w-[470px] flex flex-col gap-3">
                  <li>
                    <span className="font-semibold">Showcase Your Work:</span>{" "}
                    Share your latest creations with a community that
                    appreciates quality and creativity.
                  </li>
                  <li>
                    <span className="font-semibold">Sell Your Products:</span>{" "}
                    Open your personal shop with no listing fees and start
                    selling digital or physical items effortlessly.
                  </li>
                  <li>
                    <span className="font-semibold">Offer Your Services:</span>{" "}
                    Monetize your skills by offering commissions, memberships,
                    or personalized services.
                  </li>
                </ul>
              </div>

              <div className="font-semibold">
                <p>Start Making Money Doing What You Love.</p>
                <p>All in One Beautiful Space.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
