import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import loading from "../../assets/images/loading.gif";

const ProductListComponent = () => {
  const { profileId } = useParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const url = `${process.env.REACT_APP_API_URL}/products/${profileId}`;
      const configuration = {
        method: "GET",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
      };

      try {
        const response = await fetch(url, configuration);
        const result = await response.json();
        setProducts(result);
        console.log("products result", result);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    console.log("products111", products);
  }, [products]);

  const handlePostImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <section className="grid grid-cols-3 gap-1 max-w-[908px] w-full py-16 mx-auto">
      {products.length ? (
        <>
          {products?.map((product: any) => {
            return (
              <div
                className="max-w-[300px] w-full h-auto border border-dark/80 shadow-md rounded p-4 pb-3 flex flex-col gap-3"
                key={product._id}
              >
                <div className="relative aspect-square">
                  <img
                    className={
                      isLoading
                        ? `w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0`
                        : "hidden"
                    }
                    src={isLoading ? loading : ""}
                    alt=""
                  />
                  <img
                    className="aspect-square object-cover rounded-sm"
                    src={product.fileUrl}
                    alt=""
                    loading="lazy"
                    onLoad={handlePostImageLoad}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <p>{product.productName}</p>
                    <p className="text-sm text-dark/80">
                      {product.productDescription}
                    </p>
                  </div>
                  <p className="ml-auto">RM {product.productPrice}</p>
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
    </section>
  );
};

export default ProductListComponent;
