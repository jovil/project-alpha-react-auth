import { useEffect, useCallback, useState, useContext } from "react";
import { GlobalStateContext } from "../../context/Context";
import { useUser } from "../../context/UserContext";
import { useProducts } from "../../context/ProductsContext";
import ProductModal from "../../components/ProductModalComponent";
import CreateProductComponent from "../../components/CreateProductComponent";
import loading from "../../assets/images/loading.gif";
import iconGrid from "../../assets/images/icon-grid.svg";
import iconList from "../../assets/images/icon-list.svg";
import { getFetchConfig } from "../../utils/fetchConfig";
import { AnimatePresence } from "framer-motion";

const ShopPage = () => {
  const { state, setState } = useContext(GlobalStateContext);
  const { userState } = useUser();
  const { allProducts, setAllProducts } = useProducts();
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [productId, setProductId] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/products`;

    try {
      const response = await fetch(url, getFetchConfig);
      const result = await response.json();
      setAllProducts(result);
    } catch (error) {
      console.log("error creating post", error);
    }
  }, [setAllProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchProducts = async () => {
      const url = `${process.env.REACT_APP_API_URL}/products`;

      try {
        const response = await fetch(url, getFetchConfig);
        const result = await response.json();
        setAllProducts(result);
      } catch (error) {
        console.log("error creating post", error);
      }
    };
    fetchProducts();
  }, [setAllProducts]);

  useEffect(() => {
    document.body.style.overflow = isProductModalVisible ? "hidden" : "auto";
  }, [isProductModalVisible]);

  const handleProductImageLoad = () => {
    setIsLoading(false);
  };

  const handleToggleModal = (productItemId: any) => {
    setProductId(productItemId);
    setIsProductModalVisible((prevState) => !prevState);
  };

  const handleProductsGridView = () => {
    setState({ ...state, productsView: "grid" });
  };

  const handleProductsListView = () => {
    setState({ ...state, productsView: "list" });
  };

  return (
    <>
      <section className="max-w-[908px] w-full mx-auto flex flex-col gap-4">
        <header className="hidden tablet:flex justify-between items-center gap-2">
          <>
            <h1>All products</h1>
          </>
          <div className="flex justify-end">
            <button>
              <img
                className={`w-7 h-7 p-1.5 rounded-full ${
                  state.productsView === "list" ? "bg-dark/10" : ""
                }`}
                src={iconList}
                onClick={handleProductsListView}
                alt=""
              />
            </button>
            <button>
              <img
                className={`w-7 h-7 p-1.5 rounded-full ${
                  state.productsView === "grid" ? "bg-dark/10" : ""
                }`}
                src={iconGrid}
                onClick={handleProductsGridView}
                alt=""
              />
            </button>
          </div>
        </header>
        <div
          className={`grid gap-1 ${
            state.productsView === "grid"
              ? "tablet:grid-cols-2 desktop:grid-cols-3"
              : ""
          }`}
        >
          {allProducts?.length ? (
            <>
              {allProducts?.map((product: any) => {
                if (!product || !product.fileUrl || !product.fileUrl.length) {
                  console.warn(
                    "Product or fileUrl is undefined or empty",
                    product
                  );
                  return null; // Skip this product if data is invalid
                }

                return (
                  <div
                    className={`w-full h-auto border border-dark/80 shadow-md rounded ${
                      state.productsView === "grid"
                        ? "desktop:max-w-[300px] flex-col tablet:aspect-[3/4] flex tablet:gap-3 relative overflow-hidden group"
                        : "tablet:grid tablet:grid-cols-12"
                    }`}
                    key={product._id}
                  >
                    <div
                      className={`relative aspect-square ${
                        state.productsView === "grid"
                          ? "tablet:aspect-[3/4] h-full"
                          : "tablet:col-span-4"
                      }`}
                    >
                      {isLoading && (
                        <img
                          className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0"
                          src={loading}
                          alt=""
                        />
                      )}
                      <img
                        className={`tablet:aspect-[3/4] w-full object-cover ${
                          state.productsView === "grid"
                            ? "rounded-sm h-full"
                            : "rounded-l-sm"
                        }`}
                        src={product.fileUrl[product.fileUrl.length - 1] || ""}
                        alt={product.productName}
                        loading="lazy"
                        onLoad={handleProductImageLoad}
                      />
                    </div>
                    <div
                      className={`flex flex-col justify-between gap-4 p-4 w-full ${
                        state.productsView === "grid"
                          ? "tablet:absolute tablet:p-3 tablet:pt-12 tablet:bottom-0 tablet:bg-gradient-to-t tablet:from-dark tablet:text-white tablet:opacity-0 tablet:translate-y-2 tablet:group-hover:opacity-100 tablet:group-hover:translate-y-0 tablet:transition"
                          : "tablet:col-span-8"
                      }`}
                    >
                      <div className="flex flex-col gap-1.5">
                        <p>{product.productName}</p>
                        <p className="text-sm">{product.productDescription}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <button
                          className={`text-xs ${
                            state.productsView === "grid"
                              ? "btn-outline-overlay"
                              : "btn-outline-dark"
                          }`}
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
            <>
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                No products.
              </p>
            </>
          )}
          <AnimatePresence
            initial={false}
            mode="wait"
            onExitComplete={() => null}
          >
            {isProductModalVisible && (
              <ProductModal
                productId={productId}
                onToggleModal={handleToggleModal}
              />
            )}
          </AnimatePresence>
        </div>
      </section>
      {userState._id && <CreateProductComponent />}
    </>
  );
};

export default ShopPage;
