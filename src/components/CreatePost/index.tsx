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
            <Form className="pointer-events-auto">
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
        </>
      )}
    </>
  );
};

export default CreatePost;
