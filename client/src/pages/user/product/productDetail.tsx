import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useDispatch } from "react-redux";
import { getProductById } from "../../../slices/productSlice";
import { Col, Row, Space, Image, Flex, Button } from "antd";
import numeral from "numeral";
import style from "./product.module.css";
import clsx from "clsx";
import Discount from "../../../components/discount/index";
import { addToCart } from "../../../slices/cartSlice";

function ProductDetail() {
  const param = useParams();

  const { product, error } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProductById(param.id));
  }, [param]);

  // add to cart
  const handleAddToCart = () => {
    dispatch(addToCart({ id: product?._id, name: product?.name, quantity: 1 }));
  };

  return (
    <div style={{ padding: "15px", background: "#fff" }}>
      <Row gutter={24}>
        <Col span={12}>
          <Image width="100%" height="435px" src={product?.pic}></Image>
        </Col>
        <Col span={12}>
          <Flex vertical>
            <Space>
              <h1>{product?.name}</h1>
            </Space>
            <Space>
              <Flex align="center">
                <h4>
                  <del>{numeral(product?.price).format("$0,0")}</del>
                </h4>
                <div className={clsx(style.price_total)}>
                  {numeral(product?.total).format("$0,0")}
                </div>
                <h3>
                  <Discount discount={product?.discount}></Discount>
                </h3>
              </Flex>
            </Space>
            <Space style={{ lineHeight: "1.5" }}>{product?.description}</Space>
            <Space
              onClick={handleAddToCart}
              className={clsx(style.add_to_cart)}
            >
              Add to cart
            </Space>
          </Flex>
        </Col>
      </Row>
    </div>
  );
}

export default ProductDetail;
