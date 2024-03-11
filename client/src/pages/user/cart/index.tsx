import { useEffect } from "react";
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
import { Link } from "react-router-dom";
import style from "./cart.module.css";
import clsx from "clsx";
import {
  DeleteOutlined,
  DownOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";

function CartScreen() {
  const currentUser = localStorage.getItem("userInfor")
    ? JSON.parse(localStorage.getItem("userInfor")!)
    : undefined;

  const { carts, totalPrice, checkAll, totalOriginal, totalCheck } =
    useAppSelector((state) => state.carts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllCart());
  }, []);

  const handleQuantity = async (value: string, e: number | null) => {
    dispatch(changeQuantityCart({ id: value, quantity: e }));
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
                        onClick={() => handleCheck("all")}
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
                      <Space> {numeral(totalPrice).format("0,0$")}</Space>
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
                </Row>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default CartScreen;
