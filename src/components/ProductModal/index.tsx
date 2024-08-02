import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Swiper from "swiper";
import "swiper/css";
import { Thumbs } from "swiper/modules";
import Backdrop from "../Backdrop";
import { motion } from "framer-motion";
import loading from "../../assets/images/loading.gif";
import { getFetchConfig } from "../../utils/fetchConfig";
import { slideInFromRight } from "../../utils/animations";

interface Product {
  productName: string;
  productDescription: string;
  productPrice: string;
  fileUrl: string[];
  paymentLink: string;
}

const ProductModal = ({
  productId,
  onToggleModal,
}: {
  productId: any;
  onToggleModal: any;
}) => {
  Swiper.use([Thumbs]);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initSwiper = () => {
    const swiperThumbs = new Swiper(".swiper-thumbs", {
      spaceBetween: 12,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });

    new Swiper(".swiper", {
      spaceBetween: 12,
      speed: 400,
      slidesPerView: 1,
      initialSlide: 0,
      allowTouchMove: false,
      on: {
        init: function () {
          setIsLoading(false);
        },
      },
      thumbs: {
        swiper: swiperThumbs,
      },
    });
  };

  useEffect(() => {
    initSwiper();
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      const url = `${process.env.REACT_APP_API_URL}/product/${productId}`;

      try {
        const response = await fetch(url, getFetchConfig);
        const result = await response.json();
        // Ensure result is an object
        if (result && typeof result === "object") {
          setProduct(result);
        } else {
          console.error("Expected an object but got", result);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchProduct();
  }, [productId]);

  return (
    <Backdrop onClick={onToggleModal} showCloseButton={false}>
      <motion.div
        className="h-full w-2/5 overflow-scroll ml-auto cursor-default"
        variants={slideInFromRight}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-h-[calc(100vh-16px)] m-2 bg-white rounded p-3 pb-16 flex flex-col gap-3 relative">
          {product ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="swiper m-0">
                  <div className="swiper-wrapper">
                    {product.fileUrl.toReversed().map((url, urlIndex) => (
                      <div
                        className="swiper-slide aspect-square flex justify-center items-center"
                        key={urlIndex}
                      >
                        {isLoading ? (
                          <img className="w-6 h-6" src={loading} alt="" />
                        ) : (
                          <img
                            className="rounded object-cover w-full max-h-[80vh] min-h-full"
                            key={urlIndex}
                            src={url}
                            alt=""
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="swiper-thumbs">
                  <div className="swiper-wrapper">
                    {product.fileUrl.toReversed().map((url, urlIndex) => (
                      <div
                        className="swiper-slide cursor-pointer"
                        key={urlIndex}
                      >
                        {isLoading ? (
                          <img className="w-6 h-6" src={loading} alt="" />
                        ) : (
                          <img
                            className="rounded object-cover w-full aspect-square"
                            key={urlIndex}
                            src={url}
                            alt=""
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-14">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl">{product.productName}</h2>
                  <p className="text-xl">RM {product.productPrice}</p>
                </div>

                <div>
                  <NavLink
                    to={product.paymentLink}
                    className="btn-primary block text-center py-2.5"
                  >
                    Buy now
                  </NavLink>
                </div>
              </div>

              {product.productDescription && (
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Description</p>
                  <p className="text-dark/80">{product.productDescription}</p>
                </div>
              )}
            </div>
          ) : (
            <img
              className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              src={loading}
              alt=""
            />
          )}
        </div>
      </motion.div>
    </Backdrop>
  );
};

export default ProductModal;
