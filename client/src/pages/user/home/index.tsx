import { Carousel } from "antd";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getAllProduct } from "../../../slices/productSlice";

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
          products.map((product) => (
            <div style={contentStyle}>
              <img src={`${product.pic}`} alt="" style={contentStyle}></img>
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
