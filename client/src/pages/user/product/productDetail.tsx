import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getAllProductSearch,
  getProductById,
} from "../../../slices/productSlice";
import { Col, Row, Space, Image, Flex, Empty } from "antd";
import numeral from "numeral";
import style from "./product.module.css";
import clsx from "clsx";
import { addToCart } from "../../../slices/cartSlice";
import {
  DownOutlined,
  MinusOutlined,
  PlusOutlined,
  UpOutlined,
} from "@ant-design/icons";
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
import SlideNextButton from "../../../components/buttonNavigation";
import ButtonNavigation from "../../../components/buttonNavigation";

function ProductDetail() {
  const param = useParams();

  const { product, productsSearch } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState<number>(1);
  const [showMore, setShowMore] = useState<boolean>(false);

  const productCurrent = localStorage.getItem("productId")
    ? JSON.parse(localStorage.getItem("productId")!)
    : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [location]);

  useEffect(() => {
    const id = localStorage.getItem("productId")
      ? JSON.parse(localStorage.getItem("productId")!)
      : undefined;
    // chỉ dispatch khi load lại trang
    if (id && product?.name === "") {
      dispatch(getProductById(id));
      dispatch(getAllProductSearch({ categoryId: product.categoryId }));
    }
  }, []);

  // add to cart
  const handleAddToCart = () => {
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
      })
    );
  };

  //search brand
  const handleSearchBrand = (id: string, name: string, categoryId: string) => {
    localStorage.setItem(
      "filter",
      JSON.stringify({ brandId: id, categoryId: categoryId })
    );
    dispatch(getAllProductSearch({ brandId: id, categoryId: categoryId }));
  };

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  // go to detail
  const handleDetail = (value: string, categoryId: string) => {
    localStorage.setItem("filter", JSON.stringify({ categoryId: categoryId }));
    localStorage.setItem("productId", JSON.stringify(value));
    dispatch(getProductById(value));
    dispatch(getAllProductSearch({ categoryId: categoryId }));
  };
  return (
    <>
      <div className={clsx(style.wrapper_global, style.product_background)}>
        <div className={clsx(style.product_wrapper)}>
          <Row gutter={24}>
            <Col span={10}>
              <Flex style={{ margin: "16px" }} vertical justify="center">
                <Image
                  style={{ borderRadius: "10px" }}
                  width="100%"
                  height="335px"
                  src={product?.pic}
                ></Image>
                <Swiper
                  modules={[Navigation, Pagination, Scrollbar, A11y]}
                  style={{ width: "100%", marginTop: "50px" }}
                  spaceBetween={10}
                  slidesPerView={3}
                  pagination={{ clickable: true }}
                  className={clsx(style.pagination)}
                >
                  {product?.album &&
                    product?.album.map((item) => (
                      <SwiperSlide>
                        <Image
                          style={{
                            height: "80px",
                            width: `150px`,
                            borderRadius: "10px",
                          }}
                          src={item}
                        >
                          {item}
                        </Image>
                      </SwiperSlide>
                    ))}
                </Swiper>
              </Flex>
            </Col>
            <Col span={14}>
              <Flex style={{ padding: "16px" }} vertical>
                <Space>
                  <div>
                    Thương hiệu:
                    <Link
                      to={`/timkiem?s=${product?.brand.name}`}
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
                <Space>
                  <Space className={clsx(style.name_detail)}>
                    {product?.name}
                  </Space>
                </Space>
                <Space>
                  <Flex style={{ marginBottom: "20px" }} vertical>
                    {product && product?.discount > 0 ? (
                      <>
                        <Space className={clsx(style.price_detail)}>
                          {numeral(product?.total).format("0,0$")}&#47;
                          {product.unit}
                        </Space>
                        <Space className={clsx(style.price_total)}>
                          <del>{numeral(product?.price).format("$0,0")}</del>
                        </Space>
                      </>
                    ) : (
                      <>
                        <Space className={clsx(style.price_detail)}>
                          {numeral(product?.price).format("0,0$")}&#47;
                          {product?.unit}
                        </Space>
                      </>
                    )}
                  </Flex>
                </Space>
                {product && product.specifications ? (
                  <Space className={clsx(style.brief_detail_wrapper)}>
                    <Space className={clsx(style.brief_detail)}>Quy cách</Space>
                    <Space className={clsx(style.des_detail)}>
                      {product?.specifications}
                    </Space>
                  </Space>
                ) : (
                  <></>
                )}

                {product && product.fromBrand ? (
                  <Space className={clsx(style.brief_detail_wrapper)}>
                    <Space className={clsx(style.brief_detail)}>
                      Xuất xứ thương hiệu
                    </Space>
                    <Space className={clsx(style.des_detail)}>
                      {product?.fromBrand}
                    </Space>
                  </Space>
                ) : (
                  <></>
                )}

                {product && product.supplierHome ? (
                  <Space className={clsx(style.brief_detail_wrapper)}>
                    <Space className={clsx(style.brief_detail)}>
                      Nhà sản xuất
                    </Space>
                    <Space className={clsx(style.des_detail)}>
                      {product?.supplierHome}
                    </Space>
                  </Space>
                ) : (
                  <></>
                )}

                {product && product.country ? (
                  <Space className={clsx(style.brief_detail_wrapper)}>
                    <Space className={clsx(style.brief_detail)}>
                      Nước sản xuất
                    </Space>
                    <Space className={clsx(style.des_detail)}>
                      {product?.country}
                    </Space>
                  </Space>
                ) : (
                  <></>
                )}

                {product && product.ingredient ? (
                  <Space className={clsx(style.brief_detail_wrapper)}>
                    <Space className={clsx(style.brief_detail)}>
                      Thành phần
                    </Space>
                    <Space className={clsx(style.des_detail)}>
                      {product?.ingredient}
                    </Space>
                  </Space>
                ) : (
                  <></>
                )}

                {product && product.description ? (
                  <Space className={clsx(style.brief_detail_wrapper)}>
                    <Space className={clsx(style.brief_detail)}>
                      Mô tả ngắn
                    </Space>
                    <Space className={clsx(style.des_detail)}>
                      {product?.description}
                    </Space>
                  </Space>
                ) : (
                  <></>
                )}

                <Space className={clsx(style.brief_detail_wrapper)}>
                  <Space className={clsx(style.brief_detail)}>
                    Chọn số lượng
                  </Space>
                  <Space className={clsx(style.quantity_detail_wrapper)}>
                    <Space
                      onClick={() => setQuantity(quantity - 1)}
                      className={clsx(
                        quantity === 0
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
                <Flex justify="space-between">
                  <Space
                    onClick={handleAddToCart}
                    className={clsx(style.add_to_cart)}
                  >
                    Thêm vào giỏ hàng
                  </Space>
                  <Space
                    onClick={handleAddToCart}
                    className={clsx(style.buy_now)}
                  >
                    Chọn mua
                  </Space>
                </Flex>
              </Flex>
            </Col>
          </Row>
        </div>
      </div>
      {product && product.detail ? (
        <div className={clsx(style.wrapper_global, style.product_background)}>
          <div className={clsx(style.product_wrapper)}>
            <Row>
              <Col className={clsx(style.product_detail_header)}>
                Mô tả sản phẩm
              </Col>
              <Col
                className={clsx(style.product_detail, {
                  [style.show]: showMore,
                })}
                dangerouslySetInnerHTML={{ __html: product?.detail as string }}
              ></Col>
              {!showMore ? (
                <Col
                  onClick={handleShowMore}
                  className={clsx(style.product_detail_show)}
                >
                  <Space>
                    <DownOutlined />
                  </Space>
                  <Space style={{ marginLeft: "5px" }}>Xem thêm</Space>
                </Col>
              ) : (
                <Col
                  onClick={handleShowMore}
                  className={clsx(style.product_detail_show)}
                >
                  <Space>
                    <UpOutlined />
                  </Space>
                  <Space style={{ marginLeft: "5px" }}>Rút gọn</Space>
                </Col>
              )}
            </Row>
          </div>
        </div>
      ) : (
        <></>
      )}

      {productsSearch ? (
        <div
          className={clsx(
            style.wrapper_global,
            style.product_background,
            style.customSwiper_parent
          )}
        >
          <div className={clsx(style.product_wrapper)}>
            <Row>
              <Col span={24}>
                <Swiper
                  modules={[Navigation, Pagination, Scrollbar, A11y]}
                  spaceBetween={18}
                  slidesPerView={6}
                  style={{ backgroundColor: "#edf0f3" }}
                >
                  <Flex
                    justify="space-between"
                    className={clsx(style.customSwiper_child)}
                  >
                    <ButtonNavigation />
                  </Flex>

                  {productsSearch ? (
                    productsSearch.map((product) => {
                      if (product._id !== productCurrent)
                        return (
                          <>
                            <SwiperSlide>
                              <Link
                                onClick={() =>
                                  handleDetail(product._id, product.categoryId)
                                }
                                to={`/sanpham/${product.slug}`}
                                className={clsx(style.wrapper)}
                              >
                                <Flex className={clsx(style.content)} vertical>
                                  <Space
                                    className={clsx(style.content_discount)}
                                  >
                                    <Discount
                                      discount={product.discount}
                                    ></Discount>
                                  </Space>

                                  <Flex justify="center">
                                    <img
                                      src={product.pic}
                                      className={clsx(style.content_img)}
                                      alt=""
                                    />
                                  </Flex>
                                  <Flex
                                    vertical
                                    justify="space-between"
                                    style={{ padding: "20px" }}
                                  >
                                    <Space className={clsx(style.header_text)}>
                                      {product.name}
                                    </Space>
                                    <Space
                                      className={clsx(style.header_discount)}
                                    >
                                      {product && product?.discount > 0 ? (
                                        <>
                                          <Space>
                                            {numeral(product?.total).format(
                                              "0,0$"
                                            )}
                                            &#47;
                                            {product.unit}
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
                                            {numeral(product?.price).format(
                                              "0,0$"
                                            )}
                                            &#47;
                                            {product?.unit}
                                          </Space>
                                        </>
                                      )}
                                    </Space>
                                    <del className={clsx(style.header_price)}>
                                      {numeral(product.price).format("$0,0")}
                                    </del>
                                  </Flex>
                                </Flex>
                              </Link>
                            </SwiperSlide>
                          </>
                        );
                    })
                  ) : (
                    <SwiperSlide>
                      <Col xs={24} sm={24} style={{ marginBottom: "25px" }}>
                        <Empty />
                      </Col>
                    </SwiperSlide>
                  )}
                </Swiper>
              </Col>
            </Row>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default ProductDetail;
