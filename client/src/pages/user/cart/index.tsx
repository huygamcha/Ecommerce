import React, { Fragment, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  changeQuantityCart,
  deleteCart,
  getAllCart,
} from "../../../slices/cartSlice";
import { Col, Flex, Row, Space, Image, InputNumber, Popconfirm } from "antd";
import numeral from "numeral";
import Discount from "../../../components/discount";
import { Link } from "react-router-dom";
import style from "./cart.module.css";
import clsx from "clsx";
import { DeleteOutlined } from "@ant-design/icons";

function CartScreen() {
  const currentUser = localStorage.getItem("userInfor")
    ? JSON.parse(localStorage.getItem("userInfor")!)
    : undefined;

  const { carts, totalPrice } = useAppSelector((state) => state.carts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllCart());
  }, []);

  const handleQuantity = async (value: string, e: number | null) => {
    dispatch(changeQuantityCart({ id: value, quantity: e }));
    dispatch(getAllCart());
  };

  const handleDelete = async (value: string) => {
    dispatch(deleteCart({ id: value }));
    dispatch(getAllCart());
  };
  console.log("««««« totalPrice »»»»»", totalPrice);
  return (
    <div style={{ padding: "15px", background: "#fff" }}>
      <Row>
        <Col span={12}>
          <h3>Tên sản phẩm</h3>
        </Col>
        <Col span={4}>
          <Flex justify="end">
            <h3>Số lượng</h3>
          </Flex>
        </Col>
        <Col span={4}>
          <Flex justify="end">
            <h3>Đơn giá</h3>
          </Flex>
        </Col>
        <Col span={3}>
          <Flex justify="end">
            <h3>Thành tiền</h3>
          </Flex>
        </Col>
      </Row>

      <Row>
        {carts.map((cart) => (
          <>
            <Col span={24} className={clsx(style.wrapper)}>
              <Row>
                <Col span={12}>
                  <Flex>
                    <Space style={{ margin: "0px 10px" }}>
                      <Image width="40px" height="40px" src={cart?.pic}></Image>
                    </Space>
                    <Flex vertical>
                      <Flex style={{ fontSize: "16px" }}>{cart.name}</Flex>
                      <Space style={{ fontWeight: "bold" }}>
                        {numeral(cart.total).format("$0,0.0")}
                        <Space>
                          <Discount
                            font={9}
                            discount={cart.discount}
                          ></Discount>
                        </Space>
                      </Space>
                    </Flex>
                  </Flex>
                </Col>
                <Col className={clsx(style.flex_center)} span={4}>
                  <InputNumber
                    value={cart.quantity}
                    min={1}
                    max={cart.stock}
                    onChange={(e) => handleQuantity(cart.id, e)}
                  ></InputNumber>
                </Col>
                <Col className={clsx(style.flex_center)} span={4}>
                  {numeral(cart.total).format("$0,0.0")}
                </Col>

                <Col className={clsx(style.flex_center)} span={3}>
                  {numeral(cart.total * cart.quantity).format("$0,0.0")}
                </Col>
                <Col
                  style={{ paddingRight: "10px" }}
                  className={clsx(style.flex_center)}
                  span={1}
                >
                  <Popconfirm
                    title="Xoá sản phẩm"
                    description="Bạn có chắc xoá sản phẩm này không?"
                    onConfirm={() => {
                      handleDelete(cart.id);
                    }}
                  >
                    <DeleteOutlined />
                  </Popconfirm>
                </Col>
              </Row>
            </Col>
          </>
        ))}
      </Row>

      <Col className={clsx(style.payment_wrapper)} span={6} offset={18}>
        <Row justify="end" gutter={[0, 10]}>
          <Col span={24}>
            <Flex justify="space-between">
              <Space>Tính tạm</Space>
              <Space> {numeral(totalPrice).format("$0,0.0")}</Space>
            </Flex>
          </Col>
          <Col span={24}>
            <Flex justify="space-between">
              <Space>Phí ship</Space>
              <Space> {numeral(0).format("$0,0.0")}</Space>
            </Flex>
          </Col>
          <Col span={24}>
            <Flex style={{ fontWeight: "bold" }} justify="space-between">
              <Space>Tổng tiền</Space>
              <Space> {numeral(totalPrice).format("$0,0.0")}</Space>
            </Flex>
          </Col>
          <Col span={24}>
            {currentUser ? (
              <h3 className={clsx(style.button_payment)}>Thanh toán</h3>
            ) : (
              <Link to="/auth/login">
                <h3 className={clsx(style.button_payment)}>
                  Đăng nhập để mua hàng
                </h3>
              </Link>
            )}
          </Col>
        </Row>
      </Col>
    </div>
  );
}

export default CartScreen;
