import loading from "../../assets/images/loading.gif";
import defaultAvatar from "../../assets/images/toon_6.png";

const HeaderSection = ({
  profileHeader,
  profileLoadingAvatar,
}: {
  profileHeader: any;
  profileLoadingAvatar: boolean;
}) => {
  return (
    <>
      <header className="flex justify-center relative">
        <div className="text-xs font-medium flex flex-col gap-3 items-center">
          <div className="w-16 h-16 border border-dark/60 rounded shadow-md relative overflow-hidden">
            {profileLoadingAvatar && (
              <img
                className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0"
                src={loading}
                alt=""
              />
            )}
            <img
              className="object-cover aspect-square"
              src={
                profileLoadingAvatar
                  ? defaultAvatar
                  : profileHeader.avatar
                  ? profileHeader.avatar
                  : defaultAvatar
              }
              alt=""
            />
          </div>
          <p>{profileHeader.userName}</p>
        </div>
      </header>
    </>
  );
};

export default HeaderSection;
