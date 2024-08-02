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
        <div className="pointer-events-auto">
          <button
            className={`${btnClasses} cursor-pointer`}
            onClick={onToggleModal}
          >
            Create product
          </button>
        </div>
      </div>
    </>
  ) : (
    ""
  );
};

export default CreateProduct;
