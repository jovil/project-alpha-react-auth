import { useEffect, useState, useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import { GlobalStateContext } from "../../context/Context";
import ProductModal from "../../components/ProductModalComponent";
import { getFetchConfig } from "../../utils/fetchConfig";
import { AnimatePresence } from "framer-motion";
import GridHeader from "../../components/Grid/header";
import GridViewContainer from "../../components/Grid/gridViewContainer";
import Card from "../../components/Card";

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
  const { state } = useContext(GlobalStateContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [productId, setProductId] = useState();

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
  }, [fetchProducts]);

  useEffect(() => {
    console.log("products", products);
  }, [products]);

  useEffect(() => {
    document.body.style.overflow = isProductModalVisible ? "hidden" : "auto";
  }, [isProductModalVisible]);

  const handleToggleModal = (productItemId: any) => {
    setProductId(productItemId);
    setIsProductModalVisible((prevState) => !prevState);
  };

  return (
    <section className="max-w-[948px] w-full mx-auto flex flex-col gap-4 py-16">
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
        {products.length ? (
          <>
            {products?.toReversed().map((product: any, index: number) => {
              if (!product || !product.fileUrl || !product.fileUrl.length) {
                console.warn(
                  "Product or fileUrl is undefined or empty",
                  product
                );
                return null; // Skip this product if data is invalid
              }

              return (
                <div
                  className="flex flex-col relative group overflow-hidden rounded-3xl"
                  key={index}
                >
                  <Card
                    gridComponent={"userProductsView"}
                    captionComponent={"showUserProductsCaption"}
                    data={product}
                  />
                  {!state.showUserProductsCaption && (
                    <div className="flex flex-col flex-grow justify-between gap-4 tablet:absolute px-3 pb-3 tablet:p-3 tablet:pt-12 tablet:bottom-0 w-full tablet:bg-gradient-to-t tablet:from-dark tablet:text-white tablet:opacity-0 tablet:translate-y-2 tablet:group-hover:opacity-100 tablet:group-hover:translate-y-0 tablet:transition">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex flex-col gap-1.5">
                          <p>{product.productName}</p>
                          <p>RM {product.productPrice}</p>
                        </div>
                        <p className="text-sm">{product.productDescription}</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          className="btn-primary-layered"
                          onClick={() => {
                            handleToggleModal(product._id);
                          }}
                        >
                          Show product
                        </button>
                      </div>
                    </div>
                  )}

                  {state.showUserProductsCaption && (
                    <div className="flex flex-col flex-grow justify-between gap-4 px-3 pb-3 tablet:py-6 w-full">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex flex-col gap-1.5">
                          <p>{product.productName}</p>
                          <p>RM {product.productPrice}</p>
                        </div>
                        <p className="text-sm">{product.productDescription}</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          className="btn-primary-small"
                          onClick={() => {
                            handleToggleModal(product._id);
                          }}
                        >
                          Show product
                        </button>
                      </div>
                    </div>
                  )}
                  <AnimatePresence
                    initial={false}
                    mode="wait"
                    onExitComplete={() => null}
                  >
                    {isProductModalVisible && productId === product._id && (
                      <ProductModal
                        productId={productId}
                        onToggleModal={handleToggleModal}
                      />
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </>
        ) : (
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
            No products.
          </p>
        )}
      </GridViewContainer>
    </section>
  );
};

export default Grid;
