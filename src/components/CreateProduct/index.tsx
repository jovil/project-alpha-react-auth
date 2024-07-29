import Cookies from "universal-cookie";
const cookies = new Cookies();

const CreateProduct = ({
  classes = "",
  btnClasses = "",
  onToggleModal,
}: {
  classes?: string;
  btnClasses?: string;
  onToggleModal: (e: any) => void;
}) => {
  const token = cookies.get("TOKEN");

  return token ? (
    <>
      <div className={classes}>
        <div className="max-w-[948px] flex flex-col justify-center items-center gap-3.5 mx-auto">
          <div className="flex flex-col pointer-events-auto">
            <button
              className={`${btnClasses} cursor-pointer`}
              onClick={onToggleModal}
            >
              Create product
            </button>
          </div>
        </div>
      </div>
    </>
  ) : (
    ""
  );
};

export default CreateProduct;
