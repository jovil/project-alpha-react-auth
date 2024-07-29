import Cookies from "universal-cookie";
import { Form } from "react-bootstrap";

const CreatePost = ({
  classes = "",
  btnClasses = "",
  onFileUpload,
}: {
  classes?: string;
  btnClasses?: string;
  onFileUpload: (e: any) => void;
}) => {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");

  return (
    <>
      {token && (
        <>
          <div className={classes}>
            <div className="max-w-[948px] flex flex-col justify-center items-center gap-3.5 mx-auto">
              <Form
                className="flex flex-col pointer-events-auto"
                title="Create post"
              >
                <Form.Label className="m-0" htmlFor="file-upload">
                  <div className={`${btnClasses} cursor-pointer`}>
                    Create post
                  </div>
                </Form.Label>
                <Form.Group className="hidden">
                  <Form.Control
                    id="file-upload"
                    type="file"
                    name="image"
                    accept=".jpeg, .png, .jpg"
                    onChange={onFileUpload}
                  />
                </Form.Group>
              </Form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CreatePost;
