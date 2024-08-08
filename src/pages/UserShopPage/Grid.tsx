import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { getFetchConfig } from "../../utils/fetchConfig";
import GridHeader from "../../components/Grid/header";
import GridViewContainer from "../../components/Grid/gridViewContainer";
import ProductCard from "../../components/ProductCard";

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
  const { userId } = useParams();
  const { userState } = useUser();
  const [products, setProducts] = useState<Product[]>([]);

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
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, userState.productCount]);

  return (
    <>
      {products.length > 0 && (
        <section className="container flex flex-col gap-4 py-16">
          <GridHeader
            gridViewProp={"userProductsView"}
            captionProp={"showUserProductsCaption"}
          >
            <h1>All products</h1>
          </GridHeader>
          <GridViewContainer
            gridComponent={"userProductsView"}
            captionComponent={"showUserProductsCaption"}
          >
            <>
              {products?.map((product: any, index: number) => {
                if (!product || !product.fileUrl || !product.fileUrl.length) {
                  console.warn(
                    "Product or fileUrl is undefined or empty",
                    product
                  );
                  return null; // Skip this product if data is invalid
                }

                return (
                  <ProductCard
                    key={index}
                    gridComponent={"userProductsView"}
                    captionComponent={"showUserProductsCaption"}
                    data={product}
                    isShowSettings={true}
                  />
                );
              })}
            </>
          </GridViewContainer>
        </section>
      )}
    </>
  );
};

export default Grid;
