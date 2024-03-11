import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  changeQuantityCart,
  checkProduct,
  deleteCart,
  getAllCart,
} from "../../../slices/cartSlice";
import {
  Col,
  Flex,
  Row,
  Space,
  Image,
  Popconfirm,
  Checkbox,
  Button,
} from "antd";
import numeral from "numeral";
import { Link, useNavigate } from "react-router-dom";
import style from "./cart.module.css";
import clsx from "clsx";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  DownOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";

function CartScreen() {
  const currentUser = localStorage.getItem("userInfor")
    ? JSON.parse(localStorage.getItem("userInfor")!)
    : undefined;
  const [buy, setBuy] = useState<boolean>(false);

  const { carts, totalPrice, checkAll, totalOriginal, totalCheck } =
    useAppSelector((state) => state.carts);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllCart());
  }, []);

  const handleQuantity = async (value: string, e: number | null) => {
    dispatch(changeQuantityCart({ id: value, quantity: e }));
    dispatch(getAllCart());
  };

  const handleCheck = async (id: string) => {
    dispatch(checkProduct({ id: id }));
    dispatch(getAllCart());
  };

  const handleDelete = async (value: string) => {
    dispatch(deleteCart({ id: value }));
    dispatch(getAllCart());
  };

  return (
    <div className={clsx(style.wrapper_global)}>
      {!buy ? (
        <Row>
          <Col xs={24} sm={24}>
            <Row gutter={14}>
              <Col span={16} className={clsx(style.wrapper)}>
                <div className={clsx(style.wrapper_content)}>
                  <Row>
                    <Col span={10}>
                      <Flex>
                        <Checkbox
                          checked={checkAll}
                          onClick={() => {
                            handleCheck("all");
                          }}
                        >
                          Chọn tất cả ({carts.length})
                        </Checkbox>
                      </Flex>
                    </Col>
                    <Col span={4}>
                      <Flex justify="end">
                        <Space>Giá thành</Space>
                      </Flex>
                    </Col>
                    <Col span={4}>
                      <Flex justify="center" style={{ marginLeft: "30px" }}>
                        <Space>Số lượng</Space>
                      </Flex>
                    </Col>
                    <Col span={4}>
                      <Flex justify="center" style={{ marginLeft: "40px" }}>
                        <Space>Đơn vị</Space>
                      </Flex>
                    </Col>
                    <Col span={2}></Col>
                  </Row>
                  <Row>
                    {carts.map((cart) => (
                      <>
                        <Col span={24}>
                          <Row className={clsx(style.wrapper_detail)}>
                            <Col span={10}>
                              <Flex>
                                <Checkbox
                                  checked={cart.check}
                                  onClick={() => handleCheck(cart.id)}
                                ></Checkbox>
                                <Flex style={{ marginLeft: "10px" }}>
                                  <Space className={clsx(style.wrapper_img)}>
                                    <Image
                                      width="52px"
                                      height="52px"
                                      src={cart?.pic}
                                    ></Image>
                                  </Space>
                                  <Flex vertical>
                                    <Flex className={clsx(style.product_name)}>
                                      {cart.name}
                                    </Flex>
                                  </Flex>
                                </Flex>
                              </Flex>
                            </Col>

                            <Col className={clsx(style.flex_center)} span={4}>
                              <Flex vertical>
                                <Space
                                  className={clsx(style.product_price_discount)}
                                >
                                  {numeral(cart.total * cart.quantity).format(
                                    "0,0$"
                                  )}
                                </Space>
                                <Space
                                  className={clsx(style.product_price_original)}
                                >
                                  <del>
                                    {numeral(cart.price * cart.quantity).format(
                                      "0,0$"
                                    )}
                                  </del>
                                </Space>
                              </Flex>
                            </Col>

                            <Col className={clsx(style.flex_center)} span={4}>
                              <Space
                                className={clsx(style.quantity_detail_wrapper)}
                              >
                                <Space
                                  onClick={() =>
                                    handleQuantity(cart.id, cart.quantity - 1)
                                  }
                                  className={clsx(
                                    cart.quantity === 0
                                      ? style.quantity_icon_detail_disabled
                                      : style.quantity_icon_detail
                                  )}
                                >
                                  <MinusOutlined disabled />
                                </Space>
                                <Space className={clsx(style.quantity_detail)}>
                                  {cart.quantity}
                                </Space>

                                <Space
                                  onClick={() =>
                                    handleQuantity(cart.id, cart.quantity + 1)
                                  }
                                  className={clsx(
                                    cart.quantity === cart.stock
                                      ? style.quantity_icon_detail_disabled
                                      : style.quantity_icon_detail
                                  )}
                                >
                                  <PlusOutlined />
                                </Space>
                              </Space>
                            </Col>

                            <Col className={clsx(style.flex_center)} span={4}>
                              <Space className={clsx(style.product_unit)}>
                                {cart.unit}
                                <DownOutlined />
                                <Flex
                                  className={clsx(style.product_unit_child)}
                                >
                                  <Space>
                                    <CheckCircleOutlined
                                      className={clsx(style.product_unit_img)}
                                    />
                                    {cart.unit}
                                  </Space>
                                  <Space>{cart.price}</Space>
                                </Flex>
                              </Space>
                            </Col>

                            <Col className={clsx(style.flex_center)} span={2}>
                              <Popconfirm
                                title="Xoá sản phẩm"
                                description="Bạn có chắc xoá sản phẩm này không?"
                                onConfirm={() => {
                                  handleDelete(cart.id);
                                }}
                              >
                                <DeleteOutlined style={{ color: "#728091" }} />
                              </Popconfirm>
                            </Col>
                          </Row>
                        </Col>
                      </>
                    ))}
                  </Row>
                </div>
              </Col>
              <Col className={clsx(style.wrapper)} span={8}>
                <div className={clsx(style.wrapper_content)}>
                  <Row justify="end" gutter={[0, 10]}>
                    <Col span={24}>
                      <Flex
                        className={clsx(style.payment_header)}
                        justify="space-between"
                      >
                        <Space>Tổng tiền</Space>
                        <Space> {numeral(totalOriginal).format("0,0$")}</Space>
                      </Flex>
                    </Col>
                    <Col span={24}>
                      <Flex
                        className={clsx(style.payment_header)}
                        justify="space-between"
                      >
                        <Space>Giảm giá trực tiếp</Space>
                        <Space>
                          {" "}
                          {numeral(totalOriginal - totalPrice).format("0,0$")}
                        </Space>
                      </Flex>
                    </Col>
                    <Col span={24}>
                      <Flex
                        justify="space-between"
                        className={clsx(style.payment_header)}
                      >
                        <Space>Giảm giá voucher</Space>
                        <Space> {numeral(0).format("0,0$")}</Space>
                      </Flex>
                    </Col>
                    <Col span={24}>
                      <Flex
                        className={clsx(style.payment_header)}
                        justify="space-between"
                      >
                        <Space>Tiết kiệm được</Space>
                        <Space>
                          {" "}
                          {numeral(totalOriginal - totalPrice).format("0,0$")}
                        </Space>
                      </Flex>
                    </Col>

                    <Col span={24}>
                      <Flex
                        className={clsx(style.payment_prePayment)}
                        justify="space-between"
                      >
                        <Space className={clsx(style.payment_prePayment_name)}>
                          Tạm tính
                        </Space>
                        <Space className={clsx(style.payment_prePayment_price)}>
                          {numeral(totalPrice).format("0,0$")}
                        </Space>
                      </Flex>
                    </Col>
                    <Col span={24}>
                      <button
                        onClick={() => setBuy(true)}
                        className={clsx(
                          style.button_payment,
                          !totalCheck ? style.disable : ""
                        )}
                      >
                        Mua hàng {totalCheck ? `(${totalCheck})` : ""}
                      </button>
                      {/* {currentUser ? (
                      <Link to="/payment">
                        <h3 className={clsx(style.button_payment)}>
                          Thanh toán
                        </h3>
                      </Link>
                    ) : (
                      <Link to="/auth/login">
                        <h3 className={clsx(style.button_payment)}>Mua hàng</h3>
                      </Link>
                    )} */}
                    </Col>
                    <Col span={24}>
                      <div className="ml-[auto]">
                        <svg
                          width="384"
                          height="24"
                          viewBox="0 0 384 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M0 0H384V15.25C384 17.8112 384 19.0917 383.615 20.1135C383.007 21.7306 381.731 23.0068 380.113 23.6154C379.092 24 377.811 24 375.25 24C373.55 24 372.7 24 372.131 23.8888C370.435 23.5578 371.033 23.8255 369.656 22.7819C369.194 22.4314 367.279 20.2894 363.449 16.0053C361.252 13.5472 358.057 12 354.5 12C349.957 12 346.004 14.524 343.967 18.2462C342.376 21.1529 339.814 24 336.5 24C333.186 24 330.624 21.1529 329.033 18.2462C326.996 14.524 323.043 12 318.5 12C313.957 12 310.004 14.524 307.967 18.2462C306.376 21.1529 303.814 24 300.5 24C297.186 24 294.624 21.1529 293.033 18.2462C290.996 14.524 287.043 12 282.5 12C277.957 12 274.004 14.524 271.967 18.2462C270.376 21.1529 267.814 24 264.5 24C261.186 24 258.624 21.1529 257.033 18.2462C254.996 14.524 251.043 12 246.5 12C241.957 12 238.004 14.524 235.967 18.2462C234.376 21.1529 231.814 24 228.5 24C225.186 24 222.624 21.1529 221.033 18.2462C218.996 14.524 215.043 12 210.5 12C205.957 12 202.004 14.524 199.967 18.2462C198.376 21.1529 195.814 24 192.5 24C189.186 24 186.624 21.1529 185.033 18.2462C182.996 14.524 179.043 12 174.5 12C169.957 12 166.004 14.524 163.967 18.2462C162.376 21.1529 159.814 24 156.5 24C153.186 24 150.624 21.1529 149.033 18.2462C146.996 14.524 143.043 12 138.5 12C133.957 12 130.004 14.524 127.967 18.2462C126.376 21.1529 123.814 24 120.5 24C117.186 24 114.624 21.1529 113.033 18.2462C110.996 14.524 107.043 12 102.5 12C97.9574 12 94.0044 14.524 91.9668 18.2462C90.3757 21.1529 87.8137 24 84.5 24C81.1863 24 78.6243 21.1529 77.0332 18.2462C74.9956 14.524 71.0426 12 66.5 12C61.9574 12 58.0044 14.524 55.9668 18.2462C54.3757 21.1529 51.8137 24 48.5 24C45.1863 24 42.6243 21.1529 41.0332 18.2462C38.9956 14.524 35.0426 12 30.5 12C27.1233 12 24.0723 13.3947 21.8918 15.6395C17.3526 20.3123 15.083 22.6487 14.5384 23.008C13.3234 23.8097 13.9452 23.5469 12.5236 23.8598C11.8864 24 11.0076 24 9.25 24C6.21942 24 4.70412 24 3.52376 23.4652C2.19786 22.8644 1.13557 21.8021 0.534817 20.4762C0 19.2959 0 17.7806 0 14.75V0Z"
                            fill="white"
                          ></path>
                        </svg>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <Row>
          <Flex
            style={{
              marginBottom: "10px",
              fontSize: "14px",
              fontWeight: "600",
            }}
            onClick={() => setBuy(false)}
          >
            Danh sách sản phẩm{" "}
            <div style={{ marginLeft: "5px" }}> ({totalCheck})</div>
          </Flex>
          <Col xs={24} sm={24}>
            <Row gutter={14}>
              <Col span={16} className={clsx(style.wrapper)}>
                <div className={clsx(style.wrapper_content)}>
                  <Row>
                    {carts.map((cart) => (
                      <>
                        <Col span={24}>
                          <Row className={clsx(style.wrapper_detail)}>
                            <Col span={14}>
                              <Flex>
                                <Flex style={{ marginLeft: "10px" }}>
                                  <Space className={clsx(style.wrapper_img)}>
                                    <Image
                                      width="52px"
                                      height="52px"
                                      src={cart?.pic}
                                    ></Image>
                                  </Space>
                                  <Flex vertical>
                                    <Flex className={clsx(style.product_name)}>
                                      {cart.name}
                                    </Flex>
                                  </Flex>
                                </Flex>
                              </Flex>
                            </Col>

                            <Col className={clsx(style.flex_center)} span={6}>
                              <Flex>
                                <Space
                                  className={clsx(style.product_price_discount)}
                                >
                                  {numeral(cart.total * cart.quantity).format(
                                    "0,0$"
                                  )}
                                </Space>
                                <Space
                                  className={clsx(style.product_price_original)}
                                >
                                  <del>
                                    {numeral(cart.price * cart.quantity).format(
                                      "0,0$"
                                    )}
                                  </del>
                                </Space>
                              </Flex>
                            </Col>

                            <Col className={clsx(style.flex_center)} span={4}>
                              <div>
                                x{cart.quantity} {cart.unit}
                              </div>
                            </Col>

                            {/* <Col className={clsx(style.flex_center)} span={2}>
                              <Popconfirm
                                title="Xoá sản phẩm"
                                description="Bạn có chắc xoá sản phẩm này không?"
                                onConfirm={() => {
                                  handleDelete(cart.id);
                                }}
                              >
                                <DeleteOutlined style={{ color: "#728091" }} />
                              </Popconfirm>
                            </Col> */}
                          </Row>
                        </Col>
                      </>
                    ))}
                  </Row>
                </div>
              </Col>
              <Col className={clsx(style.wrapper)} span={8}>
                <div className={clsx(style.wrapper_content)}>
                  <Row justify="end" gutter={[0, 10]}>
                    <Col span={24}>
                      <Flex
                        className={clsx(style.payment_header)}
                        justify="space-between"
                      >
                        <Space>Tổng tiền</Space>
                        <Space> {numeral(totalOriginal).format("0,0$")}</Space>
                      </Flex>
                    </Col>
                    <Col span={24}>
                      <Flex
                        className={clsx(style.payment_header)}
                        justify="space-between"
                      >
                        <Space>Giảm giá trực tiếp</Space>
                        <Space>
                          {" "}
                          {numeral(totalOriginal - totalPrice).format("0,0$")}
                        </Space>
                      </Flex>
                    </Col>
                    <Col span={24}>
                      <Flex
                        justify="space-between"
                        className={clsx(style.payment_header)}
                      >
                        <Space>Giảm giá voucher</Space>
                        <Space> {numeral(0).format("0,0$")}</Space>
                      </Flex>
                    </Col>
                    <Col span={24}>
                      <Flex
                        className={clsx(style.payment_header)}
                        justify="space-between"
                      >
                        <Space>Tiết kiệm được</Space>
                        <Space>
                          {" "}
                          {numeral(totalOriginal - totalPrice).format("0,0$")}
                        </Space>
                      </Flex>
                    </Col>

                    <Col span={24}>
                      <Flex
                        className={clsx(style.payment_prePayment)}
                        justify="space-between"
                      >
                        <Space className={clsx(style.payment_prePayment_name)}>
                          Tạm tính
                        </Space>
                        <Space className={clsx(style.payment_prePayment_price)}>
                          {numeral(totalPrice).format("0,0$")}
                        </Space>
                      </Flex>
                    </Col>
                    <Col span={24}>
                      <button
                        onClick={() => setBuy(true)}
                        className={clsx(
                          style.button_payment,
                          !totalCheck ? style.disable : ""
                        )}
                      >
                        Hoàn tất {totalCheck ? `(${totalCheck})` : ""}
                      </button>
                    </Col>
                    <Col span={24}>
                      <div className="ml-[auto]">
                        <svg
                          width="384"
                          height="24"
                          viewBox="0 0 384 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M0 0H384V15.25C384 17.8112 384 19.0917 383.615 20.1135C383.007 21.7306 381.731 23.0068 380.113 23.6154C379.092 24 377.811 24 375.25 24C373.55 24 372.7 24 372.131 23.8888C370.435 23.5578 371.033 23.8255 369.656 22.7819C369.194 22.4314 367.279 20.2894 363.449 16.0053C361.252 13.5472 358.057 12 354.5 12C349.957 12 346.004 14.524 343.967 18.2462C342.376 21.1529 339.814 24 336.5 24C333.186 24 330.624 21.1529 329.033 18.2462C326.996 14.524 323.043 12 318.5 12C313.957 12 310.004 14.524 307.967 18.2462C306.376 21.1529 303.814 24 300.5 24C297.186 24 294.624 21.1529 293.033 18.2462C290.996 14.524 287.043 12 282.5 12C277.957 12 274.004 14.524 271.967 18.2462C270.376 21.1529 267.814 24 264.5 24C261.186 24 258.624 21.1529 257.033 18.2462C254.996 14.524 251.043 12 246.5 12C241.957 12 238.004 14.524 235.967 18.2462C234.376 21.1529 231.814 24 228.5 24C225.186 24 222.624 21.1529 221.033 18.2462C218.996 14.524 215.043 12 210.5 12C205.957 12 202.004 14.524 199.967 18.2462C198.376 21.1529 195.814 24 192.5 24C189.186 24 186.624 21.1529 185.033 18.2462C182.996 14.524 179.043 12 174.5 12C169.957 12 166.004 14.524 163.967 18.2462C162.376 21.1529 159.814 24 156.5 24C153.186 24 150.624 21.1529 149.033 18.2462C146.996 14.524 143.043 12 138.5 12C133.957 12 130.004 14.524 127.967 18.2462C126.376 21.1529 123.814 24 120.5 24C117.186 24 114.624 21.1529 113.033 18.2462C110.996 14.524 107.043 12 102.5 12C97.9574 12 94.0044 14.524 91.9668 18.2462C90.3757 21.1529 87.8137 24 84.5 24C81.1863 24 78.6243 21.1529 77.0332 18.2462C74.9956 14.524 71.0426 12 66.5 12C61.9574 12 58.0044 14.524 55.9668 18.2462C54.3757 21.1529 51.8137 24 48.5 24C45.1863 24 42.6243 21.1529 41.0332 18.2462C38.9956 14.524 35.0426 12 30.5 12C27.1233 12 24.0723 13.3947 21.8918 15.6395C17.3526 20.3123 15.083 22.6487 14.5384 23.008C13.3234 23.8097 13.9452 23.5469 12.5236 23.8598C11.8864 24 11.0076 24 9.25 24C6.21942 24 4.70412 24 3.52376 23.4652C2.19786 22.8644 1.13557 21.8021 0.534817 20.4762C0 19.2959 0 17.7806 0 14.75V0Z"
                            fill="white"
                          ></path>
                        </svg>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default CartScreen;
