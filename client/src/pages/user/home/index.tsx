import { Carousel } from "antd";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getAllProduct } from "../../../slices/productSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";

function HomeScreen() {
  const { products, error } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // dispatch(getAllProduct({}));
  }, []);

  const contentStyle: React.CSSProperties = {
    color: "red",
    lineHeight: "300px",
    textAlign: "center",
    background: "#364d79",
    width: "100%",
    height: "300px",
    // objectFit: "cover",
  };
  return (
    <>
      <Carousel easing="linear" speed={200} autoplay>
        {products ? (
          products.map((product, index) => (
            <div key={index} style={contentStyle}>
              <LazyLoadImage
                effect="blur"
                src={`${product.pic}`}
                alt="home"
                style={contentStyle}
              />
            </div>
          ))
        ) : (
          <></>
        )}
        {/* <div>
          <div style={contentStyle}></div>
        </div> */}
      </Carousel>
    </>
  );
}

export default HomeScreen;
