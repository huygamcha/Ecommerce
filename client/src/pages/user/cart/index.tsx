import React, { useEffect, useRef, useState } from "react";
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
  Form,
  Input,
  ConfigProvider,
  Select,
  Radio,
  Empty,
  Breadcrumb,
} from "antd";
import numeral from "numeral";
import { Link, useLocation, useNavigate } from "react-router-dom";
import style from "./cart.module.css";
import clsx from "clsx";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  DownOutlined,
  InfoCircleOutlined,
  MinusOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { MdLocationOn } from "react-icons/md";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { FiChevronDown, FiChevronUp, FiChevronLeft } from "react-icons/fi";

import axios from "axios";
import {
  getAllProductSearch,
  getProductById,
  updateProduct,
} from "../../../slices/productSlice";
import { createOrder } from "../../../slices/orderSlice";
import NoCart from "../../../components/noCart";
import { getAllLocation } from "../../../slices/locationSlice";
import { FaClock, FaLocationCrosshairs, FaLocationDot } from "react-icons/fa6";

function CartScreen() {
  const locationPath = useLocation();
  const [buy, setBuy] = useState<boolean>(false);
  const [whereBuy, setWhereBuy] = useState<boolean>(true);

  // mobile mở đóng giá chi tiết mua hàng
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const { carts, totalPrice, checkAll, totalOriginal, totalCheck } =
    useAppSelector((state) => state.carts);
  const { location, locations } = useAppSelector((state) => state.locations);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllCart());
    dispatch(getAllLocation());
    getProvince();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [locationPath, buy]);

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

  type FieldType = {
    nameOrder: string;
    phoneOrder: string;
    // name: string;
    // phone: number;
    email: string;
    province: string;
    district: string;
    commune: string;
    addressDetail: string;
    typePayment: string;
    notice: string;
  };
  const [cartForm] = Form.useForm<FieldType>();

  // thong tin
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [commune, setCommune] = useState([]);

  const getProvince = async () => {
    const data = await axios.get(
      "https://api.mysupership.vn/v1/partner/areas/province"
    );
    setProvince(data.data.results);
  };

  const handleDistrict = async (id: string) => {
    cartForm.setFieldValue("district", null);
    cartForm.setFieldValue("commune", null);
    const data = await axios.get(
      `https://api.mysupership.vn/v1/partner/areas/district?province=${id}`
    );
    setDistrict(data.data.results);
  };

  const handleCommune = async (id: string) => {
    cartForm.setFieldValue("commune", null);
    const data = await axios.get(
      `https://api.mysupership.vn/v1/partner/areas/commune?district=${id}`
    );
    setCommune(data.data.results);
  };

  const handleDetail = (value: string, categoryId: string) => {
    localStorage.setItem("filter", JSON.stringify({ categoryId: categoryId }));
    localStorage.setItem("productId", JSON.stringify(value));

    dispatch(getProductById(value));
    dispatch(getAllProductSearch({ categoryId: categoryId }));
  };

  const onFinish = async (values: FieldType) => {
    carts &&
      carts.map(async (value: any) => {
        console.log("««««« value cart »»»»»", value);
        await dispatch(
          updateProduct({
            id: value.id,
            values: { ...value, quantity: value.quantity, autoQuantity: 1 },
          })
        );
      });
    await dispatch(createOrder({ ...values, listProduct: carts }));
    navigate("/cart/thanhcong");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        background: "#edf0f3",
      }}
    >
      <div className={clsx(style.wrapper_global)}>
        {carts.length ? (
          <>
            {!buy ? (
              <>
                <Row className={clsx(style.breadcrumb_wrapper)}>
                  <Flex className={clsx(style.button_back_cart)}>
                    <Breadcrumb
                      items={[
                        {
                          title: (
                            <Space>
                              <Link
                                className={clsx(
                                  style.button_home,
                                  style.mobile
                                )}
                                to={"/"}
                              >
                                Trang chủ
                              </Link>
                            </Space>
                          ),
                        },
                        {
                          title: "Giỏ hàng",
                        },
                      ]}
                    />
                  </Flex>
                </Row>
                <Row>
                  <Col xs={24} sm={24}>
                    <Row>
                      <Col xs={24} sm={16} className={clsx(style.wrapper)}>
                        <div
                          className={clsx(
                            style.wrapper_content,
                            style.wrapper_left
                          )}
                        >
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
                            <Col xs={0} sm={4}>
                              <Flex justify="end">
                                <Space>Giá thành</Space>
                              </Flex>
                            </Col>
                            <Col xs={0} sm={4}>
                              <Flex
                                justify="center"
                                style={{ marginLeft: "30px" }}
                              >
                                <Space>Số lượng</Space>
                              </Flex>
                            </Col>
                            <Col xs={0} sm={4}>
                              <Flex
                                justify="center"
                                style={{ marginLeft: "30px" }}
                              >
                                <Space>Đơn vị</Space>
                              </Flex>
                            </Col>
                            <Col span={2}></Col>
                          </Row>
                          <Row>
                            {carts.map((cart, index) => (
                              <React.Fragment key={index}>
                                <Col span={24}>
                                  <Row
                                    gutter={[0, 14]}
                                    className={clsx(style.wrapper_detail)}
                                  >
                                    {/* hình ảnh  tên */}
                                    <Col xs={18} sm={10}>
                                      <Flex>
                                        <Checkbox
                                          checked={cart.check}
                                          onClick={() => handleCheck(cart.id)}
                                        ></Checkbox>
                                        <Flex style={{ marginLeft: "10px" }}>
                                          <Space
                                            className={clsx(style.wrapper_img)}
                                          >
                                            <Image
                                              width="52px"
                                              height="52px"
                                              src={cart?.pic}
                                            ></Image>
                                          </Space>
                                          <Flex vertical>
                                            <Link
                                              onClick={() =>
                                                handleDetail(
                                                  cart.id,
                                                  cart.categoryId
                                                )
                                              }
                                              to={`/sanpham/${cart.slug}`}
                                              className={clsx(style.wrapper)}
                                              style={{
                                                backgroundColor: "transparent",
                                              }}
                                            >
                                              <Flex
                                                className={clsx(
                                                  style.product_name
                                                )}
                                              >
                                                {cart.name}
                                              </Flex>
                                            </Link>
                                          </Flex>
                                        </Flex>
                                      </Flex>
                                    </Col>

                                    {/* giá */}
                                    <Col
                                      className={clsx(style.flex_center)}
                                      xs={6}
                                      sm={4}
                                    >
                                      <Flex vertical>
                                        <Space
                                          className={clsx(
                                            style.product_price_discount
                                          )}
                                        >
                                          {numeral(
                                            cart.total * cart.quantity
                                          ).format("0,0$")}
                                        </Space>
                                        <Space
                                          className={clsx(
                                            style.product_price_original
                                          )}
                                        >
                                          {cart && cart?.discount > 0 && (
                                            <del
                                              className={clsx(
                                                style.header_price
                                              )}
                                            >
                                              {numeral(
                                                cart.price * cart.quantity
                                              ).format("0,0$")}
                                            </del>
                                          )}
                                        </Space>
                                      </Flex>
                                    </Col>

                                    {/* số lượng */}
                                    <Col
                                      className={clsx(
                                        style.flex_center,
                                        style.flex_start
                                      )}
                                      xs={8}
                                      sm={4}
                                    >
                                      <Space
                                        className={clsx(
                                          style.quantity_detail_wrapper
                                        )}
                                      >
                                        <Space
                                          onClick={() =>
                                            handleQuantity(
                                              cart.id,
                                              cart.quantity - 1
                                            )
                                          }
                                          className={clsx(
                                            cart.quantity === 1
                                              ? style.quantity_icon_detail_disabled
                                              : style.quantity_icon_detail
                                          )}
                                        >
                                          <MinusOutlined disabled />
                                        </Space>
                                        <Space
                                          className={clsx(
                                            style.quantity_detail
                                          )}
                                        >
                                          {cart.quantity}
                                        </Space>

                                        <Space
                                          onClick={() =>
                                            handleQuantity(
                                              cart.id,
                                              cart.quantity + 1
                                            )
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

                                    {/* đơn vị */}
                                    <Col
                                      className={clsx(style.flex_center)}
                                      xs={8}
                                      sm={4}
                                    >
                                      <Space
                                        className={clsx(style.product_unit)}
                                      >
                                        {cart.unit}
                                        <DownOutlined />
                                        <Flex
                                          className={clsx(
                                            style.product_unit_child
                                          )}
                                        >
                                          <Space>
                                            <CheckCircleOutlined
                                              className={clsx(
                                                style.product_unit_img
                                              )}
                                            />
                                            {cart.unit}
                                          </Space>
                                          <Space>
                                            {numeral(cart.price).format("0,0$")}
                                          </Space>
                                        </Flex>
                                      </Space>
                                    </Col>

                                    <Col
                                      className={clsx(style.flex_center)}
                                      xs={8}
                                      sm={2}
                                    >
                                      <Popconfirm
                                        title="Xoá sản phẩm"
                                        description="Bạn có chắc xoá sản phẩm này không?"
                                        onConfirm={() => {
                                          handleDelete(cart.id);
                                        }}
                                      >
                                        <DeleteOutlined
                                          style={{ color: "#728091" }}
                                        />
                                      </Popconfirm>
                                    </Col>
                                  </Row>
                                </Col>
                              </React.Fragment>
                            ))}
                          </Row>
                        </div>
                      </Col>

                      {/* tổng tiền */}
                      <Col
                        className={clsx(
                          style.wrapper,
                          style.mobile_total_price
                        )}
                        xs={24}
                        sm={8}
                      >
                        <div
                          className={clsx(
                            style.wrapper_content,
                            style.wrapper_right,
                            style.wrapper_content_mobile_preBuy
                          )}
                        >
                          <Row justify="end">
                            <Col span={24}>
                              <Flex
                                className={clsx(
                                  style.payment_header,
                                  style.active
                                )}
                                justify="space-between"
                              >
                                <Space>Tổng tiền</Space>
                                <Space>
                                  {" "}
                                  {numeral(totalOriginal).format("0,0$")}
                                </Space>
                              </Flex>
                            </Col>

                            <Col span={24}>
                              <Flex
                                className={clsx(
                                  style.payment_header,
                                  mobileOpen ? style.active : ""
                                )}
                                justify="space-between"
                              >
                                <Space>Giảm giá trực tiếp</Space>
                                <Space>
                                  {" "}
                                  {numeral(totalOriginal - totalPrice).format(
                                    "0,0$"
                                  )}
                                </Space>
                              </Flex>
                            </Col>

                            <Col span={24}>
                              <Flex
                                justify="space-between"
                                className={clsx(
                                  style.payment_header,
                                  mobileOpen ? style.active : ""
                                )}
                              >
                                <Space>Giảm giá voucher</Space>
                                <Space> {numeral(0).format("0,0$")}</Space>
                              </Flex>
                            </Col>

                            <Col span={24}>
                              <Flex
                                className={clsx(
                                  style.payment_header,
                                  mobileOpen ? style.active : ""
                                )}
                                justify="space-between"
                              >
                                <Space>Tiết kiệm được</Space>
                                <Space>
                                  {" "}
                                  {numeral(totalOriginal - totalPrice).format(
                                    "0,0$"
                                  )}
                                </Space>
                              </Flex>
                            </Col>

                            <Col span={24}>
                              <Flex
                                className={clsx(style.payment_prePayment)}
                                justify="space-between"
                                onClick={() => setMobileOpen(!mobileOpen)}
                              >
                                <Space
                                  className={clsx(
                                    style.payment_prePayment_name
                                  )}
                                >
                                  Tạm tính
                                  <Flex>
                                    {mobileOpen ? (
                                      <FiChevronUp />
                                    ) : (
                                      <FiChevronDown />
                                    )}
                                  </Flex>
                                </Space>
                                <Space
                                  className={clsx(
                                    style.payment_prePayment_price
                                  )}
                                >
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
                            </Col>

                            <Col xs={0} sm={24}></Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Form onFinish={onFinish} form={cartForm}>
                  <Row className={clsx(style.breadcrumb_wrapper)}>
                    <Flex
                      className={clsx(style.button_back_cart)}
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        lineHeight: "20px",
                        color: "#1250dc",
                        cursor: "pointer",
                      }}
                      onClick={() => setBuy(false)}
                    >
                      <FiChevronLeft style={{ fontSize: "20px" }} />
                      Quay lại giỏ hàng
                    </Flex>
                  </Row>

                  {/* danh sách mua hàng */}
                  <Row>
                    <Flex
                      className={clsx(style.customPL16)}
                      style={{
                        marginBottom: "10px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Danh sách sản phẩm
                      <div style={{ marginLeft: "5px" }}> ({totalCheck})</div>
                    </Flex>
                    <Col xs={24} sm={24}>
                      <Row>
                        <Col xs={24} sm={16} className={clsx(style.wrapper)}>
                          <div
                            className={clsx(
                              style.wrapper_content,
                              style.wrapper_left
                            )}
                          >
                            <Row>
                              {carts.map(
                                (cart, index) =>
                                  cart.check && (
                                    <React.Fragment key={index}>
                                      <Col span={24}>
                                        <Row
                                          className={clsx(style.wrapper_detail)}
                                        >
                                          <Col xs={4} sm={2}>
                                            <Flex>
                                              <Flex
                                                className={clsx(
                                                  style.wrapper_img
                                                )}
                                              >
                                                <Image
                                                  width="52px"
                                                  height="52px"
                                                  src={cart?.pic}
                                                ></Image>
                                              </Flex>
                                            </Flex>
                                          </Col>
                                          <Col xs={20} sm={22}>
                                            <Row>
                                              <Col xs={24} sm={12}>
                                                <Flex vertical>
                                                  <Flex
                                                    className={clsx(
                                                      style.product_name,
                                                      style.buy
                                                    )}
                                                  >
                                                    {cart.name}
                                                  </Flex>
                                                </Flex>
                                              </Col>

                                              <Col
                                                className={clsx(
                                                  style.flex_center,
                                                  style.flex_center_price
                                                )}
                                                xs={16}
                                                sm={6}
                                              >
                                                <Flex>
                                                  {cart.discount ? (
                                                    <Space
                                                      className={clsx(
                                                        style.final_payment_original_price
                                                      )}
                                                    >
                                                      <del>
                                                        {numeral(
                                                          cart.price *
                                                            cart.quantity
                                                        ).format("0,0$")}
                                                      </del>
                                                    </Space>
                                                  ) : (
                                                    <></>
                                                  )}
                                                  <Space
                                                    className={clsx(
                                                      style.final_payment_total_price
                                                    )}
                                                  >
                                                    {numeral(
                                                      cart.total * cart.quantity
                                                    ).format("0,0$")}
                                                  </Space>
                                                </Flex>
                                              </Col>

                                              <Col
                                                className={clsx(
                                                  style.flex_center
                                                )}
                                                xs={8}
                                                sm={6}
                                              >
                                                <div>
                                                  x{cart.quantity} {cart.unit}
                                                </div>
                                              </Col>
                                            </Row>
                                          </Col>

                                          <Col
                                            className={clsx(style.cusPL108)}
                                            span={24}
                                          >
                                            {/* promotion */}
                                            {cart && cart.discount && (
                                              <Flex
                                                vertical
                                                className={clsx(
                                                  style.promotion_wrapper
                                                )}
                                              >
                                                <Space
                                                  className={clsx(
                                                    style.promotion_header_wrapper
                                                  )}
                                                >
                                                  {/* <Space
                                                    className={clsx(
                                                      style.promotion_header
                                                    )}
                                                  >
                                                    <div
                                                      className={clsx(
                                                        style.promotion_img
                                                      )}
                                                    >
                                                      <span>
                                                        <svg
                                                          viewBox="0 0 24 24"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                          <path
                                                            d="M21.5299 10.87L20.0099 9.35001C19.7499 9.09 19.5399 8.58001 19.5399 8.22001V6.06C19.5399 5.18 18.8199 4.46 17.9399 4.46H15.7899C15.4299 4.46 14.9199 4.25 14.6599 3.99L13.1399 2.47C12.5199 1.85 11.4999 1.85 10.8799 2.47L9.33988 3.99C9.08988 4.25 8.57988 4.46 8.20988 4.46H6.05988C5.17988 4.46 4.45988 5.18 4.45988 6.06V8.21C4.45988 8.57 4.24988 9.08 3.98988 9.34L2.46988 10.86C1.84988 11.48 1.84988 12.5 2.46988 13.12L3.98988 14.64C4.24988 14.9 4.45988 15.41 4.45988 15.77V17.92C4.45988 18.8 5.17988 19.52 6.05988 19.52H8.20988C8.56988 19.52 9.07988 19.73 9.33988 19.99L10.8599 21.51C11.4799 22.13 12.4999 22.13 13.1199 21.51L14.6399 19.99C14.8999 19.73 15.4099 19.52 15.7699 19.52H17.9199C18.7999 19.52 19.5199 18.8 19.5199 17.92V15.77C19.5199 15.41 19.7299 14.9 19.9899 14.64L21.5099 13.12C22.1599 12.51 22.1599 11.49 21.5299 10.87ZM7.99988 9C7.99988 8.45 8.44988 8 8.99988 8C9.54988 8 9.99988 8.45 9.99988 9C9.99988 9.55 9.55988 10 8.99988 10C8.44988 10 7.99988 9.55 7.99988 9ZM9.52988 15.53C9.37988 15.68 9.18988 15.75 8.99988 15.75C8.80988 15.75 8.61988 15.68 8.46988 15.53C8.17988 15.24 8.17988 14.76 8.46988 14.47L14.4699 8.47001C14.7599 8.18001 15.2399 8.18001 15.5299 8.47001C15.8199 8.76 15.8199 9.24 15.5299 9.53L9.52988 15.53ZM14.9999 16C14.4399 16 13.9899 15.55 13.9899 15C13.9899 14.45 14.4399 14 14.9899 14C15.5399 14 15.9899 14.45 15.9899 15C15.9899 15.55 15.5499 16 14.9999 16Z"
                                                            fill="currentColor"
                                                          ></path>
                                                        </svg>
                                                      </span>
                                                    </div>
                                                    Khuyến mại được áp dụng
                                                  </Space> */}
                                                </Space>
                                                <Space
                                                  className={clsx(
                                                    style.promotion_content_wrapper
                                                  )}
                                                >
                                                  <Flex justify="space-between">
                                                    <Flex align="center">
                                                      <div
                                                        className={clsx(
                                                          style.promotion_content_img_wrapper
                                                        )}
                                                      >
                                                        <img
                                                          className={clsx(
                                                            style.promotion_content_img
                                                          )}
                                                          src="https://s3-sgn09.fptcloud.com/lc-public/web-lc/default/promotion_used.webp"
                                                          alt=""
                                                        />
                                                      </div>
                                                      <div>
                                                        Giảm ngay{" "}
                                                        {cart.discount}% áp dụng
                                                        đến 14/03
                                                      </div>
                                                    </Flex>
                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                      }}
                                                    >
                                                      x{cart.quantity} Cái
                                                    </div>
                                                  </Flex>
                                                </Space>
                                              </Flex>
                                            )}
                                          </Col>
                                        </Row>
                                      </Col>
                                    </React.Fragment>
                                  )
                              )}
                            </Row>
                          </div>
                          {/* thông tin người mua */}
                          <Row>
                            <ConfigProvider
                              theme={{
                                components: {
                                  Input: {
                                    paddingBlock: 8,
                                    inputFontSize: 14,
                                    borderRadius: 15,
                                  },
                                  Select: {
                                    controlHeight: 42,
                                    fontSize: 15,
                                    borderRadius: 15,
                                  },
                                  Form: {
                                    itemMarginBottom: 10,
                                  },
                                },
                              }}
                            >
                              <Col span={24}>
                                <Flex
                                  className={clsx(
                                    style.customColumn,
                                    style.customPL16
                                  )}
                                  justify="space-between"
                                  style={{
                                    margin: "20px 0px 2px 0px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                  }}
                                >
                                  <Space> Chọn hình thức nhận hàng</Space>
                                  <Flex>
                                    <Space
                                      onClick={() => setWhereBuy(true)}
                                      className={clsx(
                                        style.where_payment,
                                        whereBuy ? style.selected : ""
                                      )}
                                    >
                                      Giao hàng tận nơi
                                    </Space>
                                    <Space
                                      onClick={() => setWhereBuy(false)}
                                      className={clsx(
                                        style.where_payment,
                                        !whereBuy ? style.selected : ""
                                      )}
                                    >
                                      Nhận tại cửa hàng
                                    </Space>
                                  </Flex>
                                </Flex>
                              </Col>

                              <Col xs={24} sm={24}>
                                <Row>
                                  <Col
                                    span={24}
                                    className={clsx(style.wrapper)}
                                  >
                                    <div
                                      className={clsx(style.wrapper_content)}
                                    >
                                      <Row>
                                        <Col span={24}>
                                          <Flex
                                            style={{ marginBottom: "10px" }}
                                            align="center"
                                          >
                                            <img
                                              style={{
                                                width: "24px",
                                                height: "24px",
                                              }}
                                              src="https://nhathuoclongchau.com.vn/estore-images/user.png"
                                              alt=""
                                            />
                                            <Space
                                              className={clsx(
                                                style.typePayment_header
                                              )}
                                            >
                                              Thông tin người đặt
                                            </Space>
                                          </Flex>
                                        </Col>
                                        <Col span={24}>
                                          <Row gutter={8}>
                                            <Col xs={24} sm={12}>
                                              <Form.Item<FieldType>
                                                rules={[
                                                  {
                                                    required: true,
                                                    message: (
                                                      <span
                                                        className={clsx(
                                                          style.typePayment_error
                                                        )}
                                                      >
                                                        <InfoCircleOutlined />{" "}
                                                        Thông tin bắt buộc
                                                      </span>
                                                    ),
                                                  },
                                                ]}
                                                name="nameOrder"
                                              >
                                                <Input placeholder="Họ và tên" />
                                              </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={12}>
                                              <Form.Item<FieldType>
                                                rules={[
                                                  {
                                                    min: 2,
                                                    type: "number",
                                                    message: (
                                                      <span
                                                        className={clsx(
                                                          style.typePayment_error
                                                        )}
                                                      >
                                                        <InfoCircleOutlined />{" "}
                                                        Số điện thoại không hợp
                                                        lệ
                                                      </span>
                                                    ),
                                                    transform(value) {
                                                      return Number(value);
                                                    },
                                                  },
                                                ]}
                                                name="phoneOrder"
                                              >
                                                <Input placeholder="Số điện thoại" />
                                              </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                              <Form.Item<FieldType> name="email">
                                                <Input placeholder="Email (không bắt buộc)" />
                                              </Form.Item>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                      {whereBuy ? (
                                        <Row>
                                          <Col
                                            style={{ marginBottom: "10px" }}
                                            span={24}
                                          >
                                            <Flex align="center">
                                              <img
                                                style={{
                                                  width: "24px",
                                                  height: "24px",
                                                }}
                                                src="https://nhathuoclongchau.com.vn/estore-images/pin.png"
                                                alt=""
                                              />
                                              <Space
                                                className={clsx(
                                                  style.typePayment_header
                                                )}
                                              >
                                                Địa chỉ nhận hàng
                                              </Space>
                                            </Flex>
                                          </Col>
                                          <Col span={24}>
                                            <Row gutter={[8, 0]}>
                                              {/* <Col xs={24} sm={12}>
                                                <Form.Item<FieldType>
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: (
                                                        <span
                                                          className={clsx(
                                                            style.typePayment_error
                                                          )}
                                                        >
                                                          <InfoCircleOutlined />{" "}
                                                          Thông tin bắt buộc
                                                        </span>
                                                      ),
                                                    },
                                                  ]}
                                                  name="name"
                                                >
                                                  <Input placeholder="Họ và tên người nhận" />
                                                </Form.Item>
                                              </Col>
                                              <Col xs={24} sm={12}>
                                                <Form.Item<FieldType>
                                                  rules={[
                                                    {
                                                      min: 2,
                                                      type: "number",
                                                      message: (
                                                        <span
                                                          className={clsx(
                                                            style.typePayment_error
                                                          )}
                                                        >
                                                          <InfoCircleOutlined />{" "}
                                                          Số điện thoại không
                                                          hợp lệ
                                                        </span>
                                                      ),
                                                      transform(value) {
                                                        return Number(value);
                                                      },
                                                    },
                                                  ]}
                                                  name="phone"
                                                >
                                                  <Input placeholder="Số điện thoại" />
                                                </Form.Item>
                                              </Col> */}
                                              <Col xs={24} sm={12}>
                                                <Form.Item<FieldType>
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: (
                                                        <span
                                                          className={clsx(
                                                            style.typePayment_error
                                                          )}
                                                        >
                                                          <InfoCircleOutlined />{" "}
                                                          Thông tin bắt buộc
                                                        </span>
                                                      ),
                                                    },
                                                  ]}
                                                  name="province"
                                                >
                                                  <Select
                                                    placeholder="Chọn tỉnh / thành phố"
                                                    options={province.map(
                                                      (item: any) => {
                                                        return {
                                                          label: item.name,
                                                          value: item.code,
                                                        };
                                                      }
                                                    )}
                                                    onChange={(e) => {
                                                      const data: any =
                                                        province.filter(
                                                          (item: any) =>
                                                            item.code === e
                                                        );

                                                      if (data) {
                                                        cartForm.setFieldValue(
                                                          "province",
                                                          data[0].name
                                                        );
                                                      }
                                                      handleDistrict(e);
                                                    }}
                                                  />
                                                </Form.Item>
                                              </Col>
                                              <Col xs={24} sm={12}>
                                                <Form.Item<FieldType>
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: (
                                                        <span
                                                          className={clsx(
                                                            style.typePayment_error
                                                          )}
                                                        >
                                                          <InfoCircleOutlined />{" "}
                                                          Thông tin bắt buộc
                                                        </span>
                                                      ),
                                                    },
                                                  ]}
                                                  name="district"
                                                >
                                                  <Select
                                                    placeholder="Chọn quận / huyện"
                                                    options={
                                                      district &&
                                                      district.map(
                                                        (item: any) => {
                                                          return {
                                                            label: item.name,
                                                            value: item.code,
                                                          };
                                                        }
                                                      )
                                                    }
                                                    onChange={(e) => {
                                                      const data: any =
                                                        district.filter(
                                                          (item: any) =>
                                                            item.code === e
                                                        );

                                                      if (data) {
                                                        cartForm.setFieldValue(
                                                          "district",
                                                          data[0].name
                                                        );
                                                      }
                                                      handleCommune(e);
                                                    }}
                                                  />
                                                </Form.Item>
                                              </Col>
                                              <Col span={24}>
                                                <Form.Item<FieldType>
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: (
                                                        <span
                                                          className={clsx(
                                                            style.typePayment_error
                                                          )}
                                                        >
                                                          <InfoCircleOutlined />{" "}
                                                          Thông tin bắt buộc
                                                        </span>
                                                      ),
                                                    },
                                                  ]}
                                                  name="commune"
                                                >
                                                  <Select
                                                    placeholder="Chọn phường / xã"
                                                    options={
                                                      commune &&
                                                      commune.map(
                                                        (item: any) => {
                                                          return {
                                                            label: item.name,
                                                            value: item.code,
                                                          };
                                                        }
                                                      )
                                                    }
                                                    onChange={(e) => {
                                                      const data: any =
                                                        commune.filter(
                                                          (item: any) =>
                                                            item.code === e
                                                        );

                                                      if (data) {
                                                        cartForm.setFieldValue(
                                                          "commune",
                                                          data[0].name
                                                        );
                                                      }
                                                    }}
                                                  />
                                                </Form.Item>
                                              </Col>
                                              <Col span={24}>
                                                <Form.Item<FieldType>
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: (
                                                        <span
                                                          className={clsx(
                                                            style.typePayment_error
                                                          )}
                                                        >
                                                          <InfoCircleOutlined />{" "}
                                                          Thông tin bắt buộc
                                                        </span>
                                                      ),
                                                    },
                                                  ]}
                                                  name="addressDetail"
                                                >
                                                  <Input placeholder="Nhập địa chỉ cụ thể" />
                                                </Form.Item>
                                              </Col>
                                              <Col span={24}>
                                                <Form.Item<FieldType> name="notice">
                                                  <Input.TextArea
                                                    rows={3}
                                                    placeholder="Thêm ghi chú (ví dụ: Hãy gọi trước khi giao)"
                                                  />
                                                </Form.Item>
                                              </Col>
                                            </Row>
                                          </Col>
                                        </Row>
                                      ) : (
                                        <Row>
                                          <Col
                                            style={{ marginBottom: "10px" }}
                                            span={24}
                                          >
                                            <Flex align="center">
                                              <img
                                                style={{
                                                  width: "24px",
                                                  height: "24px",
                                                }}
                                                src="https://nhathuoclongchau.com.vn/estore-images/pin.png"
                                                alt=""
                                              />
                                              <Space
                                                className={clsx(
                                                  style.typePayment_header
                                                )}
                                              >
                                                Địa chỉ cửa hàng
                                              </Space>
                                            </Flex>
                                          </Col>
                                          <Col span={24}>
                                            <Row gutter={[8, 0]}>
                                              <Col span={24}>
                                                <Flex
                                                  className={clsx(
                                                    style.wrapper_location
                                                  )}
                                                >
                                                  {locations &&
                                                    locations.map(
                                                      (item: any) => (
                                                        <Row
                                                          style={{
                                                            marginBottom:
                                                              "16px",
                                                          }}
                                                          gutter={[4, 0]}
                                                        >
                                                          <Col xs={2} sm={1}>
                                                            <Flex justify="center">
                                                              <FaCheckCircle
                                                                style={{
                                                                  fontSize:
                                                                    "20px",
                                                                  color:
                                                                    "#1250dd",
                                                                }}
                                                              />
                                                            </Flex>
                                                          </Col>
                                                          <Col xs={22} sm={18}>
                                                            <Row gutter={10}>
                                                              <Col>
                                                                <Space
                                                                  style={{
                                                                    color:
                                                                      "#039855",
                                                                    fontWeight: 600,
                                                                  }}
                                                                >
                                                                  Có hàng
                                                                  <Space></Space>
                                                                </Space>
                                                              </Col>
                                                              <Col>
                                                                <Space
                                                                  style={{
                                                                    color:
                                                                      "#020b27",
                                                                    fontWeight: 600,
                                                                  }}
                                                                >
                                                                  {item.name}
                                                                </Space>
                                                              </Col>
                                                            </Row>
                                                            <Flex
                                                              style={{
                                                                margin:
                                                                  "5px 0px",
                                                              }}
                                                              align="center"
                                                            >
                                                              <FaClock
                                                                style={{
                                                                  color:
                                                                    "#aab2be",
                                                                  fontSize:
                                                                    "15px",
                                                                  marginRight:
                                                                    "5px",
                                                                }}
                                                              />
                                                              {item.time}
                                                            </Flex>
                                                            <Flex
                                                              style={{
                                                                margin:
                                                                  "5px 0px",
                                                              }}
                                                              align="center"
                                                            >
                                                              <FaLocationDot
                                                                style={{
                                                                  color:
                                                                    "#aab2be",
                                                                  fontSize:
                                                                    "15px",
                                                                  marginRight:
                                                                    "5px",
                                                                }}
                                                              />
                                                              {item.address}
                                                            </Flex>
                                                          </Col>
                                                          <Col
                                                            xs={2}
                                                            sm={0}
                                                          ></Col>
                                                          <Col xs={22} sm={5}>
                                                            <a
                                                              className={clsx(
                                                                style.location_map
                                                              )}
                                                              target="_blank"
                                                              href={item.map}
                                                              rel="noreferrer"
                                                            >
                                                              <Flex align="center">
                                                                <FaLocationCrosshairs
                                                                  style={{
                                                                    fontSize:
                                                                      "15px",
                                                                    marginRight:
                                                                      "3px",
                                                                  }}
                                                                />
                                                                <Space>
                                                                  Chỉ đường
                                                                </Space>
                                                              </Flex>
                                                            </a>
                                                          </Col>
                                                        </Row>
                                                      )
                                                    )}
                                                </Flex>
                                              </Col>
                                              <Col span={24}>
                                                <Form.Item<FieldType> name="notice">
                                                  <Input.TextArea
                                                    rows={3}
                                                    placeholder="Thêm ghi chú (ví dụ: Hãy gọi sau khi gói hàng xong)"
                                                  />
                                                </Form.Item>
                                              </Col>
                                            </Row>
                                          </Col>
                                        </Row>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </ConfigProvider>
                          </Row>
                        </Col>

                        {/* phần hoàn tất */}
                        <Col
                          className={clsx(
                            style.wrapper,
                            style.mobile_total_price
                          )}
                          xs={24}
                          sm={8}
                        >
                          <div
                            className={clsx(
                              style.wrapper_content,
                              style.wrapper_right,
                              style.wrapper_content_mobile_preBuy
                            )}
                          >
                            <Row justify="end">
                              <Col span={24}>
                                <Flex
                                  className={clsx(
                                    style.payment_header,
                                    style.active
                                  )}
                                  justify="space-between"
                                >
                                  <Space>Tổng tiền</Space>
                                  <Space>
                                    {" "}
                                    {numeral(totalOriginal).format("0,0$")}
                                  </Space>
                                </Flex>
                              </Col>
                              <Col span={24}>
                                <Flex
                                  className={clsx(
                                    style.payment_header,
                                    mobileOpen ? style.active : ""
                                  )}
                                  justify="space-between"
                                >
                                  <Space>Giảm giá trực tiếp</Space>
                                  <Space>
                                    {" "}
                                    {numeral(totalOriginal - totalPrice).format(
                                      "0,0$"
                                    )}
                                  </Space>
                                </Flex>
                              </Col>
                              <Col span={24}>
                                <Flex
                                  justify="space-between"
                                  className={clsx(
                                    style.payment_header,
                                    mobileOpen ? style.active : ""
                                  )}
                                >
                                  <Space>Giảm giá voucher</Space>
                                  <Space> {numeral(0).format("0,0$")}</Space>
                                </Flex>
                              </Col>
                              <Col span={24}>
                                <Flex
                                  className={clsx(
                                    style.payment_header,
                                    mobileOpen ? style.active : ""
                                  )}
                                  justify="space-between"
                                >
                                  <Space>Tiết kiệm được</Space>
                                  <Space>
                                    {" "}
                                    {numeral(totalOriginal - totalPrice).format(
                                      "0,0$"
                                    )}
                                  </Space>
                                </Flex>
                              </Col>

                              <Col span={24}>
                                <Flex
                                  className={clsx(style.payment_prePayment)}
                                  justify="space-between"
                                >
                                  <Space
                                    onClick={() => setMobileOpen(!mobileOpen)}
                                    className={clsx(
                                      style.payment_prePayment_name
                                    )}
                                  >
                                    Tạm tính
                                    <Flex>
                                      {mobileOpen ? (
                                        <FiChevronUp />
                                      ) : (
                                        <FiChevronDown />
                                      )}
                                    </Flex>
                                  </Space>
                                  <Space
                                    className={clsx(
                                      style.payment_prePayment_price
                                    )}
                                  >
                                    {numeral(totalPrice).format("0,0$")}
                                  </Space>
                                </Flex>
                              </Col>
                              <Col span={24}>
                                <button
                                  type="submit"
                                  // onClick={() => setBuy(true)}
                                  className={clsx(
                                    style.button_payment,
                                    !totalCheck ? style.disable : ""
                                  )}
                                >
                                  Hoàn tất {totalCheck ? `(${totalCheck})` : ""}
                                </button>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  {/* hình thức mua hàng */}
                  <Row>
                    <ConfigProvider
                      theme={{
                        components: {
                          Radio: {
                            radioSize: 20,
                            colorBorder: "#728091",
                          },
                        },
                      }}
                    >
                      <Flex
                        className={clsx(style.customPL16)}
                        style={{
                          margin: "20px 0px 10px 0px",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        Chọn hình thức thanh toán
                      </Flex>
                      <Col xs={24} sm={24}>
                        <Row>
                          <Col xs={24} sm={16} className={clsx(style.wrapper)}>
                            <div className={clsx(style.wrapper_content)}>
                              <Row>
                                <Form.Item<FieldType>
                                  rules={[
                                    {
                                      required: true,
                                      message: (
                                        <span
                                          className={clsx(
                                            style.typePayment_error
                                          )}
                                        >
                                          <InfoCircleOutlined /> Vui lòng chọn
                                          hình thức thanh toán
                                        </span>
                                      ),
                                    },
                                  ]}
                                  name="typePayment"
                                >
                                  <Radio.Group name="radiogroup">
                                    <Col span={24}>
                                      <Radio value="shipCode">
                                        <Flex align="center">
                                          <img
                                            src="https://s3-sgn09.fptcloud.com/lc-public/app-lc/payment/cod.png"
                                            alt=""
                                            style={{
                                              width: "40px",
                                              height: "40px",
                                              margin: " 10px",
                                            }}
                                          />
                                          Thanh toán tiền mặt khi nhận hàng
                                        </Flex>
                                      </Radio>
                                    </Col>
                                    <Col span={24}>
                                      <Radio value="vnPay">
                                        <Flex align="center">
                                          <img
                                            src="https://s3-sgn09.fptcloud.com/lc-public/app-lc/payment/vnpay.png"
                                            alt=""
                                            style={{
                                              width: "40px",
                                              height: "40px",
                                              margin: " 10px",
                                            }}
                                          />
                                          Thanh toán bằng thẻ ATM nội địa (Qua
                                          VNPay)
                                        </Flex>
                                      </Radio>
                                    </Col>
                                    <Col span={24}>
                                      <Radio value="visa">
                                        <Flex align="center">
                                          <img
                                            src="https://s3-sgn09.fptcloud.com/lc-public/app-lc/payment/card.png"
                                            alt=""
                                            style={{
                                              width: "40px",
                                              height: "40px",
                                              margin: " 10px",
                                            }}
                                          />
                                          Thanh toán bằng thẻ quốc tế Visa,
                                          Master, JCB, AMEX (GooglePay,
                                          ApplePay)
                                        </Flex>
                                      </Radio>
                                    </Col>
                                    <Col span={24}>
                                      <Radio value="zaloPay">
                                        <Flex align="center">
                                          <img
                                            src="https://s3-sgn09.fptcloud.com/lc-public/app-lc/payment/zalopay.png"
                                            alt=""
                                            style={{
                                              width: "40px",
                                              height: "40px",
                                              margin: " 10px",
                                            }}
                                          />
                                          Thanh toán bằng ví ZaloPay
                                        </Flex>
                                      </Radio>
                                    </Col>
                                    <Col span={24}>
                                      <Radio value="momo">
                                        <Flex align="center">
                                          <img
                                            src="https://s3-sgn09.fptcloud.com/lc-public/app-lc/payment/momo.png"
                                            alt=""
                                            style={{
                                              width: "40px",
                                              height: "40px",
                                              margin: " 10px",
                                            }}
                                          />
                                          Thanh toán bằng ví MoMo
                                        </Flex>
                                      </Radio>
                                    </Col>
                                  </Radio.Group>
                                </Form.Item>
                              </Row>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </ConfigProvider>
                  </Row>
                </Form>
              </>
            )}
          </>
        ) : (
          <Row>
            <Col span={24}>
              <NoCart />
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}

export default CartScreen;
