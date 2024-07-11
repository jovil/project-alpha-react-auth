import { useState } from "react";
import { useUser } from "../context/UserContext";
import { Form } from "react-bootstrap";
import loading from "../assets/images/loading.gif";
import { useLocation } from "react-router-dom";

const CreateProductModal = ({ onToggleModal }: { onToggleModal: any }) => {
  const { userState, setUserState } = useUser();
  const [productImages, setProductImages] = useState<string[]>([]);
  const [imageBase64Array, setImageBase64Array] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<{
    productName: string;
    productDescription: string;
    price: string;
    _id: string;
  }>({
    productName: "",
    productDescription: "",
    price: "",
    _id: userState._id,
  });
  const location = useLocation();
  const url = `${process.env.REACT_APP_API_URL}/create/product`;

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

    const formData = new FormData();
    productImages.forEach((file) => {
      formData.append(`image`, file);
    });
    formData.append("product", JSON.stringify(product));

    const configuration = {
      method: "POST", // Specify the request method
      body: formData, // Convert the data to JSON string
    };

    try {
      const response = await fetch(url, configuration);
      const data = await response.json();
      await createStripeProduct(
        data.post._id,
        data.post.productName,
        data.post.productDescription,
        data.post.productPrice,
        data.post.fileUrl
      );

      if (location.pathname === "/auth")
        !userState.hasProducts && (await updateHasProducts());
      onToggleModal(false);
      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      console.log("error", error);
    }
  };

  const createStripeProduct = async (
    productId: string,
    productName: string,
    productDescription: string,
    productPrice: string,
    fileUrl: string[]
  ) => {
    const parsedPrice = Math.round(parseInt(productPrice) * 100);
    const product = {
      productId: productId,
      name: productName,
      description: productDescription,
      images: fileUrl, // string array
      unit_label: "1",
      default_price_data: {
        currency: "myr",
        unit_amount: parsedPrice,
      },
      metadata: {
        merchantName: userState.userName,
        merchantEmail: userState.email,
      },
    };

    const url = `${process.env.REACT_APP_API_URL}/create/stripe/product`;
    const configuration = {
      method: "POST", // Specify the request method
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
      body: JSON.stringify(product), // Convert the data to JSON string
    };

    try {
      const response = await fetch(url, configuration);
      const result = await response.json();
      console.log("result", result);
    } catch (error) {
      console.log("error", error);
    }
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
    const files = Array.from(e.target.files);
    const base64Promises = files.map((file: any) => convertToBase64(file));
    const base64Images = await Promise.all(base64Promises);

    setImageBase64Array(base64Images as string[]);
    setProductImages(files.map((file: any) => file));
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

  const updateHasProducts = async () => {
    const url = `${process.env.REACT_APP_API_URL}/update-hasProducts/${userState._id}`;

    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify({ hasProducts: true }), // Convert the data to JSON string
      });
      setUserState((prev: any) => {
        return {
          ...prev,
          hasProducts: true,
        };
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <div
        className="bg-dark/60 backdrop-blur fixed inset-0 z-20"
        onClick={onToggleModal}
      >
        <div className="w-2/5 h-full overflow-scroll ml-auto">
          <section className="min-h-[calc(100vh-16px)] m-2 rounded p-4 flex flex-col gap-4 bg-white">
            <header>
              <h2>Create product</h2>
            </header>
            <div className="flex flex-col gap-4 items-center w-full">
              <form
                className="w-full flex flex-col border border-dashed border-dark/60 rounded pointer-events-auto"
                encType="multipart/form-data"
              >
                <Form.Label
                  className="p-16 m-0 cursor-pointer"
                  htmlFor="product-file-upload"
                >
                  <p className="text-sm flex justify-center items-center">
                    Upload images
                  </p>
                </Form.Label>
                <Form.Group className="hidden">
                  <Form.Control
                    id="product-file-upload"
                    multiple
                    type="file"
                    name="image"
                    accept=".jpeg, .png, .jpg"
                    onChange={(e) => handleFileUpload(e)}
                  />
                </Form.Group>
              </form>
              <div className="flex flex-nowrap gap-2 w-full">
                {imageBase64Array.map((base64, index) => (
                  <div
                    className="w-[25%] h-full aspect-square border border-dark/40 rounded"
                    key={index}
                  >
                    <img
                      className="w-full object-cover aspect-square"
                      src={base64}
                      alt=""
                    />
                  </div>
                ))}
              </div>
              <Form
                className="w-full flex flex-col gap-3"
                onSubmit={(e) => createProduct(e)}
              >
                <Form.Group>
                  <Form.Control
                    className="w-full border border-dark/40 p-3 rounded"
                    placeholder="Product Name"
                    name="productName"
                    value={product.productName}
                    onChange={handleChange}
                    autoFocus
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    type="number"
                    className="w-full border border-dark/40 p-3 rounded"
                    placeholder="Price (MYR)"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
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
                onClick={onToggleModal}
              >
                Close
              </button>
            </footer>
          </section>
        </div>
      </div>
    </>
  );
};

export default CreateProductModal;
