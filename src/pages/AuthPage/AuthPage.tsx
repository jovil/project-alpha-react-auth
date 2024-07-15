import { useState } from "react";
import { useUser } from "../../context/UserContext";
import HeaderSection from "./HeaderSection";
import CreatePost from "./CreatePost";
import CreateProduct from "./CreateProduct";
import Accordion from "../../components/Accordion";
import loading from "../../assets/images/loading.gif";

interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: number | string;
}

const AuthComponent = () => {
  const { userState } = useUser();
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
  });
  const [isSavingBankDetails, setIsSavingBankDetails] = useState(false);
  const [showSavedBankDetailsMessage, setShowSavedBankDetailsMessage] =
    useState(false);

  const submitBankDetails = async (e: any) => {
    e.preventDefault();
    setIsSavingBankDetails(true);
    const postData = {
      name: bankDetails.accountHolderName,
      bank: bankDetails.bankName,
      account: bankDetails.accountNumber,
    };
    const url = `${process.env.REACT_APP_API_URL}/user/update/${userState._id}`;
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
      }, 800);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setBankDetails((prev: any) => {
      return {
        ...prev,
        [name]: value,
      };
    });
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
                name="accountHolderName"
                value={bankDetails.accountHolderName}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Bank name:</label>
              <input
                className="border border-dark/40 p-3 rounded"
                type="text"
                placeholder="Bank name"
                name="bankName"
                value={bankDetails.bankName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Account number:</label>
              <input
                className="border border-dark/40 p-3 rounded"
                type="number"
                placeholder="Account number"
                name="accountNumber"
                value={bankDetails.accountNumber}
                onChange={handleChange}
                required
              />
            </div>
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
          </form>
        </Accordion>
        <Accordion title="Add a “Hire Me” button to your profile">
          <p>
            Let fans and potential clients know you're available for gigs,
            events, and photoshoots!
          </p>
        </Accordion>
      </section>
    </>
  );
};

export default AuthComponent;
