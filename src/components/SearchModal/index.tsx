import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
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
              className="absolute w-full pointer-events-none py-6"
              variants={slideInFromBottom}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="container bg-white border p-4 relative pointer-events-auto rounded-md">
                <form
                  className="flex items-center justify-between w-full gap-6"
                  onSubmit={handleSearch}
                >
                  <input
                    className="py-2 px-5 border-b border-[#dadce0] outline-none w-full"
                    type="search"
                    placeholder="Search username"
                    onChange={handleSearchInput}
                    value={searchQuery}
                    autoFocus
                  ></input>
                  <button
                    className="btn-primary"
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
                              to={`/user/${user.userName}`}
                              state={{ userId: user._id }}
                              onClick={onToggleSearchModal}
                              ref={
                                index === 0 ? searchResultItemRef : undefined
                              }
                              tabIndex={index + 1}
                            >
                              <img
                                className="w-9 h-9 rounded-full object-cover"
                                src={user.avatar || defaultAvatar}
                                alt=""
                              />
                              <div className="flex flex-col">
                                <p className="font-medium">{user.userName}</p>
                                <p className="text-xs text-dark/60">
                                  {user.state}, {user.city}
                                </p>
                              </div>
                            </NavLink>
                          </li>
                        );
                      }
                    )}
                  </ul>
                )}
                {searchResultQuery && searchResult?.length > 0 && (
                  <div className="flex justify-end text-xs text-dark/60 px-6 pt-4 border-t border-[#dadce0]">
                    <p>
                      <span className="font-medium">
                        {searchResult?.length}
                      </span>{" "}
                      {searchResult?.length > 1 ? "matches" : "match"} for{" "}
                      <span className="font-medium">"{searchResultQuery}"</span>
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
