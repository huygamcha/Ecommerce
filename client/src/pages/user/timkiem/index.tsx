import { Button, Col, Empty, Flex, Row, Space } from "antd";
import { useEffect, useState } from "react";
import style from "./timkiem.module.css";
import clsx from "clsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Discount from "../../../components/discount";
import numeral from "numeral";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getAllProductSearch,
  getProductById,
} from "../../../slices/productSlice";
import { getAllCategory } from "../../../slices/categorySlice";
import { getAllBrand } from "../../../slices/brandSlice";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { LuAlignCenter } from "react-icons/lu";
import MenuFooter from "../../../components/MenuFooter";
import Label from "../../../components/label";
function Timkiem() {
  const filter = localStorage.getItem("filter")
    ? JSON.parse(localStorage.getItem("filter")!)
    : undefined;
  const { productsSearch } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const { brands } = useAppSelector((state) => state.brands);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  // set product render

  // set active search
  const [activePrice, setActivePrice] = useState<number>(0);
  const [activeAge, setActiveAge] = useState<number>(0);

  const [activeCategory, setActiveCategory] = useState<string>(
    filter ? filter.categoryId : ""
  );
  const [activeBrand, setActiveBrand] = useState<string>(
    filter ? filter.brandId : ""
  );

  // set dropdown
  const [dropCategory, setDropCategory] = useState<boolean>(true);
  const [dropPrice, setDropPrice] = useState<boolean>(false);
  const [dropAge, setDropAge] = useState<boolean>(false);
  const [dropBrand, setDropBrand] = useState<boolean>(false);
  const [activeFillter, setActiveFillter] = useState<boolean>(false);

  // go to detail
  const handleDetail = (value: string, categoryId: string) => {
    localStorage.setItem("filter", JSON.stringify({ categoryId: categoryId }));
    localStorage.setItem("productId", JSON.stringify(value));
    dispatch(getProductById(value));
    // lấy các sản phẩm có cùng danh mục, Update bằng cách so sánh với sản phẩm là categoryId
    dispatch(getAllProductSearch({ categoryId: categoryId }));
  };

  useEffect(() => {
    // window.location.reload();
    if (categories.length === 0) dispatch(getAllCategory());
    if (brands.length === 0) dispatch(getAllBrand());
    window.scrollTo({ top: 0, left: 0 });

    // dispatch(getAllBrand(filter.categoryId ? filter.categoryId : "'"));
  }, []);

  useEffect(() => {
    localStorage.removeItem("searchPrice");
    localStorage.removeItem("searchAge");
    // dispatch(getAllProductSearch({ searchTag: "" }));
    if (filter.categoryId && !filter.searchTag) {
      setActiveCategory(filter.categoryId);
      setActiveBrand(filter.brandId);
      dispatch(
        getAllProductSearch({
          categoryId: filter.categoryId,
          brandId: filter.brandId,
        })
      );
    } else if (filter.searchTag) {
      dispatch(
        getAllProductSearch({
          searchTag: filter.searchTag,
        })
      );
    }
    // nêu là lịch sử search là SearchTag thì
    if (filter && filter.searchTag) {
      setActiveCategory("");
    }
  }, [location.search]);

  //search category
  const handleSearchCategory = (id: string, name: string) => {
    localStorage.setItem("filter", JSON.stringify({ categoryId: id }));
    dispatch(getAllProductSearch({ categoryId: id }));
    setActiveCategory(id);
    setDropBrand(true);
    navigate(`/timkiem?s=${name}`);
  };

  //search brand
  const handleSearchBrand = (id: string, name: string) => {
    const filter = localStorage.getItem("filter")
      ? JSON.parse(localStorage.getItem("filter")!)
      : {};
    if (filter) {
      filter["brandId"] = id;
    }
    localStorage.setItem("filter", JSON.stringify(filter));
    setActiveBrand(id);
    dispatch(getAllProductSearch({ brandId: id }));

    // navigate(`/timkiem?s=${name}`);
  };

  // search price
  const handleSearchPrice = (
    priceFrom: number,
    priceTo: number,
    no: number
  ) => {
    localStorage.setItem(
      "searchPrice",
      JSON.stringify({ priceFrom: priceFrom, priceTo: priceTo })
    );
    dispatch(getAllProductSearch({ priceFrom: priceFrom, priceTo: priceTo }));
    setActivePrice(no);
  };

  //search age
  const handleSearchAge = (ageFrom: number, ageTo: number, no: number) => {
    localStorage.setItem(
      "searchAge",
      JSON.stringify({ ageFrom: ageFrom, ageTo: ageTo })
    );
    setActiveAge(no);
    dispatch(getAllProductSearch({ ageFrom: ageFrom, ageTo: ageTo }));
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          background: "#edf0f3",
        }}
      >
        <Row gutter={12} className={clsx(style.wrapper_global)}>
          <Col
            xs={activeFillter ? 24 : 0}
            style={{ padding: activeFillter ? "0px 6px" : "0px 6px 0px 0px" }}
            sm={6}
          >
            <Flex className={clsx(style.navbar_wrapper)} vertical>
              <Flex
                style={{
                  fontSize: "16px",
                  lineHeight: "24px",
                  fontWeight: "600",
                  padding: "10px ",
                  borderBottom: "1px solid #e4e8ed",
                }}
                align="center"
              >
                <LuAlignCenter />
                <Space style={{ marginLeft: "5px" }}> Bộ lọc nâng cao</Space>
              </Flex>
              <Space className={clsx(style.navbar)}>
                <Flex vertical>
                  <Flex
                    onClick={() => setDropCategory(!dropCategory)}
                    justify="space-between"
                    align="center"
                    className={clsx(style.filter_name, style.dropdown_main)}
                  >
                    Danh mục
                    {dropCategory ? <FiChevronDown /> : <FiChevronUp />}
                  </Flex>

                  <Flex
                    vertical
                    className={clsx(
                      style.dropdown_item,
                      dropCategory ? style.active : ""
                    )}
                  >
                    <Row gutter={12}>
                      {categories.map((category) => (
                        <Col xs={12} sm={24}>
                          <Button
                            style={{
                              boxShadow:
                                category._id === activeCategory
                                  ? "inset 0 0 0 1px #1250dc"
                                  : "none",
                            }}
                            onClick={() =>
                              handleSearchCategory(category._id, category.name)
                            }
                            className={clsx(style.filter_select)}
                          >
                            {category.name}
                            <Space
                              className={clsx(
                                category._id === activeCategory
                                  ? style.filter_label
                                  : { display: "none" }
                              )}
                            >
                              <div style={{ display: "none" }}>1</div>
                            </Space>
                          </Button>
                        </Col>
                      ))}
                    </Row>
                  </Flex>
                </Flex>
              </Space>
              <Space className={clsx(style.navbar)}>
                <Flex vertical>
                  <Flex
                    onClick={() => setDropBrand(!dropBrand)}
                    justify="space-between"
                    align="center"
                    className={clsx(style.filter_name, style.dropdown_main)}
                  >
                    Thương hiệu
                    {dropBrand ? <FiChevronDown /> : <FiChevronUp />}
                  </Flex>

                  <Flex
                    vertical
                    className={clsx(
                      style.dropdown_item,
                      dropBrand ? style.active : ""
                    )}
                  >
                    <Row gutter={12}>
                      {brands.map((brand) => {
                        if (brand.categoryId === activeCategory) {
                          return (
                            <Col xs={12} sm={24}>
                              <Button
                                style={{
                                  boxShadow:
                                    brand._id === activeBrand
                                      ? "inset 0 0 0 1px #1250dc"
                                      : "none",
                                }}
                                onClick={() =>
                                  handleSearchBrand(brand._id, brand.name)
                                }
                                className={clsx(style.filter_select)}
                              >
                                {brand.name}
                                <Space
                                  className={clsx(
                                    brand._id === activeBrand
                                      ? style.filter_label
                                      : { display: "none" }
                                  )}
                                >
                                  <div style={{ display: "none" }}>1</div>
                                </Space>
                              </Button>
                            </Col>
                          );
                        }
                      })}
                    </Row>
                  </Flex>
                </Flex>
              </Space>
              <Space className={clsx(style.navbar)}>
                <Flex vertical>
                  <Flex
                    onClick={() => setDropPrice(!dropPrice)}
                    justify="space-between"
                    align="center"
                    className={clsx(style.filter_name, style.dropdown_main)}
                  >
                    Giá bán
                    {dropPrice ? <FiChevronDown /> : <FiChevronUp />}
                  </Flex>
                  <Flex
                    className={clsx(
                      style.dropdown_item,
                      dropPrice ? style.active : ""
                    )}
                    vertical
                  >
                    <Row gutter={12}>
                      <Col xs={12} sm={24}>
                        <Button
                          style={{
                            boxShadow:
                              0 === activePrice
                                ? "inset 0 0 0 1px #1250dc"
                                : "none",
                          }}
                          onClick={() => handleSearchPrice(0, 1000000000, 0)}
                          className={clsx(style.filter_select)}
                        >
                          Tất cả
                          <Space
                            className={clsx(
                              0 === activePrice
                                ? style.filter_label
                                : { display: "none" }
                            )}
                          >
                            <div style={{ display: "none" }}>1</div>
                          </Space>
                        </Button>
                      </Col>

                      <Col xs={12} sm={24}>
                        {" "}
                        <Button
                          style={{
                            boxShadow:
                              1 === activePrice
                                ? "inset 0 0 0 1px #1250dc"
                                : "none",
                          }}
                          onClick={() => handleSearchPrice(0, 100000, 1)}
                          className={clsx(style.filter_select)}
                        >
                          Dưới đ100.000
                          <Space
                            className={clsx(
                              1 === activePrice
                                ? style.filter_label
                                : { display: "none" }
                            )}
                          >
                            <div style={{ display: "none" }}>1</div>
                          </Space>
                        </Button>
                      </Col>

                      <Col xs={12} sm={24}>
                        <Button
                          style={{
                            boxShadow:
                              2 === activePrice
                                ? "inset 0 0 0 1px #1250dc"
                                : "none",
                          }}
                          value={2}
                          onClick={() => handleSearchPrice(100000, 300000, 2)}
                          className={clsx(style.filter_select)}
                        >
                          đ100.000 đến đ300.000
                          <Space
                            className={clsx(
                              2 === activePrice
                                ? style.filter_label
                                : { display: "none" }
                            )}
                          >
                            <div style={{ display: "none" }}>2</div>
                          </Space>
                        </Button>
                      </Col>

                      <Col xs={12} sm={24}>
                        <Button
                          style={{
                            boxShadow:
                              3 === activePrice
                                ? "inset 0 0 0 1px #1250dc"
                                : "none",
                          }}
                          value={3}
                          onClick={() => handleSearchPrice(300000, 500000, 3)}
                          className={clsx(style.filter_select)}
                        >
                          300.000đ đến đ500.000
                          <Space
                            className={clsx(
                              3 === activePrice
                                ? style.filter_label
                                : { display: "none" }
                            )}
                          >
                            <div style={{ display: "none" }}>2</div>
                          </Space>
                        </Button>
                      </Col>

                      <Col xs={12} sm={24}>
                        <Button
                          style={{
                            boxShadow:
                              4 === activePrice
                                ? "inset 0 0 0 1px #1250dc"
                                : "none",
                          }}
                          value={4}
                          onClick={() =>
                            handleSearchPrice(500000, 100000000, 4)
                          }
                          className={clsx(style.filter_select)}
                        >
                          Trên đ500.000
                          <Space
                            className={clsx(
                              4 === activePrice
                                ? style.filter_label
                                : { display: "none" }
                            )}
                          >
                            <div style={{ display: "none" }}>2</div>
                          </Space>
                        </Button>
                      </Col>
                    </Row>
                  </Flex>
                </Flex>
              </Space>
              <Space className={clsx(style.navbar)}>
                <Flex vertical>
                  <Flex
                    onClick={() => setDropAge(!dropAge)}
                    justify="space-between"
                    align="center"
                    className={clsx(style.filter_name, style.dropdown_main)}
                  >
                    Độ tuổi
                    {dropAge ? <FiChevronDown /> : <FiChevronUp />}
                  </Flex>

                  <Flex
                    vertical
                    className={clsx(
                      style.dropdown_item,
                      dropAge ? style.active : ""
                    )}
                  >
                    <Row gutter={12}>
                      <Col xs={12} sm={24}>
                        <Button
                          style={{
                            boxShadow:
                              0 === activeAge
                                ? "inset 0 0 0 1px #1250dc"
                                : "none",
                          }}
                          onClick={() => handleSearchAge(0, 100, 0)}
                          className={clsx(style.filter_select)}
                        >
                          Tất cả
                          <Space
                            className={clsx(
                              0 === activeAge
                                ? style.filter_label
                                : { display: "none" }
                            )}
                          >
                            <div style={{ display: "none" }}>1</div>
                          </Space>
                        </Button>
                      </Col>
                      <Col xs={12} sm={24}>
                        <Button
                          style={{
                            boxShadow:
                              1 === activeAge
                                ? "inset 0 0 0 1px #1250dc"
                                : "none",
                          }}
                          onClick={() => handleSearchAge(0, 1, 1)}
                          className={clsx(style.filter_select)}
                        >
                          Sơ sinh - 1 tuổi
                          <Space
                            className={clsx(
                              1 === activeAge
                                ? style.filter_label
                                : { display: "none" }
                            )}
                          >
                            <div style={{ display: "none" }}>1</div>
                          </Space>
                        </Button>
                      </Col>
                      <Col xs={12} sm={24}>
                        <Button
                          style={{
                            boxShadow:
                              3 === activeAge
                                ? "inset 0 0 0 1px #1250dc"
                                : "none",
                          }}
                          value={3}
                          onClick={() => handleSearchAge(2, 5, 3)}
                          className={clsx(style.filter_select)}
                        >
                          2 tuổi - 5 tuổi
                          <Space
                            className={clsx(
                              3 === activeAge
                                ? style.filter_label
                                : { display: "none" }
                            )}
                          >
                            <div style={{ display: "none" }}>2</div>
                          </Space>
                        </Button>
                      </Col>
                      <Col xs={12} sm={24}>
                        <Button
                          style={{
                            boxShadow:
                              4 === activeAge
                                ? "inset 0 0 0 1px #1250dc"
                                : "none",
                          }}
                          value={4}
                          onClick={() => handleSearchAge(5, 100, 4)}
                          className={clsx(style.filter_select)}
                        >
                          Trên 5 tuổi
                          <Space
                            className={clsx(
                              4 === activeAge
                                ? style.filter_label
                                : { display: "none" }
                            )}
                          >
                            <div style={{ display: "none" }}>2</div>
                          </Space>
                        </Button>
                      </Col>
                    </Row>
                  </Flex>
                </Flex>
              </Space>
            </Flex>
          </Col>

          {/* mobile */}
          <Col xs={24} sm={0}>
            <Flex
              style={{
                fontSize: "16px",
                lineHeight: "24px",
                fontWeight: "700",
                margin: "10px 0px",
              }}
              justify="space-between"
            >
              <Space>Danh sách sản phẩm</Space>
              <Flex
                onClick={() => setActiveFillter(!activeFillter)}
                style={{ fontWeight: "600", cursor: "pointer" }}
                align="center"
              >
                <LuAlignCenter />
                <Space style={{ marginLeft: "5px" }}>Lọc</Space>
              </Flex>
            </Flex>
          </Col>

          <Col xs={24} sm={18}>
            <Row gutter={24}>
              <Col xs={0} sm={24}>
                <Space
                  style={{
                    fontSize: "18px",
                    lineHeight: "24px",
                    fontWeight: "600",
                    marginBottom: "16px",
                  }}
                >
                  Danh sách sản phẩm
                </Space>
              </Col>
              <Col xs={24} sm={24}>
                <Row gutter={{ xs: 7, sm: 14 }}>
                  {productsSearch ? (
                    productsSearch.map((product) => (
                      <Col
                        xs={12}
                        md={12}
                        lg={6}
                        className={clsx(style.customPB)}
                      >
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
                            <Space className={clsx(style.label_wrapper)}>
                              <Label title={product.category.name} />
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
                              style={{ padding: "45px 20px 20px 20px" }}
                            >
                              <Space className={clsx(style.header_text)}>
                                {product.name}
                              </Space>
                              <Space className={clsx(style.header_discount)}>
                                {numeral(
                                  (product.price * (100 - product.discount)) /
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
                  <Col xs={24}></Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      <Row>
        <Col xs={24} sm={0}>
          <MenuFooter />
        </Col>
      </Row>
    </>
  );
}

export default Timkiem;
