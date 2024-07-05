/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Flex, Row, Space, Empty, message, ConfigProvider } from "antd";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getAllProduct,
  getAllProductSearch,
  getProductById,
  ProductsType,
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
import { PiCaretDoubleDownBold, PiCaretDoubleUpBold } from "react-icons/pi";
import Specifications from "../../../components/specifications";
import PolicyFooter from "../../../components/policyFooter";
import FakeNumber from "../../../components/fakeNumber";
import { addToCart } from "../../../slices/cartSlice";
import BuyMobile from "../../../components/buyMobile";
// import { LazyLoadImage } from "react-lazy-load-image-component";

function ProductScreen() {
  const { products, error, product } = useAppSelector(
    (state) => state.products
  );
  const { categories } = useAppSelector((state) => state.categories);
  const { suppliers } = useAppSelector((state) => state.suppliers);
  const { brands } = useAppSelector((state) => state.brands);
  const { tags } = useAppSelector((state) => state.tags);
  const { banners } = useAppSelector((state) => state.banners);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [searchAge, setSearchAge] = useState<Number>(1);
  const [moreTopSale, setMoreTopSale] = useState<number>(5);
  const [searchTag, setSearchTag] = useState<string>(
    "65d8b631214ed285ba4bc016"
  );
  const [searchBimTa, setSearchBimTa] = useState<string>(
    "663edce82873fdc0f099a6c0"
  );
  const [searchSuaBot, setSeachSuaBot] = useState<string>(
    "65df3f646fc28fc99f7b4dad"
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeBuyMobile, setActiveBuyMobile] = useState<boolean>(false);
  //fix lỗi mua ngay trên sản phẩm khác, không phải dispatch search làm cho trang bị reload
  const [specificProduct, setSpecificProduct] = useState<ProductsType>();

  // lưu vào lịch sử
  const histories = localStorage.getItem("histories")
    ? JSON.parse(localStorage.getItem("histories")!)
    : [];

  useEffect(() => {
    // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

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

  const handleAddToCart = (e: any) => {
    // ngăn chặn mặc định của thẻ Link
    e.preventDefault();
    //  tránh hiện tượng load trang(ko dispatch search product)
    e.stopPropagation();

    // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    messageApi.open({
      type: "success",
      content: "Thêm vào giỏ hàng thành công",
    });
    dispatch(
      addToCart({
        id: product?._id,
        name: product?.name,
        quantity: 1,
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
    console.log("««««« product »»»»»", product);
    console.log("««««« e »»»»»", e);

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
  let count = 0;

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Message: {
              zIndexPopup: 9999999999,
            },
          },
        }}
      >
        {contextHolder}
        <>
          {/* banner */}
          <div
            style={{
              borderRadius: "0px",
              background: "#f8f9fd",
              // background: rgb(255,210,96);
              // background: linear-gradient(126deg, rgba(255,210,96,1) 0%, rgba(246,156,231,1) 60%, rgba(245,246,253,1) 100%);
            }}
          >
            <div
              className={clsx(
                style.wrapper_global,
                style.wrapper_global_banner,
                style.customPT20
              )}
            >
              <Row className={clsx(style.total_banner_wrapper)}>
                <Col xs={24} sm={16}>
                  <Swiper
                    loop={banners.length > 1 ? true : false}
                    // autoplay={{
                    //   delay: 2000,
                    // }}
                    modules={[
                      Navigation,
                      Pagination,
                      Scrollbar,
                      A11y,
                      Autoplay,
                    ]}
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
                    style={{ fontSize: 0 }}
                    pagination={{ clickable: true }}
                    className={clsx(style.background_banner)}
                  >
                    <Flex
                      justify="space-between"
                      className={clsx(style.customSwiper_child)}
                    >
                      <ButtonNavigation />
                    </Flex>

                    {banners &&
                      banners.map((banner, index) => {
                        if (!banner.subBanner)
                          return (
                            <>
                              <SwiperSlide key={index}>
                                <Link
                                  to={banner.link}
                                  className={clsx(style.wrapper)}
                                >
                                  <img
                                    src={banner.pic}
                                    className={clsx(style.content_img_banner)}
                                    alt=""
                                  />
                                </Link>
                              </SwiperSlide>
                            </>
                          );
                      })}
                  </Swiper>
                </Col>
                {/* sub Banner */}
                <Col xs={0} sm={8}>
                  {/* style={{fontSize: 0}} để cho ảnh bằng với chiều dài của thẻ */}
                  <div
                    style={{ fontSize: 0 }}
                    className={clsx(
                      style.wrapper_subBanner,
                      style.wrapper_subBanner_header
                    )}
                  >
                    {banners &&
                      banners.map((banner, index) => {
                        if (banner.subBanner) {
                          return (
                            <Link to={banner.link}>
                              <img
                                src={banner.pic}
                                className={clsx(style.content_img_subBanner)}
                                alt=""
                              />
                            </Link>
                          );
                        }
                      })}
                  </div>
                </Col>
              </Row>

              {/* danh mục */}
              <Row className={clsx(style.category_wrapper)}>
                <Col xs={24} sm={24}>
                  <Flex
                    align="center"
                    className={clsx(style.title_product_category_top)}
                  >
                    <img
                      className={clsx(style.icon_header)}
                      style={{ height: "28px", width: "28px" }}
                      src="https://cdn.nhathuoclongchau.com.vn/unsafe/28x28/https://cms-prod.s3-sgn09.fptcloud.com/smalls/danh_muc_noi_bat_d03496597a.png"
                      alt=""
                    />
                    Danh mục nổi bật
                  </Flex>
                  <Row>
                    <Col xs={24} sm={24}>
                      <Row gutter={[14, 14]}>
                        {categories && error.message === "" ? (
                          categories.map((category, index) => (
                            <React.Fragment key={index}>
                              <Col xs={6} lg={4}>
                                <Link
                                  onClick={(e) => {
                                    handleSearchMenu(category._id, "");
                                  }}
                                  to={`/timkiem?c=${category.name}`}
                                  className={clsx(style.wrapper)}
                                >
                                  <Flex
                                    className={clsx(style.content_category)}
                                    vertical
                                  >
                                    <Flex
                                      vertical
                                      justify="space-between"
                                      // style={{ padding: "20px" }}
                                    >
                                      <Flex
                                        className={clsx(
                                          style.header_text_category
                                        )}
                                        vertical
                                        justify="center"
                                        align="center"
                                      >
                                        {category.pic && (
                                          <img
                                            style={{
                                              height: "60px",
                                              width: "60px",
                                              marginBottom: "6px",
                                            }}
                                            src={category.pic}
                                          ></img>
                                        )}
                                        <Space style={{ textAlign: "center" }}>
                                          {category.name}
                                        </Space>
                                        {/* <div
                                      style={{
                                        color: "#657384",
                                        fontSize: "13px",
                                        marginTop: "5px",
                                      }}
                                    >
                                      {category.productCount} sản phẩm
                                    </div> */}
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
                    {/* <Col xs={24} sm={0}>
                  <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    loop={true}
                    breakpoints={{
                      0: {
                        spaceBetween: 10,
                        slidesPerView: 2,
                      },
                    }}
                  >
                    {categories && error.message === "" ? (
                      categories.map((category, index) => (
                        <>
                          <SwiperSlide key={index}>
                            <Link
                              onClick={(e) => {
                                handleSearchMenu(category._id, "");
                              }}
                              to={`/timkiem?c=${category.name}`}
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
                                    {category.pic && (
                                      <img
                                        style={{
                                          height: "24px",
                                          width: "24px",
                                        }}
                                        src={category.pic}
                                      ></img>
                                    )}
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
                </Col> */}
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
                        style={{ width: "325px", height: "41px" }}
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
                                    handleDetail(
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
                                      {/* <Label
                                        soldOut={!product.stock ? true : false}
                                        title={product.category.name}
                                      /> */}
                                    </Space>

                                    <Flex
                                      className={clsx(
                                        style.product_name_wrapper
                                      )}
                                      justify="center"
                                    >
                                      <img
                                        src={product.pic}
                                        className={clsx(style.content_img)}
                                        alt=""
                                        loading="lazy"
                                      />
                                      <Space
                                        className={clsx(
                                          style.product_name_fakeNumber
                                        )}
                                      >
                                        <FakeNumber
                                          fakeNumber={product.fakeNumber}
                                          realNumber={product.sold}
                                        />
                                      </Space>
                                    </Flex>

                                    <Flex
                                      vertical
                                      justify="space-between"
                                      style={{ padding: "20px 20px 10px 20px" }}
                                    >
                                      <Space
                                        className={clsx(style.header_text)}
                                      >
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
                                                <span
                                                  style={{ margin: "0 2px" }}
                                                >
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
                                                <span
                                                  style={{ margin: "0 2px" }}
                                                >
                                                  &#47;
                                                </span>
                                                {product?.unit}
                                              </div>
                                            </Space>
                                          </>
                                        )}
                                      </Space>
                                      {product && product?.discount > 0 && (
                                        <del
                                          className={clsx(style.header_price)}
                                        >
                                          {numeral(product.price).format(
                                            "0,0$"
                                          )}
                                        </del>
                                      )}
                                      <Specifications
                                        title={product.specifications}
                                      />

                                      {/* buy  top sale*/}
                                      <Flex justify="space-between">
                                        <Space
                                          onClick={(e) =>
                                            handleAddToCartTest(e, product)
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
                                      handleDetail(
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
                                          className={clsx(style.content_img)}
                                          alt=""
                                        />
                                        <Space
                                          className={clsx(
                                            style.product_name_fakeNumber
                                          )}
                                        >
                                          <FakeNumber
                                            fakeNumber={product.fakeNumber}
                                            realNumber={product.sold}
                                          />
                                        </Space>
                                      </Flex>

                                      <Flex
                                        vertical
                                        justify="space-between"
                                        style={{
                                          padding: "20px 20px 10px 20px",
                                        }}
                                      >
                                        <Space
                                          className={clsx(style.header_text)}
                                        >
                                          {product.name}
                                        </Space>

                                        <Space
                                          className={clsx(
                                            style.header_discount
                                          )}
                                        >
                                          {product && product?.discount > 0 ? (
                                            <>
                                              <Space>
                                                <div>
                                                  {numeral(
                                                    product?.total
                                                  ).format("0,0$")}
                                                  <span
                                                    style={{ margin: "0 2px" }}
                                                  >
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
                                                  {numeral(
                                                    product?.price
                                                  ).format("0,0$")}
                                                  <span
                                                    style={{ margin: "0 2px" }}
                                                  >
                                                    &#47;
                                                  </span>
                                                  {product?.unit}
                                                </div>
                                              </Space>
                                            </>
                                          )}
                                        </Space>
                                        {product && product?.discount > 0 && (
                                          <del
                                            className={clsx(style.header_price)}
                                          >
                                            {numeral(product.price).format(
                                              "0,0$"
                                            )}
                                          </del>
                                        )}
                                        <Specifications
                                          title={product.specifications}
                                        />
                                        {/* buy */}
                                        <Flex justify="space-between">
                                          <Space
                                            onClick={(e) =>
                                              handleAddToCartTest(e, product)
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
                                  <Col
                                    onClick={() => setMoreTopSale(5)}
                                    span={24}
                                  >
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
                        <Empty
                          description={<span>Không có sản phẩm nào</span>}
                        />
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
                "linear-gradient(0deg, rgba(236,243,255,1) 12%, rgba(255,243,233,1) 100%)",
            }}
          >
            <div
              className={clsx(
                style.wrapper_brand_favorite,
                style.wrapper_global
              )}
            >
              <Row>
                <Col span={24}>
                  <Flex
                    align="center"
                    className={clsx(style.title_product_brand_favorite)}
                  >
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
                    style={{
                      backgroundColor: "transparent",
                      marginBottom: "0px",
                    }}
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
                    {brands.length > 5 && (
                      <Flex
                        justify="space-between"
                        className={clsx(style.customSwiper_child)}
                        style={{ top: "37%" }}
                      >
                        <ButtonNavigation />
                      </Flex>
                    )}

                    {brands ? (
                      brands.map((brand, index) => (
                        <>
                          <SwiperSlide key={index}>
                            <Link
                              onClick={(e) => {
                                handleSearchMenu(brand.categoryId, brand._id);
                              }}
                              to={`/timkiem?b=${brand.name}`}
                              className={clsx(style.wrapper)}
                            >
                              <Flex
                                className={clsx(style.content_brand)}
                                vertical
                              >
                                <Flex justify="center">
                                  <img
                                    src={brand.pic}
                                    className={clsx(style.content_img_brand)}
                                    alt=""
                                  />
                                </Flex>
                                {/* <Flex
                                  vertical
                                  justify="space-between"
                                  style={{ padding: "20px 20px 0px 20px" }}
                                >
                                  <Space
                                    className={clsx(style.header_text_brand)}
                                  >
                                    {brand.name}
                                  </Space>
                                </Flex> */}
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
            </div>

            {window.innerWidth > 576 ? (
              <div
                style={{ fontSize: 0 }}
                className={clsx(
                  style.wrapper_global,
                  style.wrapper_subBanner_line,
                  style.wrapper_subBanner
                )}
              >
                {banners &&
                  banners.map((banner, index) => {
                    if (banner.subBanner) {
                      return (
                        <Link style={{ display: "inline" }} to={banner.link}>
                          <img
                            key={index}
                            src={banner.pic}
                            alt=""
                            className={clsx(style.content_img_subBanner_line)}
                          />
                        </Link>
                      );
                    }
                  })}
              </div>
            ) : (
              <div
                style={{ fontSize: 0 }}
                className={clsx(style.wrapper_subBanner_line)}
              >
                <Swiper
                  modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                  loop={true}
                  // autoplay={{
                  //   delay: 4000,
                  // }}
                  spaceBetween={0}
                  slidesPerView={1}
                >
                  {banners &&
                    banners.map((banner, index) => {
                      if (banner.subBanner) {
                        return (
                          <Link to={banner.link}>
                            <SwiperSlide>
                              <img
                                key={index}
                                src={banner.pic}
                                className={clsx(
                                  style.content_img_subBanner_line
                                )}
                                alt=""
                              />
                            </SwiperSlide>
                          </Link>
                        );
                      }
                    })}
                </Swiper>
              </div>
            )}
          </div>

          {/* age and tag */}
          <div
            style={{
              background:
                "linear-gradient(0deg, rgba(184,208,255,1) 38%, rgba(236,243,255,1) 100%)",
            }}
          >
            <div
              style={{ paddingBottom: "12px" }}
              className={clsx(style.wrapper_global)}
            >
              {/* Bỉm tã */}
              <Row>
                <Col span={24}>
                  <Flex
                    align="center"
                    className={clsx(style.title_product_relate)}
                  >
                    <img
                      className={clsx(style.icon_header)}
                      src="https://cdn1.concung.com/img/res/menu-mobile/14-14-2bimta-1666343914-1682043548.png"
                      alt=""
                    />
                    Bỉm tã
                  </Flex>
                </Col>
                <Col span={24}>
                  <div
                    className={clsx(
                      style.filter_select_wrapper_recommend,
                      style.filter_select__tag_wrapper
                    )}
                  >
                    {brands &&
                      brands.map((brand, index) => {
                        // 65c1a957dcdd1e4eceaa3cf3
                        if (brand.categoryId === "66820fbc02a225bad3e709df") {
                          return (
                            <div
                              key={index}
                              className={clsx(style.filter_select_tag_item)}
                            >
                              <Button
                                style={{
                                  borderColor:
                                    searchBimTa === brand._id
                                      ? " #1250dc"
                                      : "#a9b2be",
                                  color:
                                    searchBimTa === brand._id
                                      ? "#1250dc"
                                      : "#4a4f63",
                                }}
                                onClick={() => setSearchBimTa(brand._id)}
                                className={clsx(style.filter_select_tag)}
                              >
                                {brand.name}
                                <Space
                                  className={clsx(
                                    searchBimTa === brand._id
                                      ? style.filter_label_tag
                                      : { display: "none" }
                                  )}
                                >
                                  <div style={{ display: "none" }}>1</div>
                                </Space>
                              </Button>
                            </div>
                          );
                        }
                      })}
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
                      borderRadius: "12",
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
                        if (product.brandId === searchBimTa) {
                          return (
                            <>
                              <SwiperSlide>
                                <Link
                                  onClick={() =>
                                    handleDetail(
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
                                      {/* <Label
                                        soldOut={!product.stock ? true : false}
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
                                        className={clsx(style.content_img)}
                                        alt=""
                                      />
                                      <Space
                                        className={clsx(
                                          style.product_name_fakeNumber
                                        )}
                                      >
                                        <FakeNumber
                                          fakeNumber={product.fakeNumber}
                                          realNumber={product.sold}
                                        />
                                      </Space>
                                    </Flex>
                                    <Flex
                                      vertical
                                      justify="space-between"
                                      style={{ padding: "20px 20px 10px 20px" }}
                                    >
                                      <Space
                                        className={clsx(style.header_text)}
                                      >
                                        {product.name}
                                      </Space>

                                      {/* <FakeNumber
                                        fakeNumber={product.fakeNumber}
                                        realNumber={product.sold}
                                      /> */}
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
                                                <span
                                                  style={{ margin: "0 2px" }}
                                                >
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
                                                <span
                                                  style={{ margin: "0 2px" }}
                                                >
                                                  &#47;
                                                </span>
                                                {product?.unit}
                                              </div>
                                            </Space>
                                          </>
                                        )}
                                      </Space>
                                      {product && product?.discount > 0 && (
                                        <del
                                          className={clsx(style.header_price)}
                                        >
                                          {numeral(product.price).format(
                                            "0,0$"
                                          )}
                                        </del>
                                      )}
                                      <Specifications
                                        title={product.specifications}
                                      />
                                      {/* buy */}
                                      <Flex justify="space-between">
                                        <Space
                                          onClick={(e) =>
                                            handleAddToCartTest(e, product)
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

              {/* Sữa bột */}
              <Row>
                <Col span={24}>
                  <Flex
                    align="center"
                    className={clsx(style.title_product_relate)}
                  >
                    <img
                      className={clsx(style.icon_header)}
                      src="https://cdn1.concung.com/img/res/menu-mobile/10-sua-bot-1682043498.png"
                      alt=""
                    />
                    Sữa bột
                  </Flex>
                </Col>
                <Col span={24}>
                  <div
                    className={clsx(
                      style.filter_select_wrapper_recommend,
                      style.filter_select__tag_wrapper
                    )}
                  >
                    {brands &&
                      brands.map((brand, index) => {
                        if (brand.categoryId === "65c1b7ec667c58db30291bee") {
                          return (
                            <div
                              key={index}
                              className={clsx(style.filter_select_tag_item)}
                            >
                              <Button
                                style={{
                                  borderColor:
                                    searchSuaBot === brand._id
                                      ? " #1250dc"
                                      : "#a9b2be",
                                  color:
                                    searchSuaBot === brand._id
                                      ? "#1250dc"
                                      : "#4a4f63",
                                }}
                                onClick={() => setSeachSuaBot(brand._id)}
                                className={clsx(style.filter_select_tag)}
                              >
                                {brand.name}
                                <Space
                                  className={clsx(
                                    searchSuaBot === brand._id
                                      ? style.filter_label_tag
                                      : { display: "none" }
                                  )}
                                >
                                  <div style={{ display: "none" }}>1</div>
                                </Space>
                              </Button>
                            </div>
                          );
                        }
                      })}
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
                      borderRadius: "12px",
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
                        if (product.brandId === searchSuaBot) {
                          return (
                            <>
                              <SwiperSlide>
                                <Link
                                  onClick={() =>
                                    handleDetail(
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
                                      {/* <Label
                                        soldOut={!product.stock ? true : false}
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
                                        className={clsx(style.content_img)}
                                        alt=""
                                      />
                                      <Space
                                        className={clsx(
                                          style.product_name_fakeNumber
                                        )}
                                      >
                                        <FakeNumber
                                          fakeNumber={product.fakeNumber}
                                          realNumber={product.sold}
                                        />
                                      </Space>
                                    </Flex>
                                    <Flex
                                      vertical
                                      justify="space-between"
                                      style={{ padding: "20px 20px 10px 20px" }}
                                    >
                                      <Space
                                        className={clsx(style.header_text)}
                                      >
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
                                                <span
                                                  style={{ margin: "0 2px" }}
                                                >
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
                                                <span
                                                  style={{ margin: "0 2px" }}
                                                >
                                                  &#47;
                                                </span>
                                                {product?.unit}
                                              </div>
                                            </Space>
                                          </>
                                        )}
                                      </Space>
                                      {product && product?.discount > 0 && (
                                        <del
                                          className={clsx(style.header_price)}
                                        >
                                          {numeral(product.price).format(
                                            "0,0$"
                                          )}
                                        </del>
                                      )}
                                      <Specifications
                                        title={product.specifications}
                                      />
                                      {/* buy */}
                                      <Flex justify="space-between">
                                        <Space
                                          onClick={(e) =>
                                            handleAddToCartTest(e, product)
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

              {/* theo độ tuổi */}
              <Row>
                <Col span={24}>
                  <Flex
                    align="center"
                    className={clsx(style.title_product_relate)}
                  >
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
                      borderRadius: "12px",
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
                                    handleDetail(
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
                                      {/* <Label
                                        soldOut={!product.stock ? true : false}
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
                                        className={clsx(style.content_img)}
                                        alt=""
                                      />
                                      <Space
                                        className={clsx(
                                          style.product_name_fakeNumber
                                        )}
                                      >
                                        <FakeNumber
                                          fakeNumber={product.fakeNumber}
                                          realNumber={product.sold}
                                        />
                                      </Space>
                                    </Flex>

                                    <Flex
                                      vertical
                                      justify="space-between"
                                      style={{ padding: "20px 20px 10px 20px" }}
                                    >
                                      <Space
                                        className={clsx(style.header_text)}
                                      >
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
                                                <span
                                                  style={{ margin: "0 2px" }}
                                                >
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
                                                <span
                                                  style={{ margin: "0 2px" }}
                                                >
                                                  &#47;
                                                </span>
                                                {product?.unit}
                                              </div>
                                            </Space>
                                          </>
                                        )}
                                      </Space>
                                      {product && product?.discount > 0 && (
                                        <del
                                          className={clsx(style.header_price)}
                                        >
                                          {numeral(product.price).format(
                                            "0,0$"
                                          )}
                                        </del>
                                      )}
                                      <Specifications
                                        title={product.specifications}
                                      />
                                      {/* buy */}
                                      <Flex justify="space-between">
                                        <Space
                                          onClick={(e) =>
                                            handleAddToCartTest(e, product)
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

              {/* gợi ý hôm nay */}
              <Row>
                <Col span={24}>
                  <Flex
                    align="center"
                    className={clsx(style.title_product_relate)}
                  >
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
                              color:
                                searchTag === tag._id ? "#1250dc" : "#4a4f63",
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
                                    handleDetail(
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
                                      {/* <Label
                                        soldOut={!product.stock ? true : false}
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
                                        className={clsx(style.content_img)}
                                        alt=""
                                      />
                                      <Space
                                        className={clsx(
                                          style.product_name_fakeNumber
                                        )}
                                      >
                                        <FakeNumber
                                          fakeNumber={product.fakeNumber}
                                          realNumber={product.sold}
                                        />
                                      </Space>
                                    </Flex>
                                    <Flex
                                      vertical
                                      justify="space-between"
                                      style={{ padding: "20px 20px 10px 20px" }}
                                    >
                                      <Space
                                        className={clsx(style.header_text)}
                                      >
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
                                      {product && product?.discount > 0 && (
                                        <del
                                          className={clsx(style.header_price)}
                                        >
                                          {numeral(product.price).format(
                                            "0,0$"
                                          )}
                                        </del>
                                      )}
                                      <Specifications
                                        title={product.specifications}
                                      />
                                      {/* buy */}
                                      <Flex justify="space-between">
                                        <Space
                                          onClick={(e) =>
                                            handleAddToCartTest(e, product)
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
                                    handleDetail(
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
                                      {/* <Label
                                        soldOut={!product.stock ? true : false}
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
                                        className={clsx(style.content_img)}
                                        alt=""
                                      />
                                      <Space
                                        className={clsx(
                                          style.product_name_fakeNumber
                                        )}
                                      >
                                        <FakeNumber
                                          fakeNumber={product.fakeNumber}
                                          realNumber={product.sold}
                                        />
                                      </Space>
                                    </Flex>
                                    <Flex
                                      vertical
                                      justify="space-between"
                                      style={{ padding: "20px 20px 10px 20px" }}
                                    >
                                      <Space
                                        className={clsx(style.header_text)}
                                      >
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
                                      {product && product?.discount > 0 && (
                                        <del
                                          className={clsx(style.header_price)}
                                        >
                                          {numeral(product.price).format(
                                            "0,0$"
                                          )}
                                        </del>
                                      )}
                                      <Specifications
                                        title={product.specifications}
                                      />
                                      {/* buy */}
                                      <Flex justify="space-between">
                                        <Space
                                          onClick={(e) =>
                                            handleAddToCartTest(e, product)
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
                              </Col>
                            );
                          }
                        }
                      })
                    ) : (
                      <Col xs={24} sm={24} style={{ marginBottom: "25px" }}>
                        <Empty
                          description={<span>Không có sản phẩm nào</span>}
                        />
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>
            </div>
          </div>

          {/* sản phẩm vừa xem  */}
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

                      {products ? (
                        products.map((product, index) => {
                          if (histories.includes(product._id)) {
                            return (
                              <>
                                <SwiperSlide key={index}>
                                  <Link
                                    onClick={() =>
                                      handleDetail(
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
                                          className={clsx(style.content_img)}
                                          alt=""
                                        />
                                        <Space
                                          className={clsx(
                                            style.product_name_fakeNumber
                                          )}
                                        >
                                          <FakeNumber
                                            fakeNumber={product.fakeNumber}
                                            realNumber={product.sold}
                                          />
                                        </Space>
                                      </Flex>
                                      <Flex
                                        vertical
                                        justify="space-between"
                                        style={{
                                          padding: " 20px 20px 10px 20px",
                                        }}
                                      >
                                        <Space
                                          className={clsx(style.header_text)}
                                        >
                                          {product.name}
                                        </Space>

                                        <Space
                                          className={clsx(
                                            style.header_discount
                                          )}
                                        >
                                          {product && product?.discount > 0 ? (
                                            <>
                                              <Space>
                                                <div>
                                                  {numeral(
                                                    product?.total
                                                  ).format("0,0$")}
                                                  <span
                                                    style={{ margin: "0 2px" }}
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
                                                    style={{ margin: "0 2px" }}
                                                  >
                                                    &#47;
                                                  </span>
                                                  {product?.unit}
                                                </div>
                                              </Space>
                                            </>
                                          )}
                                        </Space>
                                        {product && product?.discount > 0 ? (
                                          <del
                                            className={clsx(style.header_price)}
                                          >
                                            {numeral(product.price).format(
                                              "0,0$"
                                            )}
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
                                            // onClick={handleAddToCart}
                                            onClick={(e) =>
                                              handleAddToCartTest(e, product)
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

                {/* policy */}
                <div className={clsx(style.policy_footer_wrapper)}>
                  <PolicyFooter />
                </div>
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

          <BuyMobile
            product={specificProduct}
            SetIsActive={setActiveBuyMobile}
            active={activeBuyMobile}
          />
        </>
      </ConfigProvider>
    </>
  );
}

export default ProductScreen;
