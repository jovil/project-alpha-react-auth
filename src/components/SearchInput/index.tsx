import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../utils/fetchConfig";
import { getFetchConfig } from "../../utils/fetchConfig";

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");

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
      setSearchQuery("");

      navigate("/search", {
        state: {
          searchQuery: searchQuery,
          searchResult: result,
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <>
      {/* <Route path={`/search`} element={<SearchPage />} /> */}
      <form className="flex items-center gap-2" onSubmit={handleSearch}>
        <input
          className="text-xs py-2 px-5 border border-[#dadce0] rounded-full outline-none"
          type="search"
          placeholder="Search username"
          onChange={handleSearchInput}
          value={searchQuery}
        ></input>
        <button
          className="text-xs btn-primary"
          type="submit"
          onSubmit={handleSearch}
        >
          Search
        </button>
      </form>
    </>
  );
};

export default Search;
