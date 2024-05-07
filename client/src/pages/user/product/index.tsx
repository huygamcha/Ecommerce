import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Flex, Row, Space, Empty } from "antd";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getAllProduct,
  getAllProductSearch,
  getProductById,
} from "../../../slices/productSlice";
import numeral from "numeral";
import { getAllCategory } from "../../../slices/categorySlice";
import { getAllSupplier } from "../../../slices/supplierSlice";
import clsx from "clsx";
import style from "./product.module.css";
import Discount from "../../../components/discount";
// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Virtual } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import ButtonNavigation from "../../../components/buttonNavigation";
import { Button } from "antd/es/radio";
import { getAllBanner } from "../../../slices/bannerSlice";
import MenuFooter from "../../../components/MenuFooter";
import Label from "../../../components/label";
import { FaDivide } from "react-icons/fa6";
import { PiCaretDoubleDownBold, PiCaretDoubleUpBold } from "react-icons/pi";
import Specifications from "../../../components/specifications";

function ProductScreen() {
  const { products, error } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const { suppliers } = useAppSelector((state) => state.suppliers);
  const { brands } = useAppSelector((state) => state.brands);
  const { tags } = useAppSelector((state) => state.tags);
  const { banners } = useAppSelector((state) => state.banners);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [searchAge, setSearchAge] = useState<Number>(1);
  const [moreTopSale, setMoreTopSale] = useState<number>(5);
  const [searchTag, setSearchTag] = useState<string>(
    "65d8b631214ed285ba4bc016"
  );

  // lưu vào lịch sử
  const histories = localStorage.getItem("histories")
    ? JSON.parse(localStorage.getItem("histories")!)
    : [];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });

    if (products.length === 0) dispatch(getAllProduct({}));
    if (categories.length === 0) dispatch(getAllCategory());
    if (suppliers.length === 0) dispatch(getAllSupplier());
    if (banners.length === 0) dispatch(getAllBanner());
  }, []);

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
    dispatch(getAllProductSearch({ categoryId: categoryId }));
  };

  //search category and brand
  const handleSearchMenu = (categoryId: string, brandId: string) => {
    localStorage.setItem(
      "filter",
      JSON.stringify({ categoryId: categoryId, brandId: brandId })
    );
  };
  let count = 0;

  return (
    <>
      {/* banner */}
      <div style={{ borderRadius: "0px", backgroundColor: "#F8F9FD" }}>
        <div
          className={clsx(
            style.wrapper_global,
            style.wrapper_global_banner,
            style.customPT20
          )}
        >
          <Row>
            <Col span={24}>
              <Swiper
                loop={banners.length > 1 ? true : false}
                autoplay={{
                  delay: 2000,
                }}
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                breakpoints={{
                  1200: {
                    spaceBetween: 18,
                    slidesPerView: 1,
                  },
                  0: {
                    spaceBetween: 0,
                    slidesPerView: 1,
                  },
                }}
                pagination={{ clickable: true }}
                className={clsx(style.background_banner)}
              >
                <Flex
                  justify="space-between"
                  className={clsx(style.customSwiper_child)}
                >
                  <ButtonNavigation />
                </Flex>

                {banners ? (
                  banners.map((banner, index) => (
                    <>
                      <SwiperSlide key={index}>
                        <Link to={`/`} className={clsx(style.wrapper)}>
                          <img
                            src={banner.pic}
                            className={clsx(style.content_img_banner)}
                            alt=""
                          />
                        </Link>
                      </SwiperSlide>
                    </>
                  ))
                ) : (
                  <SwiperSlide>
                    <Col xs={24} sm={24} style={{ marginBottom: "25px" }}>
                      <Empty description={<span>Không có sản phẩm nào</span>} />
                    </Col>
                  </SwiperSlide>
                )}
              </Swiper>
            </Col>
          </Row>
          {/* danh mục */}
          <Row className={clsx(style.category_wrapper)}>
            <Col xs={24} sm={24}>
              <Flex align="center" className={clsx(style.title_product_relate)}>
                <img
                  className={clsx(style.icon_header)}
                  style={{ height: "28px", width: "28px" }}
                  src="https://cdn.nhathuoclongchau.com.vn/unsafe/28x28/https://cms-prod.s3-sgn09.fptcloud.com/smalls/danh_muc_noi_bat_d03496597a.png"
                  alt=""
                />
                Danh mục nổi bật
              </Flex>
              <Row>
                <Col xs={0} sm={24}>
                  <Row gutter={[14, 14]}>
                    {categories && error.message === "" ? (
                      categories.map((category, index) => (
                        <React.Fragment key={index}>
                          <Col lg={4} style={{}}>
                            <Link
                              onClick={(e) => {
                                handleSearchMenu(category._id, "");
                              }}
                              to={`/timkiem?s=${category.name}`}
                              className={clsx(style.wrapper)}
                            >
                              <Flex
                                className={clsx(style.content_category)}
                                vertical
                              >
                                <Flex
                                  vertical
                                  justify="space-between"
                                  style={{ padding: "20px" }}
                                >
                                  <Flex
                                    className={clsx(
                                      style.header_text,
                                      style.header_text_category
                                    )}
                                    vertical
                                    justify="center"
                                    align="center"
                                  >
                                    <Space>{category.name}</Space>
                                    <div
                                      style={{
                                        color: "#657384",
                                        fontSize: "13px",
                                        marginTop: "5px",
                                      }}
                                    >
                                      {category.productCount} sản phẩm
                                    </div>
                                  </Flex>
                                </Flex>
                              </Flex>
                            </Link>
                          </Col>
                        </React.Fragment>
                      ))
                    ) : (
                      <Col xs={24} sm={24} style={{ marginBottom: "25px" }}>
                        <Empty
                          description={<span>Không có sản phẩm nào</span>}
                        />
                      </Col>
                    )}
                  </Row>
                </Col>
                <Col xs={24} sm={0}>
                  <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    loop={true}
                    breakpoints={{
                      0: {
                        spaceBetween: 10,
                        slidesPerView: 2,
                      },
                    }}
                    style={{ backgroundColor: "#fff" }}
                  >
                    {categories && error.message === "" ? (
                      categories.map((category, index) => (
                        <>
                          <SwiperSlide key={index}>
                            <Link
                              onClick={(e) => {
                                handleSearchMenu(category._id, "");
                              }}
                              to={`/timkiem?s=${category.name}`}
                              className={clsx(style.wrapper)}
                            >
                              <Flex
                                className={clsx(style.content_category)}
                                vertical
                              >
                                <Flex
                                  vertical
                                  justify="space-between"
                                  style={{ padding: "20px" }}
                                >
                                  <Flex
                                    className={clsx(
                                      style.header_text,
                                      style.header_text_category
                                    )}
                                    vertical
                                    justify="center"
                                    align="center"
                                  >
                                    <Space>{category.name}</Space>
                                    <div
                                      style={{
                                        color: "#657384",
                                        fontSize: "13px",
                                        marginTop: "5px",
                                      }}
                                    >
                                      {category.productCount} sản phẩm
                                    </div>
                                  </Flex>
                                </Flex>
                              </Flex>
                            </Link>
                          </SwiperSlide>
                        </>
                      ))
                    ) : (
                      <SwiperSlide>
                        <Col xs={24} sm={24} style={{ marginBottom: "25px" }}>
                          <Empty
                            description={<span>Không có sản phẩm nào</span>}
                          />
                        </Col>
                      </SwiperSlide>
                    )}
                  </Swiper>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>

      {/* top sale */}
      <div className={clsx(style.top_sale)}>
        <div
          style={{ paddingTop: "50px" }}
          className={clsx(style.wrapper_global, style.top_sale)}
        >
          {/* sản phẩm bán tốt nhất */}
          <Row>
            <Col xs={24} sm={24}>
              <Space className={clsx(style.topsale_banner)}>
                <Space className={clsx(style.topsale_banner_img)}>
                  <img
                    style={{ width: "320px", height: "41px" }}
                    src="https://cdn.nhathuoclongchau.com.vn/unsafe/640x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/san_pham_ban_chay_reponsive_282x36_3x_5b96131326.png"
                    alt=""
                  />
                  <Space className={clsx(style.topsale_banner_text)}>
                    Sản phẩm bán chạy
                  </Space>
                </Space>
              </Space>
              <Row gutter={{ xs: 7, sm: 14 }}>
                {products && error.message === "" ? (
                  products.map((product, index) => {
                    if (window.innerWidth > 576) {
                      if (index <= 11) {
                        return (
                          <Col key={index} xs={0} md={12} lg={4} style={{}}>
                            <Link
                              onClick={() =>
                                handleDetail(product._id, product.categoryId)
                              }
                              to={`/sanpham/${product.slug}`}
                              className={clsx(style.wrapper)}
                            >
                              <Flex className={clsx(style.content)} vertical>
                                <Space className={clsx(style.content_discount)}>
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
                                  <Label
                                    soldOut={!product.stock ? true : false}
                                    title={product.category.name}
                                  />
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
                                  style={{ padding: "50px 20px 20px 20px" }}
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
                                          <div>
                                            {numeral(product?.total).format(
                                              "0,0$"
                                            )}
                                            <span style={{ margin: "0 2px" }}>
                                              &#47;
                                            </span>
                                            {product.unit}
                                          </div>
                                        </Space>
                                      </>
                                    ) : (
                                      <>
                                        <Space>
                                          <div>
                                            {numeral(product?.price).format(
                                              "0,0$"
                                            )}
                                            <span style={{ margin: "0 2px" }}>
                                              &#47;
                                            </span>
                                            {product?.unit}
                                          </div>
                                        </Space>
                                      </>
                                    )}
                                  </Space>
                                  {product && product?.discount > 0 ? (
                                    <del className={clsx(style.header_price)}>
                                      {numeral(product.price).format("0,0$")}
                                    </del>
                                  ) : (
                                    <></>
                                  )}
                                  <Specifications
                                    title={product.specifications}
                                  />
                                </Flex>
                              </Flex>
                            </Link>
                          </Col>
                        );
                      }
                    } else {
                      if (index <= moreTopSale) {
                        return (
                          <>
                            <Col xs={12} md={0}>
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
                                  <Space
                                    className={clsx(
                                      style.label_wrapper,
                                      !product.stock && style.soldOut
                                    )}
                                  >
                                    <Label
                                      soldOut={!product.stock ? true : false}
                                      title={product.category.name}
                                    />
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
                                    style={{ padding: "50px 20px 20px 20px" }}
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
                                            <div>
                                              {numeral(product?.total).format(
                                                "0,0$"
                                              )}
                                              <span style={{ margin: "0 2px" }}>
                                                &#47;
                                              </span>
                                              {product.unit}
                                            </div>
                                          </Space>
                                        </>
                                      ) : (
                                        <>
                                          <Space>
                                            <div>
                                              {numeral(product?.price).format(
                                                "0,0$"
                                              )}
                                              <span style={{ margin: "0 2px" }}>
                                                &#47;
                                              </span>
                                              {product?.unit}
                                            </div>
                                          </Space>
                                        </>
                                      )}
                                    </Space>
                                    {product && product?.discount > 0 ? (
                                      <del className={clsx(style.header_price)}>
                                        {numeral(product.price).format("0,0$")}
                                      </del>
                                    ) : (
                                      <></>
                                    )}
                                  </Flex>
                                </Flex>
                              </Link>
                            </Col>

                            {index === 5 && moreTopSale === 5 ? (
                              <Col
                                onClick={() => setMoreTopSale(11)}
                                style={{
                                  textAlign: "center",
                                  fontSize: "14px",
                                  lineHeight: "20px",
                                  fontWeight: "600",
                                }}
                                span={24}
                              >
                                <Flex
                                  justify="center"
                                  style={{ marginTop: "10px" }}
                                  align="center"
                                >
                                  <PiCaretDoubleDownBold />
                                  <Space
                                    style={{
                                      marginLeft: "5px",
                                      fontSize: "14px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Xem thêm 6 sản phẩm
                                  </Space>
                                </Flex>
                              </Col>
                            ) : index === 11 && moreTopSale === 11 ? (
                              <Col onClick={() => setMoreTopSale(5)} span={24}>
                                <Flex
                                  style={{ marginTop: "10px" }}
                                  justify="center"
                                  align="center"
                                >
                                  <PiCaretDoubleUpBold />
                                  <Space
                                    style={{
                                      marginLeft: "5px",
                                      fontSize: "14px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Thu gọn
                                  </Space>
                                </Flex>
                              </Col>
                            ) : null}
                          </>
                        );
                      }
                    }
                  })
                ) : (
                  <Col xs={24} sm={24} style={{ marginBottom: "25px" }}>
                    <Empty description={<span>Không có sản phẩm nào</span>} />
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </div>
      </div>

      {/* thương hiệu */}
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(255,243,233,1) 0%, rgba(255,255,255,1) 34%)",
        }}
      >
        <div className={clsx(style.wrapper_global)}>
          <Row>
            <Col span={24}>
              <Flex align="center" className={clsx(style.title_product_relate)}>
                <img
                  className={clsx(style.icon_header)}
                  style={{ width: "28px", height: "28px" }}
                  src="https://cdn.nhathuoclongchau.com.vn/unsafe/64x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/smalls/thuong_hieu_yeu_thich_e0c23dded6.png"
                  alt=""
                />
                <Space>Thương hiệu yêu thích</Space>
              </Flex>

              <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={0}
                slidesPerView={5}
                style={{ backgroundColor: "transparent", marginBottom: "0px" }}
                breakpoints={{
                  1200: {
                    spaceBetween: 0,
                    slidesPerView: 5,
                    loop: brands.length > 5 ? true : false,
                  },
                  0: {
                    spaceBetween: 6,
                    slidesPerView: 2,
                    loop: true,
                  },
                }}
              >
                {brands.length > 5 ? (
                  <Flex
                    justify="space-between"
                    className={clsx(style.customSwiper_child)}
                  >
                    <ButtonNavigation />
                  </Flex>
                ) : (
                  <></>
                )}

                {brands ? (
                  brands.map((brand, index) => (
                    <>
                      <SwiperSlide key={index}>
                        <Link
                          onClick={(e) => {
                            handleSearchMenu(brand.categoryId, brand._id);
                          }}
                          to={`/timkiem?s=${brand.name}`}
                          className={clsx(style.wrapper)}
                        >
                          <Flex className={clsx(style.content_brand)} vertical>
                            <Flex justify="center">
                              <img
                                src={brand.pic}
                                className={clsx(style.content_img_brand)}
                                alt=""
                              />
                            </Flex>
                            <Flex
                              vertical
                              justify="space-between"
                              style={{ padding: "20px 20px 0px 20px" }}
                            >
                              <Space className={clsx(style.header_text_brand)}>
                                {brand.name}
                              </Space>
                            </Flex>
                          </Flex>
                        </Link>
                      </SwiperSlide>
                    </>
                  ))
                ) : (
                  <SwiperSlide>
                    <Col xs={24} sm={24} style={{ marginBottom: "25px" }}>
                      <Empty description={<span>Không có sản phẩm nào</span>} />
                    </Col>
                  </SwiperSlide>
                )}
              </Swiper>
            </Col>
          </Row>
        </div>
      </div>

      {/* age and tag */}
      <div
        style={{
          background:
            "linear-gradient(0deg, rgba(184,208,255,1) 3%, rgba(236,243,255,1) 71%, rgba(255,255,255,1) 90%)",
        }}
      >
        <div className={clsx(style.wrapper_global)}>
          {/* theo độ tuổi */}
          <Row>
            <Col span={24}>
              <Flex align="center" className={clsx(style.title_product_relate)}>
                <img
                  className={clsx(style.icon_header)}
                  src="https://cdn.nhathuoclongchau.com.vn/unsafe/28x28/https://cms-prod.s3-sgn09.fptcloud.com/smalls/san_pham_theo_doi_tuong_d7e7ffa80f.png"
                  alt=""
                />
                Sản phẩm theo độ tuổi
              </Flex>
            </Col>
            <Col span={24}>
              <div
                className={clsx(
                  style.filter_select_wrapper_recommend,
                  style.filter_select__age_wrapper
                )}
              >
                <div className={clsx(style.filter_select_tag_item)}>
                  <Button
                    style={{
                      borderColor: searchAge === 1 ? " #1250dc" : "#a9b2be",
                      color: searchAge === 1 ? "#1250dc" : "#4a4f63",
                    }}
                    onClick={() => setSearchAge(1)}
                    className={clsx(style.filter_select_tag)}
                  >
                    Sơ sinh - 1 tuổi
                    <Space
                      className={clsx(
                        searchAge === 1
                          ? style.filter_label_tag
                          : { display: "none" }
                      )}
                    >
                      <div style={{ display: "none" }}>1</div>
                    </Space>
                  </Button>
                </div>
                <div className={clsx(style.filter_select_tag_item)}>
                  <Button
                    style={{
                      borderColor: searchAge === 2 ? " #1250dc" : "#a9b2be",
                      color: searchAge === 2 ? "#1250dc" : "#4a4f63",
                    }}
                    onClick={() => setSearchAge(2)}
                    className={clsx(style.filter_select_tag)}
                  >
                    1 tuổi - 2 tuổi
                    <Space
                      className={clsx(
                        searchAge === 2
                          ? style.filter_label_tag
                          : { display: "none" }
                      )}
                    >
                      <div style={{ display: "none" }}>1</div>
                    </Space>
                  </Button>
                </div>
                <div className={clsx(style.filter_select_tag_item)}>
                  <Button
                    style={{
                      borderColor: searchAge === 3 ? " #1250dc" : "#a9b2be",
                      color: searchAge === 3 ? "#1250dc" : "#4a4f63",
                    }}
                    onClick={() => setSearchAge(3)}
                    className={clsx(style.filter_select_tag)}
                  >
                    2 tuổi - 5 tuổi
                    <Space
                      className={clsx(
                        searchAge === 3
                          ? style.filter_label_tag
                          : { display: "none" }
                      )}
                    >
                      <div style={{ display: "none" }}>1</div>
                    </Space>
                  </Button>
                </div>
                <div className={clsx(style.filter_select_tag_item)}>
                  <Button
                    style={{
                      borderColor: searchAge === 4 ? " #1250dc" : "#a9b2be",
                      color: searchAge === 4 ? "#1250dc" : "#4a4f63",
                    }}
                    onClick={() => setSearchAge(4)}
                    className={clsx(style.filter_select_tag)}
                  >
                    Trên 5 tuổi
                    <Space
                      className={clsx(
                        searchAge === 4
                          ? style.filter_label_tag
                          : { display: "none" }
                      )}
                    >
                      <div style={{ display: "none" }}>1</div>
                    </Space>
                  </Button>
                </div>
              </div>
            </Col>

            <Col span={24}>
              <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                loop={true}
                breakpoints={{
                  1200: {
                    spaceBetween: 14,
                    slidesPerView: 6,
                    loop: true,
                  },
                  0: {
                    spaceBetween: 12,
                    slidesPerView: 2,
                    loop: true,
                  },
                }}
                style={{
                  padding: "10px 0px",
                  borderRadius: "10px",
                  marginBottom: "30px",
                }}
              >
                <Flex
                  justify="space-between"
                  className={clsx(style.customSwiper_child)}
                >
                  <ButtonNavigation />
                </Flex>

                {products ? (
                  products.map((product) => {
                    if (
                      (searchAge === 1 &&
                        product.age >= 0 &&
                        product.age <= 1) ||
                      (searchAge === 2 &&
                        product.age <= 2 &&
                        product.age >= 1) ||
                      (searchAge === 3 &&
                        product.age <= 5 &&
                        product.age >= 2) ||
                      (searchAge === 4 && product.age >= 5)
                    ) {
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
                              <Flex
                                style={{ border: "1px solid rgb(232 234 237)" }}
                                className={clsx(style.content)}
                                vertical
                              >
                                <Space className={clsx(style.content_discount)}>
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
                                  <Label
                                    soldOut={!product.stock ? true : false}
                                    title={product.category.name}
                                  />
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
                                  style={{ padding: "50px 20px 20px 20px" }}
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
                                          <div>
                                            {numeral(product?.total).format(
                                              "0,0$"
                                            )}
                                            <span style={{ margin: "0 2px" }}>
                                              &#47;
                                            </span>
                                            {product.unit}
                                          </div>
                                        </Space>
                                      </>
                                    ) : (
                                      <>
                                        <Space>
                                          <div>
                                            {numeral(product?.price).format(
                                              "0,0$"
                                            )}
                                            <span style={{ margin: "0 2px" }}>
                                              &#47;
                                            </span>
                                            {product?.unit}
                                          </div>
                                        </Space>
                                      </>
                                    )}
                                  </Space>
                                  {product && product?.discount > 0 ? (
                                    <del className={clsx(style.header_price)}>
                                      {numeral(product.price).format("0,0$")}
                                    </del>
                                  ) : (
                                    <></>
                                  )}
                                  <Specifications
                                    title={product.specifications}
                                  />
                                </Flex>
                              </Flex>
                            </Link>
                          </SwiperSlide>
                        </>
                      );
                    }
                  })
                ) : (
                  <SwiperSlide>
                    <Col xs={24} sm={24} style={{ marginBottom: "25px" }}>
                      <Empty description={<span>Không có sản phẩm nào</span>} />
                    </Col>
                  </SwiperSlide>
                )}
              </Swiper>
            </Col>
          </Row>

          {/* gợi ý hôm nay */}
          <Row>
            <Col span={24}>
              <Flex align="center" className={clsx(style.title_product_relate)}>
                <img
                  className={clsx(style.icon_header)}
                  style={{ height: "28px", width: "28px" }}
                  src="https://cdn.nhathuoclongchau.com.vn/unsafe/28x28/https://cms-prod.s3-sgn09.fptcloud.com/smalls/icon_goi_y_hom_nay_c96e303244.png"
                  alt=""
                />
                Gợi ý hôm nay
              </Flex>
            </Col>
            <Col span={24}>
              <div
                className={clsx(
                  style.filter_select_wrapper_recommend,
                  style.filter_select__tag_wrapper
                )}
              >
                {tags &&
                  tags.map((tag, index) => (
                    <div
                      key={index}
                      className={clsx(style.filter_select_tag_item)}
                    >
                      <Button
                        style={{
                          borderColor:
                            searchTag === tag._id ? " #1250dc" : "#a9b2be",
                          color: searchTag === tag._id ? "#1250dc" : "#4a4f63",
                        }}
                        onClick={() => setSearchTag(tag._id)}
                        className={clsx(style.filter_select_tag)}
                      >
                        {tag.name}
                        <Space
                          className={clsx(
                            searchTag === tag._id
                              ? style.filter_label_tag
                              : { display: "none" }
                          )}
                        >
                          <div style={{ display: "none" }}>1</div>
                        </Space>
                      </Button>
                    </div>
                  ))}
              </div>
            </Col>
            <Col xs={24} sm={24}>
              <Row gutter={{ xs: 7, sm: 14 }}>
                {products && error.message === "" ? (
                  products.map((product, index) => {
                    if (window.innerWidth > 576) {
                      if (
                        count < 12 &&
                        product.tagList &&
                        product.tagList.includes(searchTag)
                      ) {
                        count++;
                        return (
                          <Col key={index} xs={0} md={12} lg={4} style={{}}>
                            <Link
                              onClick={() =>
                                handleDetail(product._id, product.categoryId)
                              }
                              to={`/sanpham/${product.slug}`}
                              className={clsx(style.wrapper)}
                            >
                              <Flex className={clsx(style.content)} vertical>
                                <Space className={clsx(style.content_discount)}>
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
                                  <Label
                                    soldOut={!product.stock ? true : false}
                                    title={product.category.name}
                                  />
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
                                  style={{ padding: "50px 20px 20px 20px" }}
                                >
                                  <Space className={clsx(style.header_text)}>
                                    {product.name}
                                  </Space>
                                  <Space
                                    className={clsx(style.header_discount)}
                                  >
                                    {numeral(
                                      (product.price *
                                        (100 - product.discount)) /
                                        100
                                    ).format("0,0$")}
                                  </Space>
                                  {product && product?.discount > 0 ? (
                                    <del className={clsx(style.header_price)}>
                                      {numeral(product.price).format("0,0$")}
                                    </del>
                                  ) : (
                                    <></>
                                  )}
                                  <Specifications
                                    title={product.specifications}
                                  />
                                </Flex>
                              </Flex>
                            </Link>
                          </Col>
                        );
                      }
                    } else {
                      if (
                        count < 6 &&
                        product.tagList &&
                        product.tagList.includes(searchTag)
                      ) {
                        count++;
                        return (
                          <Col xs={12} md={0}>
                            <Link
                              onClick={() =>
                                handleDetail(product._id, product.categoryId)
                              }
                              to={`/sanpham/${product.slug}`}
                              className={clsx(style.wrapper)}
                            >
                              <Flex className={clsx(style.content)} vertical>
                                <Space className={clsx(style.content_discount)}>
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
                                  <Label
                                    soldOut={!product.stock ? true : false}
                                    title={product.category.name}
                                  />
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
                                  style={{ padding: "50px 20px 20px 20px" }}
                                >
                                  <Space className={clsx(style.header_text)}>
                                    {product.name}
                                  </Space>
                                  <Space
                                    className={clsx(style.header_discount)}
                                  >
                                    {numeral(
                                      (product.price *
                                        (100 - product.discount)) /
                                        100
                                    ).format("0,0$")}
                                  </Space>
                                  {product && product?.discount > 0 ? (
                                    <del className={clsx(style.header_price)}>
                                      {numeral(product.price).format("0,0$")}
                                    </del>
                                  ) : (
                                    <></>
                                  )}
                                  <Specifications
                                    title={product.specifications}
                                  />
                                </Flex>
                              </Flex>
                            </Link>
                          </Col>
                        );
                      }
                    }
                  })
                ) : (
                  <Col xs={24} sm={24} style={{ marginBottom: "25px" }}>
                    <Empty description={<span>Không có sản phẩm nào</span>} />
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </div>
      </div>

      {/* sản phẩm vừa xem  */}
      {histories ? (
        <div
          style={{
            background: "#eaeffa",
          }}
        >
          <div className={clsx(style.wrapper_global)}>
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
                  {histories.length > 6 ? (
                    <Flex
                      justify="space-between"
                      className={clsx(style.customSwiper_child)}
                    >
                      <ButtonNavigation />
                    </Flex>
                  ) : (
                    <></>
                  )}

                  {products ? (
                    products.map((product, index) => {
                      if (histories.includes(product._id)) {
                        return (
                          <>
                            <SwiperSlide key={index}>
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
                                  <Space
                                    className={clsx(
                                      style.label_wrapper,
                                      !product.stock && style.soldOut
                                    )}
                                  >
                                    <Label
                                      soldOut={!product.stock ? true : false}
                                      title={product.category.name}
                                    />
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
                                    style={{ padding: " 50px 20px 20px 20px" }}
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
                                            <div>
                                              {numeral(product?.total).format(
                                                "0,0$"
                                              )}
                                              <span style={{ margin: "0 2px" }}>
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
                                              {numeral(product?.price).format(
                                                "0,0$"
                                              )}
                                              <span style={{ margin: "0 2px" }}>
                                                &#47;
                                              </span>
                                              {product?.unit}
                                            </div>
                                          </Space>
                                        </>
                                      )}
                                    </Space>
                                    {product && product?.discount > 0 ? (
                                      <del className={clsx(style.header_price)}>
                                        {numeral(product.price).format("0,0$")}
                                      </del>
                                    ) : (
                                      <></>
                                    )}
                                  </Flex>
                                </Flex>
                              </Link>
                            </SwiperSlide>
                          </>
                        );
                      }
                    })
                  ) : (
                    <SwiperSlide>
                      <Col xs={24} sm={24} style={{ marginBottom: "25px" }}>
                        <Empty
                          description={<span>Không có sản phẩm nào</span>}
                        />
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

      <Row>
        <Col xs={24} sm={0}>
          <MenuFooter />
        </Col>
      </Row>
    </>
  );
}

export default ProductScreen;
