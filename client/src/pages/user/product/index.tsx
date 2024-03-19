import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Flex, Row, Space, MenuProps, Empty, Image, Input } from "antd";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getAllProduct,
  getAllProductSearch,
  getProductByCategories,
  getProductById,
  getProductBySuppliers,
} from "../../../slices/productSlice";
import numeral from "numeral";
import { getAllCategory } from "../../../slices/categorySlice";
import { getAllSupplier } from "../../../slices/supplierSlice";
import clsx from "clsx";
import style from "./product.module.css";
import Discount from "../../../components/discount";
// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import ButtonNavigation from "../../../components/buttonNavigation";
import { Button } from "antd/es/radio";

function ProductScreen() {
  const { products, error } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const { suppliers } = useAppSelector((state) => state.suppliers);
  const { brands } = useAppSelector((state) => state.brands);
  const { tags } = useAppSelector((state) => state.tags);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // const handlePagination = (e: number) => {
  //   dispatch(getAllProduct({ page: e }));
  //   navigate(`/product?page=${e}`);
  // };

  const [searchAge, setSearchAge] = useState<Number>(1);
  const [searchTag, setSearchTag] = useState<string>(
    "65d8b631214ed285ba4bc016"
  );

  useEffect(() => {
    if (products.length === 0) dispatch(getAllProduct({}));
    if (categories.length === 0) dispatch(getAllCategory());
    if (suppliers.length === 0) dispatch(getAllSupplier());
  }, []);

  const handleDetail = (value: string, categoryId: string) => {
    localStorage.setItem("filter", JSON.stringify({ categoryId: categoryId }));
    localStorage.setItem("productId", JSON.stringify(value));
    dispatch(getProductById(value));
    dispatch(getAllProductSearch({ categoryId: categoryId }));
  };

  return (
    <>
      <div className={clsx(style.wrapper_global, style.top_sale)}>
        <Row>
          Sản phẩm bán chạy
          <Col xs={24} sm={24}>
            <Row gutter={[14, 14]}>
              {products && error.message === "" ? (
                products.map((product, index) => {
                  if (index <= 11)
                    return (
                      <Col xs={12} md={12} lg={4} style={{}}>
                        <Link
                          onClick={() =>
                            handleDetail(product._id, product.categoryId)
                          }
                          to={`/sanpham/${product.slug}`}
                          className={clsx(style.wrapper)}
                        >
                          <Flex className={clsx(style.content)} vertical>
                            <Space className={clsx(style.content_discount)}>
                              <Discount discount={product.discount}></Discount>
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
                              <Space className={clsx(style.header_discount)}>
                                {numeral(
                                  (product.price * (100 - product.discount)) /
                                    100
                                ).format("$0,0")}
                              </Space>
                              <del className={clsx(style.header_price)}>
                                {numeral(product.price).format("$0,0")}
                              </del>
                            </Flex>
                          </Flex>
                        </Link>
                      </Col>
                    );
                })
              ) : (
                <Col xs={24} sm={24} style={{ marginBottom: "25px" }}>
                  <Empty />
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </div>
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(252,243,233,1) 4%, rgba(255,255,255,1) 11%)",
        }}
        className={clsx(style.wrapper_global, style.top_sale)}
      >
        {/* thương hiệu */}
        <Row>
          <Col span={24}>
            <Space className={clsx(style.title_product_relate)}>
              Thương hiệu yêu thích
            </Space>

            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={18}
              slidesPerView={5}
              style={{ backgroundColor: "#ffffff" }}
            >
              <Flex
                justify="space-between"
                className={clsx(style.customSwiper_child)}
              >
                <ButtonNavigation />
              </Flex>

              {brands ? (
                brands.map((brand) => (
                  <>
                    <SwiperSlide>
                      <Link
                        onClick={() =>
                          handleDetail(brand._id, brand.categoryId)
                        }
                        to={`/sanpham/${brand.name}`}
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
                    <Empty />
                  </Col>
                </SwiperSlide>
              )}
            </Swiper>
          </Col>
        </Row>
        {/* danh mục */}
        <Row>
          Danh mục nổi bật
          <Col xs={24} sm={24}>
            <Row></Row>
            <Row gutter={[14, 14]}>
              {categories && error.message === "" ? (
                categories.map((category, index) => (
                  <Col xs={12} md={12} lg={4} style={{}}>
                    <Link
                      // onClick={() =>
                      //   handleDetail(category._id, category.categoryId)
                      // }
                      to={`/sanpham/${category.name}`}
                      className={clsx(style.wrapper)}
                    >
                      <Flex
                        className={clsx(style.content, style.content_category)}
                        vertical
                      >
                        {/* <Space className={clsx(style.content_discount)}>
                    <Discount discount={category.discount}></Discount>
                  </Space> */}

                        {/* <Flex justify="center">
                    <img
                      src={category.pic}
                      className={clsx(style.content_img)}
                      alt=""
                    />
                  </Flex> */}
                        <Flex
                          vertical
                          justify="space-between"
                          style={{ padding: "20px" }}
                        >
                          <Space className={clsx(style.header_text)}>
                            {category.name}
                          </Space>

                          <Space className={clsx(style.header_text)}>
                            {category.name}
                          </Space>
                          {/* <Space className={clsx(style.header_discount)}>
                      {numeral(
                        (category.price * (100 - category.discount)) / 100
                      ).format("$0,0")}
                    </Space>
                    <del className={clsx(style.header_price)}>
                      {numeral(category.price).format("$0,0")}
                    </del> */}
                        </Flex>
                      </Flex>
                    </Link>
                  </Col>
                ))
              ) : (
                <Col xs={24} sm={24} style={{ marginBottom: "25px" }}>
                  <Empty />
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </div>

      <div
        style={{
          background:
            " linear-gradient(0deg, rgba(226,236,255,1) 71%, rgba(255,255,255,1) 95%)",
        }}
        className={clsx(style.wrapper_global, style.top_sale)}
      >
        <Row>
          <Col span={24}>
            <Space className={clsx(style.title_product_relate)}>
              Sản phẩm theo độ tuổi
            </Space>
          </Col>
          <Col span={24}>
            <Flex className={clsx(style.filter_select_wrapper)}>
              <Space>
                <Button
                  style={{
                    boxShadow:
                      searchAge === 1 ? "inset 0 0 0 1px #1250dc" : "none",
                  }}
                  onClick={() => setSearchAge(1)}
                  className={clsx(style.filter_select)}
                >
                  Sơ sinh - 1 tuổi
                  <Space
                    className={clsx(
                      searchAge === 1 ? style.filter_label : { display: "none" }
                    )}
                  >
                    <div style={{ display: "none" }}>Sơ sinh - 1 tuổi</div>
                  </Space>
                </Button>
              </Space>
              <Space>
                <Button
                  style={{
                    boxShadow:
                      searchAge === 2 ? "inset 0 0 0 1px #1250dc" : "none",
                  }}
                  onClick={() => setSearchAge(2)}
                  className={clsx(style.filter_select)}
                >
                  1 tuổi - 2 tuổi
                  <Space
                    className={clsx(
                      searchAge === 2 ? style.filter_label : { display: "none" }
                    )}
                  >
                    <div style={{ display: "none" }}>Sơ sinh - 1 tuổi</div>
                  </Space>
                </Button>
              </Space>
              <Space>
                <Button
                  style={{
                    boxShadow:
                      searchAge === 3 ? "inset 0 0 0 1px #1250dc" : "none",
                  }}
                  onClick={() => setSearchAge(3)}
                  className={clsx(style.filter_select)}
                >
                  2 tuổi - 5 tuổi
                  <Space
                    className={clsx(
                      searchAge === 3 ? style.filter_label : { display: "none" }
                    )}
                  >
                    <div style={{ display: "none" }}>Sơ sinh - 1 tuổi</div>
                  </Space>
                </Button>
              </Space>
              <Space>
                <Button
                  style={{
                    boxShadow:
                      searchAge === 4 ? "inset 0 0 0 1px #1250dc" : "none",
                  }}
                  onClick={() => setSearchAge(4)}
                  className={clsx(style.filter_select)}
                >
                  Trên 5 tuổi
                  <Space
                    className={clsx(
                      searchAge === 4 ? style.filter_label : { display: "none" }
                    )}
                  >
                    <div style={{ display: "none" }}>Sơ sinh - 1 tuổi</div>
                  </Space>
                </Button>
              </Space>
            </Flex>
          </Col>
          <Col span={24}>
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={18}
              slidesPerView={6}
              style={{
                backgroundColor: "#2f6de5",
                padding: "10px",
                borderRadius: "10px",
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
                    (searchAge === 1 && product.age >= 0 && product.age <= 1) ||
                    (searchAge === 2 && product.age <= 2 && product.age >= 1) ||
                    (searchAge === 3 && product.age <= 5 && product.age >= 2) ||
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
                            <Flex className={clsx(style.content)} vertical>
                              <Space className={clsx(style.content_discount)}>
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
                                <Space className={clsx(style.header_discount)}>
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
                                <del className={clsx(style.header_price)}>
                                  {numeral(product.price).format("$0,0")}
                                </del>
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
                    <Empty />
                  </Col>
                </SwiperSlide>
              )}
            </Swiper>
          </Col>
        </Row>
      </div>

      {/* gợi ý hôm nay */}
      <div
        style={{
          background: "#e2ecff",
        }}
        className={clsx(style.wrapper_global, style.top_sale)}
      >
        <Row>
          <Col span={24}>
            <Space className={clsx(style.title_product_relate)}>
              Gợi ý hôm nay
            </Space>
          </Col>
          <Col span={24}>
            <Flex
              className={clsx(
                style.filter_select_wrapper,
                style.filter_select__tag_wrapper
              )}
            >
              {tags ? (
                tags.map((tag) => (
                  <Space>
                    <Button
                      style={{
                        boxShadow:
                          searchTag === tag._id
                            ? "inset 0 0 0 1px #1250dc"
                            : "none",
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
                  </Space>
                ))
              ) : (
                <></>
              )}
            </Flex>
          </Col>
          <Col xs={24} sm={24}>
            <Row gutter={[14, 14]}>
              {products && error.message === "" ? (
                products.map((product, index) => {
                  if (product.tagList && product.tagList.includes(searchTag))
                    return (
                      <Col xs={12} md={12} lg={4} style={{}}>
                        <Link
                          onClick={() =>
                            handleDetail(product._id, product.categoryId)
                          }
                          to={`/sanpham/${product.slug}`}
                          className={clsx(style.wrapper)}
                        >
                          <Flex className={clsx(style.content)} vertical>
                            <Space className={clsx(style.content_discount)}>
                              <Discount discount={product.discount}></Discount>
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
                              <Space className={clsx(style.header_discount)}>
                                {numeral(
                                  (product.price * (100 - product.discount)) /
                                    100
                                ).format("$0,0")}
                              </Space>
                              <del className={clsx(style.header_price)}>
                                {numeral(product.price).format("$0,0")}
                              </del>
                            </Flex>
                          </Flex>
                        </Link>
                      </Col>
                    );
                })
              ) : (
                <Col xs={24} sm={24} style={{ marginBottom: "25px" }}>
                  <Empty />
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ProductScreen;
