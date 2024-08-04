import { useEffect, useCallback, useState, useContext } from "react";
import { GlobalStateContext } from "../../context/Context";
import { useUser } from "../../context/UserContext";
import { useProducts } from "../../context/ProductsContext";
import ProductModal from "../../components/ProductModal";
import CreateProduct from "../../components/CreateProduct";
import { getFetchConfig } from "../../utils/fetchConfig";
import { AnimatePresence } from "framer-motion";
import GridHeader from "../../components/Grid/header";
import GridViewContainer from "../../components/Grid/gridViewContainer";
import UserAvatar from "../../components/Card/userAvatar";
import Card from "../../components/Card";
import CreateProductModal from "../../components/CreateProduct/modal";
import useCreateProduct from "../../hooks/useCreateProduct";

const ShopPage = () => {
  const { state } = useContext(GlobalStateContext);
  const { userState } = useUser();
  const { allProducts, setAllProducts } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [productId, setProductId] = useState();
  const { isShowModal, handleToggleCreateProductModal } = useCreateProduct();

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

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [fetchProducts]);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  const handleToggleModal = (productItemId: any) => {
    setProductId(productItemId);
    setShowModal((prevState) => !prevState);
  };

  return (
    <>
      <section className="container flex flex-col gap-4">
        <GridHeader
          gridViewProp={"productsView"}
          captionProp={"showProductsCaption"}
        >
          <h1>All products</h1>
        </GridHeader>
        <GridViewContainer
          gridComponent={"productsView"}
          captionComponent={"showProductsCaption"}
        >
          {allProducts?.length ? (
            <>
              {allProducts?.map((product: any, index: number) => {
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
                      gridComponent={"productsView"}
                      captionComponent={"showProductsCaption"}
                      data={product}
                    />
                    {!state.showProductsCaption && (
                      <div className="flex flex-col justify-between gap-6 tablet:absolute px-3 pb-3 tablet:p-3 tablet:pt-12 tablet:bottom-0 w-full tablet:bg-gradient-to-t tablet:from-dark tablet:text-white tablet:opacity-0 tablet:translate-y-2 tablet:group-hover:opacity-100 tablet:group-hover:translate-y-0 tablet:transition">
                        <div className="flex flex-col gap-1.5">
                          <p>{product.productName}</p>
                          <p className="text-sm">
                            {product.productDescription}
                          </p>
                        </div>

                        <div className="flex flex-col gap-4">
                          <UserAvatar data={product} />

                          <div className="flex justify-between items-center">
                            <button
                              className="btn-primary-layered"
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
                    )}

                    {state.showProductsCaption && (
                      <div className="flex flex-col justify-between gap-6 px-3 pb-3 tablet:py-6 w-full flex-grow">
                        <div className="flex flex-col gap-1.5">
                          <p>{product.productName}</p>
                          <p className="text-sm">
                            {product.productDescription}
                          </p>
                        </div>

                        <div className="flex flex-col gap-4">
                          <UserAvatar data={product} />

                          <div className="flex justify-between items-center">
                            <button
                              className="btn-primary-small"
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
                    )}
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
            {showModal && (
              <ProductModal
                productId={productId}
                onToggleModal={handleToggleModal}
              />
            )}
          </AnimatePresence>
        </GridViewContainer>
      </section>
      {userState && userState._id && (
        <>
          <CreateProduct
            classes="fixed bottom-0 left-1/2 -translate-x-1/2 z-10 px-4 py-3.5 pointer-events-none"
            btnClasses="btn-primary rounded-full text-sm flex gap-2 justify-center items-center cursor-pointer"
            onToggleModal={handleToggleCreateProductModal}
          />
          <AnimatePresence
            initial={false}
            mode="wait"
            onExitComplete={() => null}
          >
            {isShowModal && (
              <CreateProductModal
                onToggleModal={handleToggleCreateProductModal}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default ShopPage;
