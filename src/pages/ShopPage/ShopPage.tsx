import { useEffect, useCallback, useState, useContext } from "react";
import { GlobalStateContext } from "../../context/Context";
import ProductModal from "../../components/ProductModalComponent";
import loading from "../../assets/images/loading.gif";
import iconGrid from "../../assets/images/icon-grid.svg";
import iconList from "../../assets/images/icon-list.svg";

const ShopPage = () => {
  const { state, setState } = useContext(GlobalStateContext);
  const [allProducts, setAllProducts] = useState<any>();
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [productId, setProductId] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/products`;
    const configuration = {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
    };

    try {
      const response = await fetch(url, configuration);
      const result = await response.json();
      setAllProducts(result);
    } catch (error) {
      console.log("error creating post", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
        <header className="flex justify-end items-center gap-2">
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
        </header>
        <div
          className={`grid gap-1 ${
            state.productsView === "grid" ? "grid-cols-3" : ""
          }`}
        >
          {allProducts?.length ? (
            <>
              {allProducts?.toReversed().map((product: any) => {
                if (!product || !product.fileUrl || !product.fileUrl.length) {
                  console.warn(
                    "Product or fileUrl is undefined or empty",
                    product
                  );
                  return null; // Skip this product if data is invalid
                }

                return (
                  <div
                    className={`w-full h-auto border border-dark/80 shadow-md rounded p-4 pb-3 flex gap-3 ${
                      state.productsView === "grid"
                        ? "max-w-[300px] flex-col"
                        : "grid grid-cols-12"
                    }`}
                    key={product._id}
                  >
                    <div
                      className={`relative aspect-square ${
                        state.productsView === "grid" ? "" : "col-span-4"
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
                        className="aspect-square w-full object-cover rounded-sm"
                        src={product.fileUrl[product.fileUrl.length - 1] || ""}
                        alt={product.productName}
                        loading="lazy"
                        onLoad={handleProductImageLoad}
                      />
                    </div>
                    <div
                      className={`h-full flex flex-col justify-between gap-4 ${
                        state.productsView === "grid" ? "" : "w-full col-span-8"
                      }`}
                    >
                      <div className="flex flex-col gap-1.5">
                        <p>{product.productName}</p>
                        <p className="text-sm text-dark/80">
                          {product.productDescription}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <button
                          className="btn-outline-dark text-xs"
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
          {isProductModalVisible && (
            <ProductModal
              productId={productId}
              onToggleModal={handleToggleModal}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default ShopPage;
