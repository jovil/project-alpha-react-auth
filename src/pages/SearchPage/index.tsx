import { useLocation, NavLink } from "react-router-dom";
import defaultAvatar from "../../assets/images/toon_6.png";

const SearchPage = () => {
  const location = useLocation();
  const { searchQuery, searchResult } = location.state;

  return (
    <>
      <section className="container flex flex-col gap-4">
        <header>
          <div className="">
            <h1>
              <span className="font-medium">{searchResult.length}</span>{" "}
              {searchResult.length > 1 ? "matches" : "match"} for{" "}
              <span className="font-medium">"{searchQuery}"</span>
            </h1>
          </div>
        </header>

        <ul className="flex flex-col">
          {searchResult.map((user: Record<string, any>, index: number) => {
            return (
              <li key={index}>
                <NavLink
                  className="flex items-center gap-2.5 p-4 rounded-md hover:bg-blue-800 transition-colors"
                  to={`/user/${user._id}`}
                >
                  <img
                    className="w-8 h-8 rounded-full object-cover"
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
          })}
        </ul>
      </section>
    </>
  );
};

export default SearchPage;
