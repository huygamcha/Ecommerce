import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getAllProductSearch,
  getProductById,
} from "../../../slices/productSlice";
import { Col, Row, Space, Image, Flex } from "antd";
import numeral from "numeral";
import style from "./product.module.css";
import clsx from "clsx";
import { addToCart } from "../../../slices/cartSlice";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

function ProductDetail() {
  const param = useParams();

  const { product, error } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const id = localStorage.getItem("productId")
      ? JSON.parse(localStorage.getItem("productId")!)
      : undefined;
    // chỉ dispatch khi load lại trang
    if (id && product?.name === "") {
      dispatch(getProductById(id));
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

  // carousel
  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "160px",
    width: "100px",
    textAlign: "center",
    background: "#364d79",
  };

  return (
    <div className={clsx(style.wrapper_global, style.product_background)}>
      <div className={clsx(style.product_wrapper)}>
        <Row gutter={24}>
          <Col span={8}>
            <Flex vertical justify="center">
              <Image
                style={{ padding: "50px" }}
                width="400px"
                height="335px"
                src={product?.pic}
              ></Image>
              <Swiper
                style={{ width: "100%" }}
                spaceBetween={0}
                slidesPerView={3}
              >
                {product?.album &&
                  product?.album.map((item) => (
                    <SwiperSlide>
                      <Image src={item}>{item}</Image>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </Flex>
          </Col>
          <Col span={16}>
            <Flex style={{ padding: "50px" }} vertical>
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
                  <Space className={clsx(style.brief_detail)}>Thành phần</Space>
                  <Space className={clsx(style.des_detail)}>
                    {product?.ingredient}
                  </Space>
                </Space>
              ) : (
                <></>
              )}

              {product && product.description ? (
                <Space className={clsx(style.brief_detail_wrapper)}>
                  <Space className={clsx(style.brief_detail)}>Mô tả ngắn</Space>
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
  );
}

export default ProductDetail;
