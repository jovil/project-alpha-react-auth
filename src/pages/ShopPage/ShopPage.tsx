import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../../context/UserContext";
import { useProducts } from "../../context/ProductsContext";
import CreateProduct from "../../components/CreateProduct";
import { getFetchConfig } from "../../utils/fetchConfig";
import { AnimatePresence } from "framer-motion";
import ProductCard from "../../components/ProductCard";
import CreateProductModal from "../../components/CreateProduct/modal";
import useCreateProduct from "../../hooks/useCreateProduct";

enum SortBy {
  Newest = "newest",
  PriceAscending = "price-ascending",
  PriceDescending = "price-descending",
}

const ShopPage = () => {
  const { userState } = useUser();
  const { allProducts, setAllProducts } = useProducts();
  const { isShowModal, handleToggleCreateProductModal } = useCreateProduct();
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.Newest);
  const [fetchedProducts, setFetchedProducts] = useState<any[]>([]); // Store fetched products

  const fetchProducts = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_URL}/products`;

    try {
      const response = await fetch(url, getFetchConfig);
      const result = await response.json();
      setFetchedProducts(result); // Store fetched products
      sortAndSetProducts(result, sortBy); // Apply sorting immediately after fetching
    } catch (error) {
      console.log("error creating post", error);
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchProducts();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [fetchProducts]);

  useEffect(() => {}, []);

  const sortAndSetProducts = (products: any[], sortBy: SortBy) => {
    let sortedProducts = [];

    switch (sortBy) {
      case SortBy.Newest:
        sortedProducts = [...products].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;

      case SortBy.PriceAscending:
        sortedProducts = [...products].sort(
          (a, b) => parseFloat(a.productPrice) - parseFloat(b.productPrice)
        );
        break;

      case SortBy.PriceDescending:
        sortedProducts = [...products].sort(
          (a, b) => parseFloat(b.productPrice) - parseFloat(a.productPrice)
        );
        break;

      default:
        sortedProducts = products;
        break;
    }

    setAllProducts(sortedProducts);
  };

  const handleSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value as SortBy;
    setSortBy(newSortBy);
    sortAndSetProducts(fetchedProducts, newSortBy); // Sort fetched products on client side
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchedProducts = fetchedProducts.filter((product: any) =>
      product.productName.toLowerCase().includes(e.target.value.toLowerCase())
    );

    sortAndSetProducts(searchedProducts, sortBy);
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <section className="container flex flex-col gap-12">
        <header className="hidden tablet:flex justify-end items-center gap-4">
          <form className="min-w-[200px]" onSubmit={handleSubmit}>
            <input
              className="font-bold border-2 border-[#444] p-3 py-2 rounded w-full"
              type="search"
              placeholder="Search product"
              onChange={handleSearch}
            />
          </form>

          <div>
            <form>
              <div className="relative">
                <select
                  className="font-bold border-2 border-[#444] p-3 py-2 rounded min-w-[200px]"
                  name="state"
                  value={sortBy}
                  onChange={handleSortBy}
                >
                  <option value={SortBy.Newest}>Newest</option>
                  <option value={SortBy.PriceAscending}>
                    Price, low to high
                  </option>
                  <option value={SortBy.PriceDescending}>
                    Price, high to low
                  </option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="h-5 w-5 pointer-events-none"
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 8.86035L12 15.8604L19 8.86035"
                      stroke="#5D5A88"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </form>
          </div>
        </header>

        <div className="grid gap-6 tablet:grid-cols-2 desktop:grid-cols-3 gap-y-9">
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

                return <ProductCard key={index} data={product} />;
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
            btnClasses="btn-chunky-primary text-sm flex gap-2 justify-center items-center cursor-pointer"
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
