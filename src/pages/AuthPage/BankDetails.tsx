import { useState } from "react";
import { useUser } from "../../context/UserContext";
import Notify from "simple-notify";
import "simple-notify/dist/simple-notify.css";

interface PayoutDetails {
  accountHoldersName: string;
  bankName: string;
  accountNumber: number | string;
}

const BankDetails = () => {
  const { userState, setUserState } = useUser();
  const [bankDetails, setBankDetails] = useState<PayoutDetails>({
    accountHoldersName: "",
    bankName: "",
    accountNumber: "",
  });

  const submitBankDetails = async (e: any) => {
    e.preventDefault();
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
      const response = await fetch(url, configuration);
      const result = await response.json();
      setUserState((prev: any) => {
        return {
          ...prev,
          bankAccountDetails: result.bankAccountDetails,
        };
      });

      new Notify({
        title: "Details saved successfully",
        text: "Future payouts will be processed using the new details.",
      });
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

  return (
    <>
      <div className="max-w-full tablet:max-w-[400px] mx-auto w-full">
        <div className="p-4 font-bold">
          Add your bank account details for payouts
        </div>

        <div className="p-4">
          <form className="flex flex-col gap-6" onSubmit={submitBankDetails}>
            <div className="flex flex-col gap-2">
              <label className="subtitle">Account holder's name:</label>
              <input
                className="border-2 border-[#444] p-3 rounded"
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
              <label className="subtitle">Bank name:</label>
              <input
                className="border-2 border-[#444] p-3 rounded"
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
              <label className="subtitle">Account number:</label>
              <input
                className="border-2 border-[#444] p-3 rounded"
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
                  className="btn-chunky-primary flex justify-center items-center"
                >
                  Edit
                </button>
              </>
            ) : (
              <>
                <button
                  onSubmit={submitBankDetails}
                  className="btn-chunky-primary flex justify-center items-center"
                  type="submit"
                >
                  Save
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default BankDetails;
