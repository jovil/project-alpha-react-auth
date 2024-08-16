import React, { useEffect, useState } from "react";
import { apiUrl, getFetchConfig } from "../../utils/fetchConfig";
import loading from "../../assets/images/loading.gif";
import TalentCard from "../../components/TalentCard";

const HiringPage = () => {
  const [users, setUsers] = useState([]);
  const [noUsers, setNoUsers] = useState(false);

  const fetchUsersForHire = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/forHire`, getFetchConfig);
      const result = await response.json();
      // Show message when no users for hire exists
      if (result.length === 0) setNoUsers(true);
      setUsers(result);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUsersForHire();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <section className="container flex flex-col gap-4">
        <header className="hidden tablet:flex justify-between items-center gap-2">
          <h1 className="subtitle">All talent</h1>
        </header>
        <div className="grid gap-4 grid-cols-2 desktop:grid-cols-3 desktop:gap-6 gap-y-9">
          {users?.length ? (
            <>
              {users?.map((user: any, index: number) => {
                return (
                  <React.Fragment key={index}>
                    {user.talentProfileActive && <TalentCard talent={user} />}
                  </React.Fragment>
                );
              })}
            </>
          ) : noUsers ? (
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
              No talent for hire.
            </p>
          ) : (
            <img
              className="w-6 h-6 absolute inset-1/2 -translate-x-1/2 -translate-y-1/2"
              src={loading}
              alt=""
            />
          )}
        </div>
      </section>
    </>
  );
};

export default HiringPage;
