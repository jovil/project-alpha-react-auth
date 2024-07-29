import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useProducts } from "../../context/ProductsContext";
import Notify from "simple-notify";
import "simple-notify/dist/simple-notify.css";
import loading from "../../assets/images/loading.gif";
import Backdrop from "../Backdrop";
import { motion } from "framer-motion";
import { slideInFromRight } from "../../utils/animations";

const CreateProductModal = ({ onToggleModal }: { onToggleModal: any }) => {
  const { userState, setUserState } = useUser();
  const { setAllProducts } = useProducts();
  const [productImages, setProductImages] = useState<string[]>([]);
  const [imageBase64Array, setImageBase64Array] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFilesLength, setUploadedFilesLength] = useState<number>(0);
  const [hasUploadedImages, setHasUploadedImages] = useState<boolean>(true);
  const [isInputProductNameEmpty, setIsInputProductNameEmpty] = useState(false);
  const [isInputPriceEmpty, setIsInputPriceEmpty] = useState(false);
  const [product, setProduct] = useState<{
    productName: string;
    productDescription: string;
    price: string;
    _id: string;
    userName: string;
  }>({
    productName: "",
    productDescription: "",
    price: "",
    _id: userState._id,
    userName: userState.userName,
  });
  const location = useLocation();
  const url = `${process.env.REACT_APP_API_URL}/create/product`;

  useEffect(() => {
    if (product.productName.length > 0) setIsInputProductNameEmpty(false);
  }, [product.productName]);

  useEffect(() => {
    if (product.price.length > 0) setIsInputPriceEmpty(false);
  }, [product.price]);

  useEffect(() => {
    document.body.style.pointerEvents = isLoading ? "none" : "auto";
  }, [isLoading]);

  const handleProductNameInput = () => {
    if (product.productName.length === 0) {
      setIsInputProductNameEmpty(true);
      return false; // Return false if title is empty
    }
    setIsInputProductNameEmpty(false);
    return true; // Return true if title is valid
  };

  const handlePriceInput = () => {
    if (product.price.length === 0) {
      setIsInputPriceEmpty(true);
      return false; // Return false if price is empty
    }
    setIsInputPriceEmpty(false);
    return true; // Return true if price is valid
  };

  const createProduct = async (e: any) => {
    e.preventDefault();

    // Return if no images are uploaded
    if (uploadedFilesLength === 0) return setHasUploadedImages(false);
    // Return if title is empty
    if (!handleProductNameInput()) return;
    // Return if price is empty
    if (!handlePriceInput()) return;
    setIsLoading(true);

    setProduct((prev: any) => {
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
        data._id,
        data.productName,
        data.productDescription.length > 0 ? data.productDescription : " ",
        data.productPrice,
        data.fileUrl
      );
      // Add new product to the start of the array
      setAllProducts((prev: any) => [data, ...prev]);
      if (location.pathname === "/auth")
        !userState.hasProducts && (await updateHasProducts());
      onToggleModal(false);
      setIsLoading(false);
      new Notify({
        title: "Product created successfully",
        text: "Your new product is now live.",
      });
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      document.body.style.pointerEvents = "auto";
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
      await fetch(url, configuration);
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
    const files = Array.from(e.target.files).slice(0, 4);
    const base64Promises = files.map((file: any) => convertToBase64(file));
    const base64Images = await Promise.all(base64Promises);

    setUploadedFilesLength(files.length);
    setImageBase64Array(base64Images as string[]);
    setProductImages(files.map((file: any) => file));
    // Clear the input value to allow re-uploading the same file
    e.target.value = "";
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
    <Backdrop onClick={onToggleModal} showCloseButton={false}>
      <motion.div
        className="h-full w-2/5 overflow-scroll ml-auto cursor-default"
        variants={slideInFromRight}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <section className="min-h-[calc(100vh-16px)] m-2 bg-white rounded p-3 pb-16 flex flex-col gap-3 relative">
          <header>
            <h2>Create product</h2>
          </header>
          <div className="flex flex-col gap-4 items-center w-full">
            <form
              className={`w-full flex flex-col border border-dashed border-dark/60 rounded pointer-events-auto ${
                !hasUploadedImages && uploadedFilesLength === 0
                  ? "!border-danger"
                  : ""
              }`}
              encType="multipart/form-data"
            >
              <label
                className={`p-16 m-0 cursor-pointer ${
                  isLoading ? "pointer-events-none" : ""
                }`}
                htmlFor="product-file-upload"
              >
                <p className="text-sm flex justify-center items-center">
                  {!hasUploadedImages && uploadedFilesLength === 0
                    ? "Upload atleast 1 image"
                    : "Upload images"}
                </p>
              </label>
              <div className="hidden">
                <input
                  id="product-file-upload"
                  multiple
                  type="file"
                  name="image"
                  accept=".jpeg, .png, .jpg"
                  onChange={(e) => handleFileUpload(e)}
                  required
                />
              </div>
            </form>
            <div className="grid grid-cols-4 gap-2 w-full">
              {imageBase64Array.map((base64, index) => (
                <div
                  className="col-span-1 overflow-hidden h-full aspect-square border border-dark/40 rounded"
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
            <form
              className="w-full flex flex-col gap-3"
              onSubmit={(e) => createProduct(e)}
            >
              <input
                type="text"
                className={`border border-dark/40 p-3 rounded ${
                  isInputProductNameEmpty ? "!border-danger" : ""
                }`}
                placeholder="Product Name"
                name="productName"
                value={product.productName}
                onChange={handleChange}
                autoFocus
                required
              />
              <input
                type="number"
                className={`border border-dark/40 p-3 rounded ${
                  isInputPriceEmpty ? "!border-danger" : ""
                }`}
                placeholder="Price (MYR)"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                className="w-full border border-dark/40 p-3 rounded"
                placeholder="Product Description"
                name="productDescription"
                value={product.productDescription}
                onChange={handleChange}
              />
              <button type="submit" className="hidden">
                Save
              </button>
            </form>
          </div>
          <footer className="flex justify-end gap-3">
            <button
              className={`min-w-[91px] btn-primary text-sm flex justify-center items-center ${
                isLoading
                  ? "bg-blue/20 border-blue/20 text-white/20 shadow-none pointer-events-none"
                  : ""
              }`}
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
      </motion.div>
    </Backdrop>
  );
};

export default CreateProductModal;
