import loading from "../../assets/images/loading.gif";
import defaultAvatar from "../../assets/images/toon_6.png";

const HeaderSection = ({
  isUser,
  isLoadingAvatar,
}: {
  isUser: any;
  isLoadingAvatar: boolean;
}) => {
  return (
    <>
      <header className="flex justify-center relative">
        <div className="text-xs font-medium flex flex-col gap-3 items-center">
          <div className="w-14 h-14 border border-dark/60 rounded shadow-md relative overflow-hidden">
            {isLoadingAvatar && (
              <img
                className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0"
                src={loading}
                alt=""
              />
            )}
            <img
              className="object-cover aspect-square"
              src={
                isLoadingAvatar
                  ? defaultAvatar
                  : isUser.avatar
                  ? isUser.avatar
                  : defaultAvatar
              }
              alt=""
            />
          </div>
          <p>{isUser.userName}</p>
        </div>
      </header>
    </>
  );
};

export default HeaderSection;
