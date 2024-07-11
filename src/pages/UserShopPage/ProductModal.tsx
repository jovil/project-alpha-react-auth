import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

interface Product {
  productName: string;
  productDescription: string;
  productPrice: string;
  fileUrl: string[];
  paymentLink: string;
}

const ProductModal = ({
  productId,
  onToggleModal,
}: {
  productId: any;
  onToggleModal: any;
}) => {
  const [product, setProduct] = useState<Product | null>(null);

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
        // Ensure result is an object
        if (result && typeof result === "object") {
          setProduct(result);
        } else {
          console.error("Expected an object but got", result);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchProduct();
  }, [productId, onToggleModal]);

  useEffect(() => {
    console.log("product", product);
  }, [product]);

  return (
    <>
      <div
        className="fixed inset-0 bg-dark/60 backdrop-blur z-20"
        onClick={onToggleModal}
      >
        <div
          className="h-full w-2/5 min-h-[calc(100vh-16px)] overflow-scroll ml-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="m-2 bg-white rounded p-2 flex flex-col gap-3">
            {product ? (
              <div>
                <div>
                  {product.fileUrl.map((url, urlIndex) => (
                    <img
                      className="rounded w-full"
                      key={urlIndex}
                      src={url}
                      alt=""
                    />
                  ))}
                </div>

                <h2 className="text-xl">{product.productName}</h2>
                <p className="text-dark/80">{product.productDescription}</p>
                <p className="text-md">RM {product.productPrice}</p>
                <div>
                  <NavLink
                    to={product.paymentLink}
                    className="btn-primary inline-block"
                  >
                    Buy now
                  </NavLink>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
