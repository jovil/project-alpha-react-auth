import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import loading from "../../assets/images/loading.gif";
import ProductModal from "../../components/ProductModalComponent";

interface Product {
  _id: string;
  user: string;
  fileUrl: string[];
  productName: string;
  productDescription: string;
  productPrice: string;
  paymentLink: string;
}

const ProductListComponent = () => {
  const { profileId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [productId, setProductId] = useState();

  const fetchProducts = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/products/${profileId}`;
    console.log("Fetching products from:", url); // Log the URL being fetched
    const configuration = {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
    };

    try {
      const response = await fetch(url, configuration);
      const result: Product[] = await response.json();

      // Ensure result is an array and contains the expected fields
      if (Array.isArray(result)) {
        setProducts(result);
      } else {
        console.error("Unexpected API response:", result);
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  }, [profileId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    console.log("products", products);
  }, [products]);

  useEffect(() => {
    document.body.style.overflow = isProductModalVisible ? "hidden" : "auto";
  }, [isProductModalVisible]);

  const handlePostImageLoad = () => {
    setIsLoading(false);
  };

  const handleToggleModal = (productItemId: any) => {
    setProductId(productItemId);
    setIsProductModalVisible((prevState) => !prevState);
  };

  return (
    <section className="grid grid-cols-3 gap-1 max-w-[908px] w-full py-16 mx-auto">
      {products.length ? (
        <>
          {products?.toReversed().map((product: any) => {
            if (!product || !product.fileUrl || !product.fileUrl.length) {
              console.warn("Product or fileUrl is undefined or empty", product);
              return null; // Skip this product if data is invalid
            }

            return (
              <div
                className="max-w-[300px] w-full h-auto border border-dark/80 shadow-md rounded flex flex-col gap-3 relative overflow-hidden group"
                key={product._id}
              >
                <div className="relative aspect-[3/4]">
                  {isLoading && (
                    <img
                      className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0"
                      src={loading}
                      alt=""
                    />
                  )}
                  <img
                    className="aspect-[3/4] w-full object-cover rounded-sm"
                    src={product.fileUrl[product.fileUrl.length - 1] || ""}
                    alt={product.productName}
                    loading="lazy"
                    onLoad={handlePostImageLoad}
                  />
                </div>
                <div className="flex flex-col justify-between gap-4 absolute p-3 pt-12 bottom-0 w-full bg-gradient-to-t from-dark text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition">
                  <div className="flex flex-col gap-1.5">
                    <p>{product.productName}</p>
                    <p className="text-sm">{product.productDescription}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      className="btn-outline-small text-xs"
                      onClick={() => {
                        handleToggleModal(product._id);
                      }}
                    >
                      Show product
                    </button>
                    <p className="ml-auto">RM {product.productPrice}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
          No products.
        </p>
      )}
      {isProductModalVisible && (
        <ProductModal productId={productId} onToggleModal={handleToggleModal} />
      )}
    </section>
  );
};

export default ProductListComponent;
