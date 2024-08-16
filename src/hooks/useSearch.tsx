import { useState } from "react";

const useSearch = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);

  const onToggleSearchModal = () => {
    setShowSearchModal((prevState: boolean) => !prevState);
  };

  const onShowSearchModal = () => {
    setShowSearchModal((prevState: boolean) => !prevState);
  };

  return {
    showSearchModal,
    onToggleSearchModal,
    onShowSearchModal,
  };
};

export default useSearch;
