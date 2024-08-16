import { useState, useEffect, useRef, useContext } from "react";
import { NavLink } from "react-router-dom";
import { GlobalStateContext } from "../../context/Context";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrl } from "../../utils/fetchConfig";
import { getFetchConfig } from "../../utils/fetchConfig";
import Backdrop from "../../components/Backdrop";
import defaultAvatar from "../../assets/images/toon_6.png";
import { slideInFromBottom } from "../../utils/animations";

const SearchModal = ({
  onToggleSearchModal,
  onShowSearchModal,
  isShowSearchModal,
}: {
  onToggleSearchModal: () => void;
  onShowSearchModal: () => void;
  isShowSearchModal: boolean;
}) => {
  const { state, setState } = useContext(GlobalStateContext);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResultQuery, setSearchResultQuery] = useState<string>("");
  const [searchResult, setSearchResult] = useState<Record<string, any>>();
  const searchResultItemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "k") {
        event.preventDefault();
        onShowSearchModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onShowSearchModal]);

  useEffect(() => {
    if (searchResultItemRef.current) {
      searchResultItemRef.current.focus();
    }
  }, [searchResult, onShowSearchModal]);

  const handleSearchInput = (e: React.ChangeEvent) => {
    const input = e.target as HTMLInputElement;
    setSearchQuery(input.value);
  };

  const handleSearch = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const url = `${apiUrl}/search/${searchQuery}`;

    try {
      const response = await fetch(url, getFetchConfig);
      const result = await response.json();
      setSearchResult(result);
      setSearchResultQuery(searchQuery);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isShowSearchModal && (
          <Backdrop onClick={onToggleSearchModal} showCloseButton={false}>
            <motion.div
              className="absolute w-full pointer-events-none px-4 py-6"
              variants={slideInFromBottom}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="container bg-white p-4 relative pointer-events-auto rounded-md border-2 border-[#444]">
                <form
                  className="flex items-center justify-between w-full gap-6"
                  onSubmit={handleSearch}
                >
                  <input
                    className="font-bold py-2.5 px-5 border-b-2 border-[#444] outline-none w-full"
                    type="search"
                    placeholder="Search username"
                    onChange={handleSearchInput}
                    value={searchQuery}
                    autoFocus
                  ></input>
                  <button
                    className="btn-chunky-primary"
                    type="submit"
                    onSubmit={handleSearch}
                  >
                    Search
                  </button>
                </form>

                {searchResult?.length === 0 && (
                  <p className="px-4 pt-6 pb-2">0 matches</p>
                )}

                {searchResult?.length > 0 && (
                  <ul className="flex flex-col py-4 gap-1.5">
                    {searchResult?.map(
                      (user: Record<string, any>, index: number) => {
                        return (
                          <li key={index}>
                            <NavLink
                              className="flex items-center gap-3 p-4 py-5 rounded-md hover:bg-blue-800 transition-colors focus:bg-blue-800"
                              to={`/user/${user.userName.toLowerCase()}`}
                              state={{ userId: user._id }}
                              onClick={() => {
                                onToggleSearchModal();
                                if (state.mobileMenuOpen)
                                  setState(
                                    (prevState: Record<string, any>) => ({
                                      ...prevState,
                                      mobileMenuOpen: false,
                                    })
                                  );
                              }}
                              ref={
                                index === 0 ? searchResultItemRef : undefined
                              }
                              tabIndex={index + 1}
                            >
                              <img
                                className="w-10 h-10 rounded-full object-cover"
                                src={user.avatar || defaultAvatar}
                                alt=""
                              />
                              <div className="flex flex-col">
                                <p className="font-bold">{user.userName}</p>
                                <p className="text-grey">{user.role}</p>
                              </div>
                            </NavLink>
                          </li>
                        );
                      }
                    )}
                  </ul>
                )}
                {searchResultQuery && searchResult?.length > 0 && (
                  <div className="flex justify-end text-sm text-dark/60 px-6 pt-4 border-t-2 border-[#444]">
                    <p>
                      <span className="font-bold">{searchResult?.length}</span>{" "}
                      {searchResult?.length > 1 ? "matches" : "match"} for{" "}
                      <span className="font-bold">"{searchResultQuery}"</span>
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </Backdrop>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchModal;
