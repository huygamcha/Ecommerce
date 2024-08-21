import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getAllProduct,
  getAllProductSearch,
  getProductById,
  getProductBySlug,
  ProductsType,
} from "../../../slices/productSlice";
import {
  Col,
  Row,
  Space,
  Image,
  Flex,
  Empty,
  Breadcrumb,
  message,
  ConfigProvider,
  Skeleton,
  Form,
  Input,
} from "antd";
import numeral from "numeral";
import style from "./product.module.css";
import clsx from "clsx";
import { addToCart } from "../../../slices/cartSlice";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { PiCaretDoubleDownBold, PiCaretDoubleUpBold } from "react-icons/pi";
import {
  FaClock,
  FaFacebookMessenger,
  FaLocationCrosshairs,
  FaLocationDot,
} from "react-icons/fa6";
import { FaCartShopping, FaBars } from "react-icons/fa6";

import { FiChevronRight } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Discount from "../../../components/discount";
import ButtonNavigation from "../../../components/buttonNavigation";
import Label from "../../../components/label";
import Specifications from "../../../components/specifications";
import { FaCheckCircle } from "react-icons/fa";
import FakeNumber from "../../../components/fakeNumber";
import BuyMobile from "../../../components/buyMobile";
import { GrDirections } from "react-icons/gr";
// error searchById cần fix cái này
function ProductDetail() {
  const param = useParams();

  const { product, productsSearch, products } = useAppSelector(
    (state) => state.products
  );

  const { locations } = useAppSelector((state) => state.locations);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState<number>(1);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [showMoreRight, setShowMoreRight] = useState<boolean>(false);
  const [activeBuyMobile, setActiveBuyMobile] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [specificProduct, setSpecificProduct] = useState<ProductsType>();

  // random
  const [addedToCart, setAddedToCart] = useState<number>(
    Math.floor(Math.random() * 10) + 1
  );
  const [viewing, setViewing] = useState<number>(
    Math.floor(Math.random() * (30 - 10 + 1)) + 10
  );

  const productCurrent = localStorage.getItem("productId")
    ? JSON.parse(localStorage.getItem("productId")!)
    : undefined;

  //  lưu vào lịch sử
  const histories = localStorage.getItem("histories")
    ? JSON.parse(localStorage.getItem("histories")!)
    : [];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    const slug = location.pathname.split("/")[2];
    if (products.length === 0) {
      dispatch(getAllProduct({}));
    }
    if (!product?.name) dispatch(getProductBySlug(slug));
  }, [dispatch, location.pathname, products.length]);

  useEffect(() => {
    if (
      product &&
      product.categoryId &&
      productsSearch &&
      productsSearch.length === 0
    ) {
      dispatch(getAllProductSearch({ categoryId: product.categoryId }));
    }
  }, [dispatch, product]);
  // useEffect(() => {
  //   const id = localStorage.getItem("productId")
  //     ? JSON.parse(localStorage.getItem("productId")!)
  //     : undefined;
  //   // chỉ dispatch khi load lại trang
  //   if (id && product?.name === "") {
  //     dispatch(getProductById(id));
  //     dispatch(getAllProductSearch({ categoryId: product.categoryId }));
  //   }
  // }, []);

  // add to cart
  const handleAddToCart = (e: any) => {
    //  tránh hiện tượng load trang, ngăn chặn mặc định của link
    e.preventDefault();
    // ngăn chán hành động dispatch search product
    e.stopPropagation();
    messageApi.open({
      type: "success",
      content: "Thêm vào giỏ hàng thành công",
    });
    dispatch(
      addToCart({
        id: product?._id,
        name: product?.name,
        quantity: quantity,
        pic: product?.pic,
        price: product?.price,
        stock: product?.stock,
        total: product?.total,
        discount: product?.discount,
        unit: product?.unit,
        slug: product?.slug,
        check: true,
        categoryId: product?.categoryId,
        sold: product?.sold,
      })
    );
  };
  const handleAddToCartTest = (e: any, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSpecificProduct(product);
    // console.log("««««« product »»»»»", product);
    // console.log("««««« e »»»»»", e);

    if (window.innerWidth < 576) {
      setActiveBuyMobile(true);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      messageApi.open({
        type: "success",
        content: "Thêm vào giỏ hàng thành công",
      });
      dispatch(
        addToCart({
          id: product?._id,
          name: product?.name,
          quantity: quantity,
          pic: product?.pic,
          price: product?.price,
          stock: product?.stock,
          total: product?.total,
          discount: product?.discount,
          unit: product?.unit,
          slug: product?.slug,
          check: true,
          categoryId: product?.categoryId,
          sold: product?.sold,
        })
      );
    }
  };
  //  buy quickly
  const handleAddToCartNow = () => {
    messageApi.open({
      type: "success",
      content: "Thêm vào giỏ hàng thành công",
    });
    dispatch(
      addToCart({
        id: product?._id,
        name: product?.name,
        quantity: quantity,
        pic: product?.pic,
        price: product?.price,
        stock: product?.stock,
        total: product?.total,
        discount: product?.discount,
        unit: product?.unit,
        slug: product?.slug,
        check: true,
        sold: product?.sold,
      })
    );
    navigate("/cart");
  };
  //search brand
  const handleSearchBrand = (id: string, name: string, categoryId: string) => {
    localStorage.setItem(
      "filter",
      JSON.stringify({ brandId: id, categoryId: categoryId })
    );
    dispatch(getAllProductSearch({ brandId: id, categoryId: categoryId }));
  };
  // search category
  const handleSearchCategory = (id: string, name: string) => {
    localStorage.setItem("filter", JSON.stringify({ categoryId: id }));
    dispatch(getAllProductSearch({ categoryId: id }));
  };

  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  const handleShowMoreRight = () => {
    setShowMoreRight(!showMoreRight);
  };

  // go to detail
  const handleDetail = (value: string, categoryId: string) => {
    localStorage.setItem("filter", JSON.stringify({ categoryId: categoryId }));
    localStorage.setItem("productId", JSON.stringify(value));

    if (histories.length > 0) {
      const hasItem = histories.findIndex((item: string) => item === value);
      if (hasItem === -1) {
        histories.unshift(value);
      } else {
        histories.splice(hasItem, 1);
        histories.unshift(value);
      }
      localStorage.setItem("histories", JSON.stringify(histories));
    } else {
      localStorage.setItem("histories", JSON.stringify([value]));
    }

    dispatch(getProductById(value));
    // console.log("««««« come herre »»»»»", 321);
    // dispatch(getProductBySlug(value));
    dispatch(getAllProductSearch({ categoryId: categoryId }));
  };
  return (
    <div>
      <div>
        <ConfigProvider
          theme={{
            components: {
              Message: {
                zIndexPopup: 9999,
              },
            },
          }}
        >
          {contextHolder}
          {product ? (
            <>
              <div className={clsx(style.product_background)}>
                <div
                  className={clsx(
                    style.wrapper_global,
                    style.wrapper_global_breadcrumb
                  )}
                >
                  <Row className={clsx(style.wrapper_breadcrumb)}>
                    <Breadcrumb
                      items={[
                        {
                          title: (
                            <Link className={clsx(style.button_home)} to={"/"}>
                              Trang chủ
                            </Link>
                          ),
                        },
                        {
                          title: (
                            <Link
                              to={`/timkiem?c=${product?.category.name}`}
                              className={clsx(
                                style.header_brand,
                                style.button_home
                              )}
                              onClick={() =>
                                handleSearchCategory(
                                  product?.category._id,
                                  product?.category.name
                                )
                              }
                            >
                              {product?.category.name}
                            </Link>
                          ),
                        },
                        {
                          title: (
                            <Link
                              to={`/timkiem?b=${product?.brand.name}`}
                              className={clsx(
                                style.header_brand,
                                style.button_home
                              )}
                              onClick={() =>
                                handleSearchBrand(
                                  product?.brand._id,
                                  product?.brand.name,
                                  product?.category._id
                                )
                              }
                            >
                              {product?.brand.name}
                            </Link>
                          ),
                        },
                      ]}
                    />
                  </Row>
                </div>

                <div
                  className={clsx(
                    style.wrapper_global,
                    style.wrapper_global_detail
                  )}
                >
                  <div className={clsx(style.product_wrapper)}>
                    <Row>
                      <Col xs={24} sm={10}>
                        <Flex
                          className={clsx(style.customP16)}
                          vertical
                          justify="center"
                        >
                          <Row>
                            <Col xs={0} sm={24}>
                              <Space
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  padding: "20px 0px",
                                  border: "1px solid #f3f2f3",
                                  borderRadius: "12px",
                                }}
                              >
                                <Image
                                  className={clsx(style.img_product)}
                                  src={product?.pic}
                                ></Image>
                              </Space>
                            </Col>
                          </Row>

                          <Col span={24}>
                            <Swiper
                              modules={[
                                Navigation,
                                Pagination,
                                Scrollbar,
                                A11y,
                              ]}
                              breakpoints={{
                                1200: {
                                  spaceBetween: 0,
                                  slidesPerView: 4,
                                  loop: true,
                                },
                                0: {
                                  spaceBetween: 0,
                                  slidesPerView: 1,
                                  loop: true,
                                },
                              }}
                              pagination={{ clickable: true }}
                              className={clsx(
                                style.pagination,
                                style.album_wrapper
                              )}
                            >
                              {product?.album &&
                                product?.album.map((item, index) => (
                                  <SwiperSlide
                                    className={clsx(style.wrapper_album)}
                                    key={index}
                                  >
                                    <Image
                                      className={clsx(style.album_item)}
                                      src={item}
                                    >
                                      {item}
                                    </Image>
                                  </SwiperSlide>
                                ))}
                            </Swiper>
                          </Col>
                        </Flex>
                      </Col>
                      <Col xs={24} sm={14}>
                        <Flex className={clsx(style.customP16)} vertical>
                          <Space>
                            <div className={clsx(style.title_brand)}>
                              Thương hiệu:
                              <Link
                                to={`/timkiem?b=${product?.brand.name}`}
                                className={clsx(style.header_brand)}
                                onClick={() =>
                                  handleSearchBrand(
                                    product?.brand._id,
                                    product?.brand.name,
                                    product?.category._id
                                  )
                                }
                              >
                                {product?.brand.name}
                              </Link>
                            </div>
                          </Space>

                          {/* name */}
                          <Space className={clsx(style.name_detail)}>
                            {product?.name}
                          </Space>

                          {/* discount */}
                          <Space>
                            <Flex vertical>
                              {product && product?.discount > 0 ? (
                                <>
                                  <Space className={clsx(style.price_detail)}>
                                    <div>
                                      {numeral(product?.total).format("0,0")}
                                      <span style={{ margin: " 0 4px" }}>
                                        &#47;
                                      </span>
                                      {product.unit}
                                    </div>
                                    <div
                                      className={clsx(
                                        style.product_detail_discount
                                      )}
                                    >{`-${product.discount}%`}</div>
                                  </Space>
                                  <Space className={clsx(style.price_total)}>
                                    <del>
                                      {numeral(product?.price).format("0,0$")}
                                    </del>
                                  </Space>
                                </>
                              ) : (
                                <>
                                  <Space className={clsx(style.price_detail)}>
                                    <div>
                                      {numeral(product?.price).format("0,0$")}
                                      <span style={{ margin: "0 4px" }}>
                                        &#47;
                                      </span>
                                      {product?.unit}
                                    </div>
                                  </Space>
                                </>
                              )}
                            </Flex>
                          </Space>

                          {/* soldOut */}
                          {!product?.stock && (
                            <Space
                              style={{ color: "red", marginTop: "0px" }}
                              className={clsx(style.name_detail)}
                            >
                              Sản phẩm hiện đã hết hàng
                            </Space>
                          )}

                          {/* specifications */}
                          {product && product.specifications && (
                            <Space className={clsx(style.brief_detail_wrapper)}>
                              <Space className={clsx(style.brief_detail)}>
                                Quy cách
                              </Space>
                              <Space className={clsx(style.des_detail)}>
                                {product?.specifications}
                              </Space>
                            </Space>
                          )}

                          {/* fromBrand */}
                          {product && product.fromBrand && (
                            <Space className={clsx(style.brief_detail_wrapper)}>
                              <Space className={clsx(style.brief_detail)}>
                                Xuất xứ thương hiệu
                              </Space>
                              <Space className={clsx(style.des_detail)}>
                                {product?.fromBrand}
                              </Space>
                            </Space>
                          )}

                          {/* supplierHome */}
                          {product && product.supplierHome && (
                            <Space className={clsx(style.brief_detail_wrapper)}>
                              <Space className={clsx(style.brief_detail)}>
                                Nhà sản xuất
                              </Space>
                              <Space className={clsx(style.des_detail)}>
                                {product?.supplierHome}
                              </Space>
                            </Space>
                          )}

                          {/* country */}
                          {product && product.country && (
                            <Space className={clsx(style.brief_detail_wrapper)}>
                              <Space className={clsx(style.brief_detail)}>
                                Nước sản xuất
                              </Space>
                              <Space className={clsx(style.des_detail)}>
                                {product?.country}
                              </Space>
                            </Space>
                          )}

                          {/* ingredient */}
                          {product && product.ingredient && (
                            <Space className={clsx(style.brief_detail_wrapper)}>
                              <Space className={clsx(style.brief_detail)}>
                                Thành phần
                              </Space>
                              <Space className={clsx(style.des_detail)}>
                                {product?.ingredient}
                              </Space>
                            </Space>
                          )}

                          {/* description */}
                          {product && product.description && (
                            <Space
                              style={{ display: "flex", alignItems: "start" }}
                              className={clsx(style.brief_detail_wrapper)}
                            >
                              <Space className={clsx(style.brief_detail)}>
                                Mô tả ngắn
                              </Space>
                              <Space className={clsx(style.des_detail)}>
                                {product?.description}
                              </Space>
                            </Space>
                          )}

                          {/* promotion */}
                          {product && product.discount ? (
                            <Flex
                              vertical
                              className={clsx(style.promotion_wrapper)}
                            >
                              <Space
                                className={clsx(style.promotion_header_wrapper)}
                              >
                                <Space className={clsx(style.promotion_header)}>
                                  <div className={clsx(style.promotion_img)}>
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
                                </Space>
                              </Space>
                              <Space
                                className={clsx(
                                  style.promotion_content_wrapper
                                )}
                              >
                                <Space
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
                                </Space>
                                {` Giảm ngay ${product.discount}%`}
                              </Space>
                            </Flex>
                          ) : (
                            <></>
                          )}

                          {/* buy now */}
                          <Space className={clsx(style.brief_detail_wrapper)}>
                            <Space className={clsx(style.brief_detail)}>
                              Chọn số lượng
                            </Space>
                            <Space
                              className={clsx(style.quantity_detail_wrapper)}
                            >
                              <Space
                                onClick={() => setQuantity(quantity - 1)}
                                className={clsx(
                                  quantity === 1
                                    ? style.quantity_icon_detail_disabled
                                    : style.quantity_icon_detail
                                )}
                              >
                                <MinusOutlined disabled />
                              </Space>
                              <Space className={clsx(style.quantity_detail)}>
                                {quantity}
                              </Space>

                              <Space
                                onClick={() => setQuantity(quantity + 1)}
                                className={clsx(
                                  quantity === product?.stock
                                    ? style.quantity_icon_detail_disabled
                                    : style.quantity_icon_detail
                                )}
                              >
                                <PlusOutlined />
                              </Space>
                            </Space>
                          </Space>

                          {/* buy */}
                          <Flex
                            className={clsx(style.buy_wrapper)}
                            justify="space-between"
                          >
                            <Space
                              // onClick={() => setActiveBuyMobile(true)}
                              onClick={handleAddToCart}
                              className={clsx(
                                style.add_to_cart,
                                product && !product.stock
                                  ? style.soldOut_disabled
                                  : ""
                              )}
                            >
                              Thêm vào giỏ hàng
                            </Space>
                            <Space
                              onClick={handleAddToCartNow}
                              className={clsx(
                                style.buy_now,
                                product && !product.stock
                                  ? style.soldOut_disabled
                                  : ""
                              )}
                            >
                              Chọn mua
                            </Space>
                          </Flex>

                          {/* attractive */}
                          <Flex style={{ marginTop: "10px" }}>
                            <div className={clsx(style.attractive_img)}>
                              <svg
                                viewBox="0 0 28 28"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8.40596 2.85168C8.60483 2.33834 9.09874 2 9.64925 2H18.1645C19.0913 2 19.7354 2.92219 19.4163 3.79234L17.3235 9.5H22.1608C23.3391 9.5 23.9382 10.9163 23.1177 11.7618L9.78392 25.5031C8.64373 26.6782 6.67801 25.6201 7.03091 24.0212L8.69106 16.5H5.91652C4.56947 16.5 3.64267 15.147 4.12929 13.8909L8.40596 2.85168Z"
                                  fill="url(#paint0_linear_4601_180268)"
                                ></path>
                                <defs>
                                  <linearGradient
                                    id="paint0_linear_4601_180268"
                                    x1="23.4968"
                                    y1="26.0035"
                                    x2="0.00265493"
                                    y2="6.91843"
                                    gradientUnits="userSpaceOnUse"
                                  >
                                    <stop stopColor="#F79009"></stop>
                                    <stop
                                      offset="1"
                                      stopColor="#FDB022"
                                    ></stop>
                                  </linearGradient>
                                </defs>
                              </svg>
                            </div>
                            <span className={clsx(style.attractive_header)}>
                              Sản phẩm đang được chú ý,{" "}
                              <span
                                className={clsx(style.attractive_content)}
                              >{`có ${addedToCart} người đang thêm vào giỏ hàng & ${viewing} người đang xem`}</span>
                            </span>
                          </Flex>

                          {/* policy */}
                          <Flex
                            className={clsx(style.policy_wrapper)}
                            justify="space-between"
                          >
                            <Space>
                              <Flex>
                                <div className={clsx(style.policy_img)}>
                                  <svg
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M21.6698 13.9732H20.5481C20.3 13.9732 20.0995 13.7727 20.0995 13.5246V11.7043L15.0391 15.3192L20.0995 18.934V17.1138C20.0995 16.8657 20.3 16.6652 20.5481 16.6652H20.7725C24.1123 16.6652 26.8294 19.3822 26.8294 22.7221C26.8294 24.3906 26.1515 25.9035 25.0563 27C27.1834 25.8093 28.624 23.5337 28.624 20.9274C28.624 17.0927 25.5045 13.9732 21.6698 13.9732Z"
                                      fill="#7EB5FF"
                                    ></path>
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M13.3463 7.90195C13.0745 8.17369 12.9218 8.54226 12.9218 8.92656V10.3839C12.9218 10.8795 13.3236 11.2812 13.8192 11.2812C14.3147 11.2812 14.7165 10.8795 14.7165 10.3839V8.8864C14.7165 8.52563 14.8488 8.17738 15.0884 7.90766L17.6713 5H16.2482L13.3463 7.90195ZM24.1383 18.8142C23.2872 18.0802 22.1947 17.619 20.9977 17.5674V19.8058C20.9977 19.974 20.9039 20.1279 20.7545 20.2051C20.6042 20.2809 20.4248 20.2688 20.2884 20.171L14.0071 15.6844C13.8892 15.6 13.8192 15.4641 13.8192 15.3192C13.8192 15.1742 13.8892 15.0383 14.0071 14.9544L20.2884 10.4678C20.4248 10.3696 20.6042 10.3565 20.7545 10.4337C20.9039 10.5104 20.9977 10.6643 20.9977 10.8326V13.0759H21.6707C22.5335 13.0759 23.3612 13.2208 24.1383 13.4792V8.58927H16.6138C16.0615 8.58927 15.6138 9.03699 15.6138 9.58927V11.7299C15.6138 11.978 15.4132 12.1785 15.1651 12.1785H12.4732C12.2251 12.1785 12.0245 11.978 12.0245 11.7299V9.58927C12.0245 9.03699 11.5768 8.58927 11.0245 8.58927H3.5V22.741C3.5 23.8456 4.39543 24.741 5.5 24.741H22.1383C23.2429 24.741 24.1383 23.8456 24.1383 22.741V18.8142ZM10.6785 22.4977C10.6785 22.7455 10.4777 22.9464 10.2299 22.9464H5.7433C5.49551 22.9464 5.29464 22.7455 5.29464 22.4977C5.29464 22.2499 5.49551 22.049 5.7433 22.049H10.2299C10.4777 22.049 10.6785 22.2499 10.6785 22.4977ZM10.6785 20.7031C10.6785 20.9509 10.4777 21.1517 10.2299 21.1517H5.7433C5.49551 21.1517 5.29464 20.9509 5.29464 20.7031C5.29464 20.4553 5.49551 20.2544 5.7433 20.2544H10.2299C10.4777 20.2544 10.6785 20.4553 10.6785 20.7031ZM5.36225 6.46447C6.29994 5.52678 7.57171 5 8.89779 5H14.9798L12.2878 7.69196H4.13477L5.36225 6.46447ZM16.2482 7.69196H24.4013L27.0932 5H18.9402L16.2482 7.69196ZM27.7271 5.6344V14.6462L25.0352 13.3002V8.32635L27.7271 5.6344Z"
                                      fill="url(#paint0_linear_4723_154886)"
                                    ></path>
                                    <defs>
                                      <linearGradient
                                        id="paint0_linear_4723_154886"
                                        x1="15.8371"
                                        y1="26.1511"
                                        x2="7.14707"
                                        y2="8.52384"
                                        gradientUnits="userSpaceOnUse"
                                      >
                                        <stop stopColor="#1B5EEB"></stop>
                                        <stop
                                          offset="1"
                                          stopColor="#4987FF"
                                        ></stop>
                                      </linearGradient>
                                    </defs>
                                  </svg>
                                </div>
                                <Flex vertical>
                                  <Space
                                    className={clsx(style.policy_main_header)}
                                  >
                                    Đổi trả trong 30 ngày
                                  </Space>
                                  <Space
                                    className={clsx(style.policy_sub_header)}
                                  >
                                    Kể từ ngày mua hàng
                                  </Space>
                                </Flex>
                              </Flex>
                            </Space>
                            <Space>
                              <Flex>
                                <div className={clsx(style.policy_img)}>
                                  <span>
                                    <svg
                                      viewBox="0 0 32 32"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M1.5 14.7622H5.16079V25.1344H1.5V14.7622Z"
                                        fill="#7EB5FF"
                                      ></path>
                                      <path
                                        d="M29.3645 18.8073C29.143 18.3815 28.763 18.0598 28.3065 17.9114C27.85 17.7631 27.3535 17.8 26.924 18.0142L20.0478 21.5163C19.1753 22.8769 17.7537 23.7555 16.3199 23.0661L11.506 20.8025C11.3719 20.7262 11.2716 20.6019 11.2255 20.4547C11.1793 20.3075 11.1906 20.1483 11.2571 20.0091C11.3236 19.8699 11.4404 19.7611 11.5839 19.7045C11.7275 19.6479 11.8871 19.6478 12.0307 19.7042C17.2717 22.1448 16.9544 22.0715 17.3632 22.0837C18.8092 22.1509 19.7244 19.9056 18.1442 19.2039C9.52914 15.1587 10.7494 15.2869 6.38086 15.8299V23.9141C7.04486 23.8626 7.71132 23.9757 8.32108 24.2436C17.2046 28.2766 14.7031 28.362 28.5713 21.2723C28.7853 21.1626 28.9756 21.0118 29.1313 20.8285C29.287 20.6452 29.405 20.4331 29.4787 20.2041C29.5523 19.9752 29.5802 19.7341 29.5606 19.4944C29.541 19.2547 29.4744 19.0212 29.3645 18.8073Z"
                                        fill="url(#paint0_linear_4723_154899)"
                                      ></path>
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M19.6878 18.8835C19.4058 18.552 19.0561 18.2847 18.6622 18.0995C17.2036 17.4142 16.0447 16.8626 15.1079 16.4169C11.7499 14.8188 11.248 14.58 10.041 14.4082V5H15.5322V8.66079C15.5325 8.7648 15.5594 8.86699 15.6103 8.95768C15.6613 9.04837 15.7345 9.12453 15.8232 9.17894C15.9118 9.23334 16.0129 9.26419 16.1168 9.26854C16.2207 9.27289 16.324 9.25061 16.4169 9.20381L18.5829 8.12387C19.0587 8.35989 19.4394 8.55355 19.7474 8.71021C20.9363 9.31491 21.0415 9.36839 21.3468 9.1794C21.6535 8.98954 21.6533 8.96282 21.6407 6.94829C21.6375 6.43803 21.6335 5.80025 21.6335 5H27.1247V16.6596C27.0631 16.6708 27.0143 16.6786 26.9659 16.6887C26.593 16.7667 26.2496 16.9859 20.2973 20.0214C20.1776 19.603 19.9698 19.215 19.6878 18.8835ZM24.6842 14.7621H22.2436C22.0818 14.7621 21.9266 14.8264 21.8122 14.9408C21.6978 15.0552 21.6335 15.2104 21.6335 15.3722C21.6335 15.5341 21.6978 15.6892 21.8122 15.8037C21.9266 15.9181 22.0818 15.9824 22.2436 15.9824H24.6842C24.846 15.9824 25.0012 15.9181 25.1156 15.8037C25.23 15.6892 25.2943 15.5341 25.2943 15.3722C25.2943 15.2104 25.23 15.0552 25.1156 14.9408C25.0012 14.8264 24.846 14.7621 24.6842 14.7621ZM19.3993 7.16896C18.722 6.83039 18.722 6.83039 18.5823 6.83039C18.446 6.83039 18.446 6.83039 17.8142 7.14588C17.5696 7.26801 17.2304 7.4374 16.752 7.67238V5H20.4127V7.67238C19.9653 7.45186 19.6397 7.28909 19.3993 7.16896Z"
                                        fill="url(#paint1_linear_4723_154899)"
                                      ></path>
                                      <defs>
                                        <linearGradient
                                          id="paint0_linear_4723_154899"
                                          x1="18.1877"
                                          y1="27.8176"
                                          x2="14.7038"
                                          y2="16.1535"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#1B5EEB"></stop>
                                          <stop
                                            offset="1"
                                            stopColor="#4987FF"
                                          ></stop>
                                        </linearGradient>
                                        <linearGradient
                                          id="paint1_linear_4723_154899"
                                          x1="18.7405"
                                          y1="21.0944"
                                          x2="11.8273"
                                          y2="8.09924"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#1B5EEB"></stop>
                                          <stop
                                            offset="1"
                                            stopColor="#4987FF"
                                          ></stop>
                                        </linearGradient>
                                      </defs>
                                    </svg>
                                  </span>
                                </div>
                                <Flex vertical>
                                  <Space
                                    className={clsx(style.policy_main_header)}
                                  >
                                    Miễn phí 100%
                                  </Space>
                                  <Space
                                    className={clsx(style.policy_sub_header)}
                                  >
                                    đổi sản phẩm
                                  </Space>
                                </Flex>
                              </Flex>
                            </Space>
                            <Space>
                              <Flex>
                                <div className={clsx(style.policy_img)}>
                                  <span>
                                    <svg
                                      viewBox="0 0 32 32"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <g clipPath="url(#clip0_4723_154911)">
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M21.6544 22.1987C22.0338 20.3237 23.805 18.8337 25.7087 18.8337C27.5419 18.8337 28.8631 20.2156 28.8269 21.9925C30.8094 22.0444 31.3612 19.4338 31.3612 19.4338C31.5281 18.7038 31.7775 17.2806 31.9863 15.8837C32.0547 15.4525 32.0021 15.0107 31.8344 14.6075C31.3161 13.3978 30.6899 12.2372 29.9631 11.14C29.2756 10.1144 28.1225 9.50688 26.8062 9.485C26.0212 9.4725 25.2506 9.465 24.6687 9.465L24.6637 9.46C24.5887 8.205 23.6737 7.24375 22.3894 7.12875C21.5537 7.05437 18.2437 7 16.655 7C16.0237 7 15.1181 7.00875 14.2019 7.02375V7.02H14.1944H3.17813C3.03792 7.01992 2.89907 7.04747 2.76951 7.10109C2.63996 7.15471 2.52225 7.23334 2.42311 7.33248C2.32396 7.43162 2.24533 7.54934 2.19172 7.67889C2.1381 7.80844 2.11054 7.94729 2.11063 8.0875V8.0925C2.11063 8.37429 2.22257 8.64454 2.42182 8.8438C2.62108 9.04306 2.89133 9.155 3.17313 9.155H5.39375C5.66114 9.17471 5.91119 9.29479 6.09376 9.49115C6.27633 9.68751 6.3779 9.94563 6.37812 10.2137V10.2194C6.37854 10.3597 6.35127 10.4988 6.29788 10.6286C6.2445 10.7584 6.16605 10.8763 6.06701 10.9758C5.96797 11.0752 5.8503 11.1542 5.72073 11.2081C5.59115 11.262 5.45222 11.2898 5.31187 11.29H4.17312C3.89017 11.29 3.61881 11.4024 3.41873 11.6025C3.21865 11.8026 3.10625 12.0739 3.10625 12.3569C3.10617 12.497 3.1337 12.6358 3.18728 12.7653C3.24086 12.8949 3.31943 13.0125 3.41851 13.1117C3.51759 13.2108 3.63523 13.2894 3.76471 13.3431C3.89419 13.3968 4.03297 13.4244 4.17312 13.4244H5.31187C5.59499 13.4244 5.86652 13.5368 6.06671 13.737C6.26691 13.9372 6.37937 14.2088 6.37937 14.4919C6.37937 14.775 6.26691 15.0465 6.06671 15.2467C5.86652 15.4469 5.59499 15.5594 5.31187 15.5594H1.05187C0.768865 15.5594 0.497437 15.6718 0.297259 15.8718C0.0970823 16.0719 -0.0154593 16.3432 -0.015625 16.6262C-0.015625 16.9094 0.0968434 17.1809 0.297038 17.3811C0.497234 17.5813 0.768756 17.6937 1.05187 17.6937H5.31187C5.59499 17.6937 5.86652 17.8062 6.06671 18.0064C6.26691 18.2066 6.37937 18.4781 6.37937 18.7612C6.37904 19.0442 6.26643 19.3154 6.06627 19.5153C5.86611 19.7152 5.59478 19.8275 5.31187 19.8275H3.99437C3.71142 19.8275 3.44006 19.9399 3.23998 20.14C3.0399 20.3401 2.9275 20.6114 2.9275 20.8944C2.9275 21.1774 3.03988 21.4488 3.23994 21.649C3.44 21.8492 3.71136 21.9617 3.99437 21.9619L8.19812 21.9587L8.5475 21.0881C9.26313 19.7681 10.6869 18.8331 12.1944 18.8331C14.0988 18.8331 15.4513 20.3244 15.3025 22.2006H21.6537L21.6544 22.1987ZM24.5706 10.945C25.1287 10.945 25.8512 10.9525 26.5763 10.9644C27.455 10.9787 28.2237 11.3825 28.685 12.0712C29.1777 12.814 29.6205 13.5886 30.0106 14.39C30.2169 14.81 29.8375 15.3569 29.3406 15.3569H24.0125L24.5706 10.945ZM1.40508 11.3086C1.99447 11.3086 2.47227 11.7864 2.47227 12.3758C2.47227 12.9652 1.99447 13.443 1.40508 13.443C0.815687 13.443 0.337891 12.9652 0.337891 12.3758C0.337891 11.7864 0.815687 11.3086 1.40508 11.3086Z"
                                          fill="url(#paint0_linear_4723_154911)"
                                        ></path>
                                        <path
                                          d="M13.189 24.0291C14.2103 23.0771 14.3676 21.5858 13.5402 20.6983C12.7129 19.8108 11.2143 19.8632 10.193 20.8152C9.17169 21.7673 9.01442 23.2585 9.84173 24.146C10.669 25.0335 12.1677 24.9812 13.189 24.0291Z"
                                          fill="#7EB5FF"
                                        ></path>
                                        <path
                                          d="M26.7026 24.0291C27.724 23.0771 27.8812 21.5858 27.0539 20.6983C26.2266 19.8108 24.728 19.8631 23.7067 20.8152C22.6854 21.7673 22.5281 23.2585 23.3554 24.146C24.1827 25.0335 25.6813 24.9812 26.7026 24.0291Z"
                                          fill="#7EB5FF"
                                        ></path>
                                      </g>
                                      <defs>
                                        <linearGradient
                                          id="paint0_linear_4723_154911"
                                          x1="16.2954"
                                          y1="23.2864"
                                          x2="11.8202"
                                          y2="7.69953"
                                          gradientUnits="userSpaceOnUse"
                                        >
                                          <stop stopColor="#1B5EEB"></stop>
                                          <stop
                                            offset="1"
                                            stopColor="#4987FF"
                                          ></stop>
                                        </linearGradient>
                                        <clipPath id="clip0_4723_154911">
                                          <rect
                                            width="32"
                                            height="32"
                                            fill="white"
                                          ></rect>
                                        </clipPath>
                                      </defs>
                                    </svg>
                                  </span>
                                </div>
                                <Flex vertical>
                                  <Space
                                    className={clsx(style.policy_main_header)}
                                  >
                                    Miễn phí vận chuyển
                                  </Space>
                                  <Space
                                    className={clsx(style.policy_sub_header)}
                                  >
                                    theo chính sách giao hàng
                                  </Space>
                                </Flex>
                              </Flex>
                            </Space>
                          </Flex>
                        </Flex>
                      </Col>
                    </Row>
                  </div>
                </div>

                {product && product.detail && (
                  <div
                    className={clsx(
                      style.wrapper_global,
                      style.product_background,
                      style.customBackgroundWhite,
                      style.customMT8
                    )}
                  >
                    <div
                      style={{ background: "#eef0f3" }}
                      className={clsx(
                        style.product_wrapper,
                        // style.product_wrapper_show,
                        window.innerWidth > 1200 && style.showPc
                      )}
                    >
                      <Row>
                        <Col
                          className={clsx(style.detail_left_wrapper)}
                          xs={24}
                          md={18}
                        >
                          <Row>
                            <Col className={clsx(style.product_detail_header)}>
                              Mô tả sản phẩm
                            </Col>
                            <Col
                              className={clsx(style.product_detail, {
                                [style.show]: showMore,
                              })}
                              dangerouslySetInnerHTML={{
                                __html: product?.detail as string,
                              }}
                            ></Col>
                            {!showMore ? (
                              <Col
                                onClick={handleShowMore}
                                className={clsx(style.product_detail_show)}
                              >
                                <Flex align="center">
                                  <PiCaretDoubleDownBold />
                                </Flex>
                                <Space
                                  style={{
                                    marginLeft: "5px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                  }}
                                >
                                  Xem thêm
                                </Space>
                              </Col>
                            ) : (
                              <Col
                                onClick={handleShowMore}
                                className={clsx(
                                  style.product_detail_show,
                                  {
                                    [style.show]: showMore,
                                  },
                                  window.innerWidth > 1200 && style.showPc
                                )}
                              >
                                <Flex align="center">
                                  <PiCaretDoubleUpBold />
                                </Flex>
                                <Space
                                  style={{
                                    marginLeft: "5px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                  }}
                                >
                                  Thu gọn
                                </Space>
                              </Col>
                            )}
                          </Row>
                        </Col>

                        <Col
                          className={clsx(style.detail_right_wrapper)}
                          xs={0}
                          md={6}
                        >
                          <Row
                            style={{ margin: "0px 16px 0px 0px" }}
                            className={clsx(style.product_detail_right, {
                              [style.showRight]: showMoreRight,
                            })}
                          >
                            <Col span={24}>
                              <div className={clsx(style.detail_right_header)}>
                                Có thể bạn quan tâm
                              </div>
                            </Col>
                            {products &&
                              products.length &&
                              products.map((product, index) => {
                                if (index < 3) {
                                  return (
                                    <Col span={24}>
                                      <Link
                                        onClick={() =>
                                          handleDetail(
                                            // product._id,
                                            product._id,
                                            product.categoryId
                                          )
                                        }
                                        to={`/sanpham/${product.slug}`}
                                        className={clsx(style.wrapper)}
                                      >
                                        <Flex
                                          className={clsx(
                                            style.content,
                                            style.content_youKnow
                                          )}
                                          vertical
                                        >
                                          {/* <Space
                                            className={clsx(
                                              style.content_discount
                                            )}
                                          >
                                            <Discount
                                              discount={product.discount}
                                            ></Discount>
                                          </Space> */}

                                          {/* <Space
                                            className={clsx(
                                              style.label_wrapper,
                                              !product.stock && style.soldOut
                                            )}
                                          >
                                            <Label
                                              soldOut={
                                                !product.stock ? true : false
                                              }
                                              title={product.category.name}
                                            />
                                          </Space> */}
                                          {/* pic and fakeNumber */}
                                          <Flex
                                            className={clsx(
                                              style.product_name_wrapper
                                            )}
                                            justify="center"
                                          >
                                            <img
                                              src={product.pic}
                                              className={clsx(
                                                style.content_img,
                                                style.content_img_youKnow
                                              )}
                                              alt=""
                                            />
                                            {/* <Space
                                              className={clsx(
                                                style.product_name_fakeNumber
                                              )}
                                            >
                                             <FakeNumber
                                                    fakeNumber={
                                                      product.fakeNumber
                                                    }
                                                    realNumber={product.sold}
                                                  />
                                            </Space> */}
                                          </Flex>
                                          <Flex
                                            vertical
                                            justify="space-between"
                                            style={{
                                              padding: "10px 20px 0px 20px",
                                            }}
                                          >
                                            <Space
                                              className={clsx(
                                                style.header_text
                                              )}
                                            >
                                              {product.name}
                                            </Space>
                                            <Flex justify="space-between">
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                                className={clsx(
                                                  style.header_text
                                                )}
                                              >
                                                <div>
                                                  <FaCartShopping
                                                    style={{
                                                      color: "#AAAAAA",
                                                      fontSize: "20px",
                                                      marginRight: "4px",
                                                    }}
                                                  />
                                                </div>
                                                <div>
                                                  {product.fakeNumber
                                                    ? product.fakeNumber +
                                                    product.sold
                                                    : product.sold}
                                                </div>
                                              </div>
                                              <Flex align="center">
                                                <FiChevronRight
                                                  style={{ fontSize: "20px" }}
                                                />
                                              </Flex>
                                            </Flex>

                                            {/* <Space
                                              className={clsx(
                                                style.header_discount
                                              )}
                                            >
                                              {product &&
                                              product?.discount > 0 ? (
                                                <>
                                                  <Space>
                                                    <div>
                                                      {numeral(
                                                        product?.total
                                                      ).format("0,0$")}
                                                      <span
                                                        style={{
                                                          margin: "0 4px",
                                                        }}
                                                      >
                                                        &#47;
                                                      </span>
                                                      {product.unit}
                                                    </div>
                                                  </Space>
                                                </>
                                              ) : (
                                                <Space>
                                                  <div>
                                                    {numeral(
                                                      product?.price
                                                    ).format("0,0$")}
                                                    <span
                                                      style={{
                                                        margin: "0 4px",
                                                      }}
                                                    >
                                                      &#47;
                                                    </span>
                                                    {product?.unit}
                                                  </div>
                                                </Space>
                                              )}
                                            </Space> */}
                                            {/* {product &&
                                            product?.discount > 0 ? (
                                              <del
                                                className={clsx(
                                                  style.header_price
                                                )}
                                              >
                                                {numeral(product.price).format(
                                                  "0,0$"
                                                )}
                                              </del>
                                            ) : (
                                              <></>
                                            )} */}
                                            {/* <Specifications
                                              title={product.specifications}
                                            /> */}
                                            {/* buy
                                            <Flex justify="space-between">
                                              <Space
                                                // // onClick={handleAddToCart}
                                                className={clsx(
                                                  style.buy_now_in_home,
                                                  product &&
                                                    !product.stock &&
                                                    style.soldOut_disabled
                                                )}
                                              >
                                                Chọn mua
                                              </Space>
                                            </Flex> */}
                                          </Flex>
                                        </Flex>
                                      </Link>
                                    </Col>
                                  );
                                }
                              })}

                            {!showMoreRight ? (
                              <Col
                                onClick={handleShowMoreRight}
                                className={clsx(
                                  style.product_detail_show_right
                                )}
                              >
                                <Flex align="center">
                                  <PiCaretDoubleDownBold />
                                </Flex>
                                <Space
                                  style={{
                                    marginLeft: "5px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                  }}
                                >
                                  Xem thêm
                                </Space>
                              </Col>
                            ) : (
                              <Col
                                onClick={handleShowMoreRight}
                                className={clsx(
                                  style.product_detail_show_right,

                                  window.innerWidth > 1200 && style.showPc
                                )}
                              >
                                <Flex align="center">
                                  <PiCaretDoubleUpBold />
                                </Flex>
                                <Space
                                  style={{
                                    marginLeft: "5px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                  }}
                                >
                                  Thu gọn
                                </Space>
                              </Col>
                            )}
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </div>
                )}
              </div>

              {/* địa chỉ cửa hàng, theo category, theo lịch sử*/}
              <div className={clsx(style.product_background)}>
                {/* xem địa chỉ cửa hàng */}
                {window.innerWidth <= 576 && (
                  <div
                    className={clsx(
                      style.wrapper_global,
                      style.customBackgroundWhite
                    )}
                  >
                    <Row>
                      <Col style={{ marginBottom: "10px" }} span={24}>
                        <Flex align="center">
                          <img
                            style={{
                              width: "24px",
                              height: "24px",
                            }}
                            src="https://nhathuoclongchau.com.vn/estore-images/pin.png"
                            alt=""
                          />
                          <Space className={clsx(style.typePayment_header)}>
                            Địa chỉ cửa hàng
                          </Space>
                        </Flex>
                      </Col>
                      <Col span={24}>
                        <Row gutter={[8, 0]}>
                          <Col span={24}>
                            <Flex className={clsx(style.wrapper_location)}>
                              {locations &&
                                locations.map((item: any) => (
                                  <Row gutter={[4, 0]}>
                                    <Col xs={2} sm={1}>
                                      <Flex justify="center">
                                        <FaCheckCircle
                                          style={{
                                            fontSize: "20px",
                                            color: "#1250dd",
                                          }}
                                        />
                                      </Flex>
                                    </Col>
                                    <Col xs={22} sm={18}>
                                      <Row gutter={10}>
                                        <Col>
                                          {product.stock ? (
                                            <Space
                                              style={{
                                                color: "#039855",
                                                fontWeight: 600,
                                              }}
                                            >
                                              Có hàng
                                            </Space>
                                          ) : (
                                            <Space
                                              style={{
                                                color: "#ff0200",
                                                fontWeight: 600,
                                              }}
                                            >
                                              Hết hàng
                                            </Space>
                                          )}
                                        </Col>
                                        <Col>
                                          <Space
                                            style={{
                                              color: "#020b27",
                                              fontWeight: 600,
                                            }}
                                          >
                                            {item.name}
                                          </Space>
                                        </Col>
                                      </Row>
                                      <Flex
                                        style={{
                                          margin: "5px 0px",
                                        }}
                                        align="center"
                                      >
                                        <FaClock
                                          style={{
                                            color: "#aab2be",
                                            fontSize: "15px",
                                            marginRight: "5px",
                                          }}
                                        />
                                        {item.time}
                                      </Flex>
                                      <Flex
                                        style={{
                                          margin: "5px 0px",
                                        }}
                                        align="center"
                                      >
                                        <FaLocationDot
                                          style={{
                                            color: "#aab2be",
                                            fontSize: "15px",
                                            marginRight: "5px",
                                          }}
                                        />
                                        {item.address}
                                      </Flex>
                                    </Col>
                                    <Col xs={2} sm={0}></Col>
                                    <Col xs={22} sm={5}>
                                      <a
                                        className={clsx(style.location_map)}
                                        target="_blank"
                                        href={item.map}
                                        rel="noreferrer"
                                      >
                                        <Flex align="center">
                                          <GrDirections
                                            style={{
                                              fontSize: "15px",
                                              marginRight: "3px",
                                            }}
                                          />
                                          <Space>Chỉ đường</Space>
                                        </Flex>
                                      </a>
                                    </Col>
                                  </Row>
                                ))}
                            </Flex>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                )}

                {productsSearch && (
                  <div
                    style={{ paddingBottom: "10px" }}
                    className={clsx(
                      style.wrapper_global,
                      style.product_background
                    )}
                  >
                    <div>
                      <Row>
                        <Col span={24}>
                          {productsSearch.length > 1 && (
                            <Space className={clsx(style.title_product_relate)}>
                              Sản phẩm liên quan
                            </Space>
                          )}

                          <Swiper
                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                            breakpoints={{
                              1200: {
                                spaceBetween: 14,
                                slidesPerView: 6,
                                loop: histories.length > 6 ? true : false,
                              },
                              0: {
                                spaceBetween: 12,
                                slidesPerView: 2,
                                loop: true,
                              },
                            }}
                          >
                            {productsSearch.length > 6 ? (
                              <Flex
                                justify="space-between"
                                className={clsx(style.customSwiper_child)}
                              >
                                <ButtonNavigation />
                              </Flex>
                            ) : (
                              <></>
                            )}

                            {productsSearch ? (
                              productsSearch.map((product, index) => {
                                if (product._id !== productCurrent)
                                  return (
                                    <React.Fragment key={index}>
                                      <SwiperSlide>
                                        <Link
                                          onClick={() =>
                                            handleDetail(
                                              // product._id,
                                              product._id,
                                              product.categoryId
                                            )
                                          }
                                          to={`/sanpham/${product.slug}`}
                                          className={clsx(style.wrapper)}
                                        >
                                          <Flex
                                            className={clsx(style.content)}
                                            vertical
                                          >
                                            <Space
                                              className={clsx(
                                                style.content_discount
                                              )}
                                            >
                                              <Discount
                                                discount={product.discount}
                                              ></Discount>
                                            </Space>

                                            <Space
                                              className={clsx(
                                                style.label_wrapper,
                                                !product.stock && style.soldOut
                                              )}
                                            >
                                              {/* <Label
                                                soldOut={
                                                  !product.stock ? true : false
                                                }
                                                title={product.category.name}
                                              /> */}
                                            </Space>
                                            {/* pic and fakeNumber */}
                                            <Flex
                                              className={clsx(
                                                style.product_name_wrapper
                                              )}
                                              justify="center"
                                            >
                                              <img
                                                src={product.pic}
                                                className={clsx(
                                                  style.content_img
                                                )}
                                                alt=""
                                              />
                                              <Space
                                                className={clsx(
                                                  style.product_name_fakeNumber
                                                )}
                                              >
                                                <FakeNumber
                                                  fakeNumber={
                                                    product.fakeNumber
                                                  }
                                                  realNumber={product.sold}
                                                />
                                              </Space>
                                            </Flex>
                                            <Flex
                                              vertical
                                              justify="space-between"
                                              className={clsx(style.customPadding)}
                                            >
                                              <Space
                                                className={clsx(
                                                  style.header_text
                                                )}
                                              >
                                                {product.name}
                                              </Space>

                                              <Space
                                                className={clsx(
                                                  style.header_discount
                                                )}
                                              >
                                                {product &&
                                                  product?.discount > 0 ? (
                                                  <>
                                                    <Space>
                                                      <div>
                                                        {numeral(
                                                          product?.total
                                                        ).format("0,0$")}
                                                        <span
                                                          style={{
                                                            margin: "0 4px",
                                                          }}
                                                        >
                                                          &#47;
                                                        </span>
                                                        {product.unit}
                                                      </div>
                                                    </Space>
                                                    <Space>
                                                      {/* <del>
                                        {numeral(product?.price).format("$0,0")}
                                      </del> */}
                                                    </Space>
                                                  </>
                                                ) : (
                                                  <>
                                                    <Space>
                                                      <div>
                                                        {numeral(
                                                          product?.price
                                                        ).format("0,0$")}
                                                        <span
                                                          style={{
                                                            margin: "0 4px",
                                                          }}
                                                        >
                                                          &#47;
                                                        </span>
                                                        {product?.unit}
                                                      </div>
                                                    </Space>
                                                  </>
                                                )}
                                              </Space>
                                              {product &&
                                                product?.discount > 0 ? (
                                                <del
                                                  className={clsx(
                                                    style.header_price
                                                  )}
                                                >
                                                  {numeral(
                                                    product.price
                                                  ).format("0,0$")}
                                                </del>
                                              ) : (
                                                <></>
                                              )}
                                              <Specifications
                                                title={product.specifications}
                                              />
                                              {/* buy */}
                                              <Flex justify="space-between">
                                                <Space
                                                  onClick={(e) =>
                                                    handleAddToCartTest(
                                                      e,
                                                      product
                                                    )
                                                  }
                                                  className={clsx(
                                                    style.buy_now_in_home,
                                                    product &&
                                                    !product.stock &&
                                                    style.soldOut_disabled
                                                  )}
                                                >
                                                  Chọn mua
                                                </Space>
                                              </Flex>
                                            </Flex>
                                          </Flex>
                                        </Link>
                                      </SwiperSlide>
                                    </React.Fragment>
                                  );
                              })
                            ) : (
                              <SwiperSlide>
                                <Col
                                  xs={24}
                                  sm={24}
                                  style={{ marginBottom: "25px" }}
                                >
                                  <Empty
                                    description={
                                      <span>Không có sản phẩm nào</span>
                                    }
                                  />
                                </Col>
                              </SwiperSlide>
                            )}
                          </Swiper>
                        </Col>
                      </Row>
                    </div>
                  </div>
                )}

                {histories && histories.length ? (
                  <div
                    style={{
                      background: "#eaeffa",
                    }}
                  >
                    <div
                      style={{ paddingTop: "10px" }}
                      className={clsx(style.wrapper_global)}
                    >
                      <Row>
                        <Col span={24}>
                          <Flex
                            align="center"
                            className={clsx(style.title_product_relate)}
                          >
                            <img
                              className={clsx(style.icon_header)}
                              src="https://nhathuoclongchau.com.vn/estore-images/icon-service/recently-product-watched-icon.svg"
                              alt=""
                            />
                            Sản phẩm vừa xem
                          </Flex>

                          <Swiper
                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                            breakpoints={{
                              1200: {
                                spaceBetween: 14,
                                slidesPerView: 6,
                                loop: histories.length > 6 ? true : false,
                              },
                              0: {
                                spaceBetween: 12,
                                slidesPerView: 2,
                                loop: true,
                              },
                            }}
                            style={{ backgroundColor: "#eaeffa" }}
                          >
                            {histories.length > 6 && (
                              <Flex
                                justify="space-between"
                                className={clsx(style.customSwiper_child)}
                              >
                                <ButtonNavigation />
                              </Flex>
                            )}

                            {products &&
                              products.map((product, index) => {
                                if (histories.includes(product._id)) {
                                  return (
                                    <React.Fragment key={index}>
                                      <SwiperSlide>
                                        <Link
                                          onClick={() =>
                                            handleDetail(
                                              // product._id,
                                              product._id,
                                              product.categoryId
                                            )
                                          }
                                          to={`/sanpham/${product.slug}`}
                                          className={clsx(style.wrapper)}
                                        >
                                          <Flex
                                            className={clsx(style.content)}
                                            vertical
                                          >
                                            <Space
                                              className={clsx(
                                                style.content_discount
                                              )}
                                            >
                                              <Discount
                                                discount={product.discount}
                                              ></Discount>
                                            </Space>
                                            <Space
                                              className={clsx(
                                                style.label_wrapper,
                                                !product.stock && style.soldOut
                                              )}
                                            >
                                              {/* <Label
                                                soldOut={
                                                  !product.stock ? true : false
                                                }
                                                title={product.category.name}
                                              /> */}
                                            </Space>
                                            {/* pic and fakeNumber */}
                                            <Flex
                                              className={clsx(
                                                style.product_name_wrapper
                                              )}
                                              justify="center"
                                            >
                                              <img
                                                src={product.pic}
                                                className={clsx(
                                                  style.content_img
                                                )}
                                                alt=""
                                              />
                                              <Space
                                                className={clsx(
                                                  style.product_name_fakeNumber
                                                )}
                                              >
                                                <FakeNumber
                                                  fakeNumber={
                                                    product.fakeNumber
                                                  }
                                                  realNumber={product.sold}
                                                />
                                              </Space>
                                            </Flex>
                                            <Flex
                                              vertical
                                              justify="space-between"
                                              className={clsx(style.customPadding)}
                                            >
                                              <Space
                                                className={clsx(
                                                  style.header_text
                                                )}
                                              >
                                                {product.name}
                                              </Space>

                                              <Space
                                                className={clsx(
                                                  style.header_discount
                                                )}
                                              >
                                                {product &&
                                                  product?.discount > 0 ? (
                                                  <>
                                                    <Space>
                                                      <div>
                                                        {numeral(
                                                          product?.total
                                                        ).format("0,0$")}
                                                        <span
                                                          style={{
                                                            margin: "0 2px",
                                                          }}
                                                        >
                                                          &#47;
                                                        </span>
                                                        {product.unit}
                                                      </div>
                                                    </Space>
                                                    <Space>
                                                      {/* <del>
                            {numeral(product?.price).format("$0,0")}
                          </del> */}
                                                    </Space>
                                                  </>
                                                ) : (
                                                  <>
                                                    <Space>
                                                      <div>
                                                        {numeral(
                                                          product?.price
                                                        ).format("0,0$")}
                                                        <span
                                                          style={{
                                                            margin: "0 2px",
                                                          }}
                                                        >
                                                          &#47;
                                                        </span>
                                                        {product?.unit}
                                                      </div>
                                                    </Space>
                                                  </>
                                                )}
                                              </Space>
                                              {product &&
                                                product?.discount > 0 ? (
                                                <del
                                                  className={clsx(
                                                    style.header_price
                                                  )}
                                                >
                                                  {numeral(
                                                    product.price
                                                  ).format("0,0$")}
                                                </del>
                                              ) : (
                                                <></>
                                              )}
                                              <Specifications
                                                title={product.specifications}
                                              />
                                              {/* buy */}
                                              <Flex justify="space-between">
                                                <Space
                                                  onClick={(e) =>
                                                    handleAddToCartTest(
                                                      e,
                                                      product
                                                    )
                                                  }
                                                  // onClick={() =>
                                                  //   setActiveBuyMobile(true)
                                                  // }
                                                  className={clsx(
                                                    style.buy_now_in_home,
                                                    product &&
                                                    !product.stock &&
                                                    style.soldOut_disabled
                                                  )}
                                                >
                                                  Chọn mua
                                                </Space>
                                              </Flex>
                                            </Flex>
                                          </Flex>
                                        </Link>
                                      </SwiperSlide>
                                    </React.Fragment>
                                  );
                                }
                              })}
                          </Swiper>
                        </Col>
                      </Row>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>

              {/*mobile buy */}
              <Flex
                className={clsx(style.buy_wrapper_mobile)}
                justify="space-between"
              >
                <Space>
                  <a href={`tel:0933110500`} className={clsx(style.text)}>
                    <FaFacebookMessenger
                      style={{ color: "#1250dc", fontSize: "30px" }}
                    />
                  </a>
                </Space>
                <Space
                  onClick={(e) => handleAddToCartTest(e, product)}
                  // onClick={handleAddToCart}
                  className={clsx(
                    style.add_to_cart,
                    product && !product.stock && style.soldOut_disabled
                  )}
                >
                  Chọn mua
                </Space>
                <Space
                  onClick={handleAddToCartNow}
                  className={clsx(
                    style.buy_now,
                    product && !product.stock && style.soldOut_disabled
                  )}
                >
                  Mua ngay
                </Space>
              </Flex>
              <BuyMobile
                product={specificProduct}
                SetIsActive={setActiveBuyMobile}
                active={activeBuyMobile}
              />
            </>
          ) : (
            <Skeleton active></Skeleton>
          )}
        </ConfigProvider>
      </div>
    </div>
  );
}

export default ProductDetail;
