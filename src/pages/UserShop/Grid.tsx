import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { getFetchConfig } from "../../utils/fetchConfig";
import ProductCard from "../../components/ProductCard";
import loadingImage from "../../assets/images/loading.gif";

interface Product {
  _id: string;
  user: string;
  fileUrl: string[];
  productName: string;
  productDescription: string;
  productPrice: string;
  paymentLink: string;
}

const Grid = ({ isUser }: { isUser: any }) => {
  const location = useLocation();
  const { userId } = location.state || {};
  const { userState } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/products/${userId}`;

    try {
      const response = await fetch(url, getFetchConfig);
      const result: Product[] = await response.json();

      // Ensure result is an array and contains the expected fields
      if (Array.isArray(result)) {
        setProducts(result);
      } else {
        console.error("Unexpected API response:", result);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, userState.productCount]);

  return (
    <>
      {loading ? (
        <img
          className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0"
          src={loadingImage}
          alt=""
        />
      ) : (
        <>
          {products.length > 0 && (
            <section className="container flex flex-col gap-4 py-16">
              <header className="hidden tablet:flex justify-between items-center gap-2 h-7">
                <h1 className="subtitle">All products</h1>
              </header>
              <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3 gap-y-9">
                <>
                  {products?.map((product: any, index: number) => {
                    if (
                      !product ||
                      !product.fileUrl ||
                      !product.fileUrl.length
                    ) {
                      console.warn(
                        "Product or fileUrl is undefined or empty",
                        product
                      );
                      return null; // Skip this product if data is invalid
                    }

                    return (
                      <ProductCard
                        key={product._id}
                        product={product}
                        isShowSettings={true}
                      />
                    );
                  })}
                </>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
};

export default Grid;
