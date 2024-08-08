import { useEffect, useCallback } from "react";
import { useUser } from "../../context/UserContext";
import { useProducts } from "../../context/ProductsContext";
import CreateProduct from "../../components/CreateProduct";
import { getFetchConfig } from "../../utils/fetchConfig";
import { AnimatePresence } from "framer-motion";
import ProductCard from "../../components/ProductCard";
import CreateProductModal from "../../components/CreateProduct/modal";
import useCreateProduct from "../../hooks/useCreateProduct";

const ShopPage = () => {
  const { userState } = useUser();
  const { allProducts, setAllProducts } = useProducts();
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

  return (
    <>
      <section className="container flex flex-col gap-4">
        <header className="hidden tablet:flex justify-between items-center gap-2 h-7">
          <h1>All products</h1>
        </header>

        <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3 gap-y-9">
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
                  <ProductCard
                    key={index}
                    gridComponent={"productsView"}
                    captionComponent={"showProductsCaption"}
                    data={product}
                  />
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
        </div>
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
