import { useState, useEffect } from "react";
import { useUser } from "../../pages/Context/UserContext";
import { Form } from "react-bootstrap";
import Cookies from "universal-cookie";
import loading from "../../assets/images/loading.gif";
import defaultAvatar from "../../assets/images/avatar.jpeg";
const cookies = new Cookies();

const CreateProduct = () => {
  const { userState } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [productImage, setProductImage] = useState<string>("");
  const [product, setProduct] = useState<{
    productName: string;
    productDescription: string;
    price: string;
    _id: string;
  }>({
    productName: "",
    productDescription: "",
    price: "",
    _id: "",
  });
  const token = cookies.get("TOKEN");
  const url = `${process.env.REACT_APP_API_URL}/create/product`;

  useEffect(() => {
    setProduct((prev: any) => {
      return {
        ...prev,
        _id: userState._id,
      };
    });
  }, [userState._id]);

  const createProduct = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    setProduct((prev) => {
      return {
        ...prev,
        productName: product.productName,
        productDescription: product.productDescription,
        productPrice: product.price,
      };
    });

    console.log("create product", product);

    const file = productImage;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("product", JSON.stringify(product));

    const configuration = {
      method: "POST", // Specify the request method
      body: formData, // Convert the data to JSON string
    };

    try {
      await fetch(url, configuration);
      setShowModal(false);
      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      console.log("error", error);
    }
  };

  const closeModal = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    setShowModal(false);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setProduct((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);

    setImageBase64(base64 as string);
    setProductImage(file);
    setShowModal(true);
  };

  function convertToBase64(file: File) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  return token ? (
    <>
      {showModal && (
        <div
          className="bg-dark/80 backdrop-blur p-4 fixed inset-0 z-10 flex justify-center items-center"
          onClick={closeModal}
        >
          <section className="w-[500px] p-4 mx-auto flex flex-col gap-4 bg-white rounded-md">
            <header>
              <h2>Create product</h2>
            </header>
            <div className="flex flex-col gap-4 items-center w-full">
              {productImage && (
                <img
                  className="w-full h-[50vh] object-cover border border-dark/40 rounded"
                  src={imageBase64}
                  alt=""
                />
              )}
              <Form className="w-full" onSubmit={(e) => createProduct(e)}>
                <Form.Group className="flex flex-col gap-4">
                  <div className="grid grid-cols-12 gap-2">
                    <Form.Control
                      className="col-span-9 border border-dark/40 p-3 rounded"
                      placeholder="Product Name"
                      name="productName"
                      value={product.productName}
                      onChange={handleChange}
                      autoFocus
                      required
                    />
                    <Form.Control
                      type="number"
                      className="col-span-3 border border-dark/40 p-3 rounded"
                      placeholder="Price (MYR)"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Form.Group>
                    <Form.Control
                      className="w-full border border-dark/40 p-3 rounded"
                      placeholder="Product Description"
                      name="productDescription"
                      value={product.productDescription}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <button type="submit" className="hidden">
                    Save
                  </button>
                </Form.Group>
              </Form>
            </div>
            <footer className="flex justify-end gap-3">
              <button
                className="min-w-[91px] btn-primary text-sm flex justify-center items-center"
                onClick={createProduct}
              >
                {isLoading ? (
                  <img className="w-4 h-4 object-cover" src={loading} alt="" />
                ) : (
                  "Publish"
                )}
              </button>
              <button
                className="btn-outline-danger text-sm"
                onClick={closeModal}
              >
                Close
              </button>
            </footer>
          </section>
        </div>
      )}
      <div className="fixed bottom-0 right-0 left-0 z-10 px-4 py-3.5 pointer-events-none">
        <div className="max-w-[908px] flex flex-col justify-center items-center gap-3.5 mx-auto">
          <img
            className="rounded-full w-10 h-10 object-cover border border-dark/30 shadow-md"
            src={userState.avatar64 ? userState.avatar64 : defaultAvatar}
            alt=""
          />
          <Form className="flex flex-col pointer-events-auto">
            <Form.Label className="m-0" htmlFor="file-upload">
              <div className="btn-primary rounded-full text-sm flex gap-2 justify-center items-center cursor-pointer">
                Create product
              </div>
            </Form.Label>
            <Form.Group className="hidden">
              <Form.Control
                id="file-upload"
                type="file"
                name="image"
                accept=".jpeg, .png, .jpg"
                onChange={(e) => handleFileUpload(e)}
              />
            </Form.Group>
          </Form>
        </div>
      </div>
    </>
  ) : (
    ""
  );
};

export default CreateProduct;
