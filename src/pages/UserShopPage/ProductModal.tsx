import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const ProductModal = ({
  productId,
  onToggleModal,
}: {
  productId: any;
  onToggleModal: any;
}) => {
  const [product, setProduct] = useState<{
    productName: string;
    productDescription: string;
    productPrice: string;
    fileUrl: any;
    paymentLink: string;
  }>({
    productName: "",
    productDescription: "",
    productPrice: "",
    fileUrl: undefined,
    paymentLink: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const url = `${process.env.REACT_APP_API_URL}/product/${productId}`;
      const configuration = {
        method: "GET",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
      };
      try {
        const response = await fetch(url, configuration);
        const result = await response.json();
        setProduct(result);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchProduct();
  }, []);

  useEffect(() => {
    console.log("product", product);
  }, [product]);
  return (
    <>
      <div className="fixed inset-0 bg-dark/80 z-20" onClick={onToggleModal}>
        <div className="h-full overflow-scroll">
          <div className="w-2/5 min-h-[calc(100vh-16px)] m-2 bg-white rounded ml-auto p-2 flex flex-col gap-4">
            <img className="rounded w-full" src={product.fileUrl} alt="" />
            <h2 className="text-xl">{product.productName}</h2>
            <p className="text-dark/80">{product.productDescription}</p>
            <p className="text-md">RM {product.productPrice}</p>
            <NavLink to={product.paymentLink} className="btn-primary">
              Buy now
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
