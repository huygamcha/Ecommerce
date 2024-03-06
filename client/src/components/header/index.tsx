import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Col, Flex, Input, Row, Space, Image, Badge } from "antd";
import clsx from "clsx";
import style from "./header.module.css";
import {
  DownOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  getAllProduct,
  getAllProductSearch,
  getProductById,
} from "../../slices/productSlice";
import Discount from "../discount";
import numeral from "numeral";
import { logout } from "../../slices/authSlice";
import {
  createCartFromCustomer,
  resetCartNotification,
} from "../../slices/cartSlice";
import { getAllTag } from "../../slices/tagSlice";
import { getAllBrand } from "../../slices/brandSlice";

function HeaderScreen() {
  const currentUser = localStorage.getItem("userInfor")
    ? JSON.parse(localStorage.getItem("userInfor")!)
    : undefined;

  const filter = localStorage.getItem("filter")
    ? JSON.parse(localStorage.getItem("filter")!)
    : undefined;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>();
  // xác định phần tử con nào được liệt kê
  const [categoryActive, setCategoryActive] = useState<string>("");
  const navigate = useNavigate();
  // notifications
  const [show, setShow] = useState(false);

  const location = useLocation();
  const dispatch = useAppDispatch();
  const { products, productsSearch } = useAppSelector(
    (state) => state.products
  );
  const { categories } = useAppSelector((state) => state.categories);
  const { brands } = useAppSelector((state) => state.brands);
  const { add } = useAppSelector((state) => state.carts);
  const { tags } = useAppSelector((state) => state.tags);

  const handleSearch = (e: any) => {
    dispatch(getAllProduct({ search: e.target.value }));
    setSearch(e.target.value);
  };

  // search
  const handleSearchTag = (e: string) => {
    localStorage.setItem("filter", JSON.stringify({ searchTag: e }));
    dispatch(getAllProductSearch({ searchTag: e }));
  };

  // logout
  const handleLogout = async () => {
    await dispatch(createCartFromCustomer());
    dispatch(logout());
    navigate("/auth/login");
  };

  // notifications
  const handleCart = () => {
    setShow(false);
    dispatch(resetCartNotification());
  };

  useEffect(() => {
    if (add > 0) {
      setShow(true);
    }
  }, [add]);

  useEffect(() => {
    dispatch(getAllTag());
    dispatch(getAllBrand());
  }, []);

  //click
  const handleDetail = (value: string) => {
    dispatch(getProductById(value));
    setSearch("");
  };

  //search category and brand
  const handleSearchMenu = (categoryId: string, brandId: string) => {
    console.log("««««« brandId »»»»»", brandId);
    console.log("««««« location.search »»»»»", location.search.split("&b")[1]);
    localStorage.setItem(
      "filter",
      JSON.stringify({ categoryId: categoryId, brandId: brandId })
    );
  };

  return (
    <>
      {tags ? (
        <>
          <Row justify="end" className={clsx(style.wrapper_try)}>
            <Col xs={4} sm={2} md={2} lg={2}>
              <Link to="/" className={clsx(style.header_text)}>
                Pam
              </Link>
            </Col>
            <Col xs={17} sm={14} md={13} lg={16}>
              <Flex>
                <Input
                  value={search}
                  onChange={handleSearch}
                  className={clsx(style.header_search_input)}
                  placeholder="Tìm kiếm sản phẩm"
                ></Input>
                <Space className={clsx(style.header_search_result)}>
                  {search && products ? (
                    products.map((product) => (
                      <Link
                        className={clsx(style.header_search_items)}
                        to={`/sanpham/${product.slug}`}
                        // onClick={() => setSearch("")}
                        onClick={() => handleDetail(product._id)}
                      >
                        <Flex>
                          <Space style={{ marginRight: "10px" }}>
                            <Image
                              width="40px"
                              height="40px"
                              src={product?.pic}
                            ></Image>
                          </Space>
                          <Flex vertical>
                            <Space style={{ fontSize: "16px" }}>
                              {product.name}
                            </Space>
                            <Space style={{ fontWeight: "bold" }}>
                              {numeral(product.total).format("$0,0.0")}
                              <Space>
                                <Discount
                                  font={9}
                                  discount={product.discount}
                                ></Discount>
                              </Space>
                            </Space>
                          </Flex>
                        </Flex>
                      </Link>
                    ))
                  ) : (
                    <></>
                  )}
                </Space>

                <div className={clsx(style.header_search_icon)}>
                  <SearchOutlined />
                </div>
              </Flex>
            </Col>
            <Col xs={0} sm={8} md={9} lg={6}>
              <Flex justify="end">
                {currentUser ? (
                  <Space className={clsx(style.profile_detail)}>
                    <Space
                      style={{ marginRight: "14px" }}
                      className={`${style.button_header}`}
                    >
                      <Link
                        className={clsx(style.button_header_text)}
                        to="/profile"
                      >
                        <UserDeleteOutlined
                          className={clsx(style.button_icon)}
                        />
                        <Space>{currentUser.name}</Space>
                      </Link>
                    </Space>

                    <Flex className={clsx(style.profile_detail_child)}>
                      <Space>
                        <Link
                          style={{ color: "#000", fontWeight: "normal" }}
                          to="/profile"
                        >
                          <UserDeleteOutlined />
                          <Space style={{ marginLeft: "5px" }}>
                            Thông tin cá nhân
                          </Space>
                        </Link>
                      </Space>
                      <Space
                        onClick={handleLogout}
                        style={{ color: "#000", fontWeight: "normal" }}
                      >
                        <LogoutOutlined />
                        <Space>Đăng xuất</Space>
                      </Space>
                    </Flex>
                  </Space>
                ) : (
                  <>
                    <Space
                      style={{ marginRight: "14px" }}
                      className={clsx(style.button_header)}
                    >
                      <Link
                        className={clsx(style.button_header_text)}
                        to="/auth/login"
                      >
                        <UserDeleteOutlined
                          className={clsx(style.button_icon)}
                        />
                        Đăng nhập
                      </Link>
                    </Space>
                  </>
                )}

                <Space
                  className={clsx(style.button_header, style.button_background)}
                >
                  <Link
                    onClick={handleCart}
                    className={clsx(style.button_header_text)}
                    to="/cart"
                  >
                    <Badge dot={show} status="warning">
                      <ShoppingCartOutlined
                        className={clsx(style.button_icon)}
                      />
                    </Badge>
                    Giỏ hàng
                  </Link>
                </Space>
              </Flex>
            </Col>
            <Col xs={3} sm={0}>
              <Flex justify="end">
                <Space
                  className={clsx(
                    style.button_header,
                    style.button_background_mobile
                  )}
                >
                  <Link className={clsx(style.button_header_text)} to="/cart">
                    <MenuUnfoldOutlined
                      onClick={() => setIsOpen(!isOpen)}
                      className={clsx(style.button_icon_mobile)}
                    />
                  </Link>
                </Space>
              </Flex>
            </Col>
            <Space>
              {isOpen ? (
                <Flex className={clsx(style.menu_mobile)} vertical>
                  <Link to="/product">
                    <div style={{ fontSize: "35px" }}>Pam</div>
                  </Link>
                  <div>
                    <Link
                      className={clsx(style.menu_mobile_child)}
                      onClick={() => setIsOpen(false)}
                      to="/cart"
                    >
                      <Space>Giỏ hàng</Space>
                    </Link>
                  </div>
                  <div>
                    <Link
                      className={clsx(style.menu_mobile_child)}
                      onClick={() => setIsOpen(false)}
                      to="/product"
                    >
                      <Space>Sản phẩm</Space>
                    </Link>
                  </div>
                  <div>
                    <Link
                      className={clsx(style.menu_mobile_child)}
                      onClick={() => setIsOpen(false)}
                      to="/profile"
                    >
                      <Space>
                        {currentUser ? currentUser.name : "Đăng nhập"}
                      </Space>
                    </Link>
                  </div>
                  <div>
                    <Link
                      className={clsx(style.menu_mobile_child)}
                      onClick={() => setIsOpen(false)}
                      to="/cart"
                    >
                      <Space></Space>
                    </Link>
                  </div>
                </Flex>
              ) : (
                <></>
              )}
            </Space>
          </Row>
          <Row className={clsx(style.wrapper_try_tag)}>
            <Col offset={2} className={clsx(style.wrapper_try_tag_display)}>
              <Flex>
                {tags ? (
                  tags.map((tag) => (
                    <Link
                      onClick={() => handleSearchTag(tag._id)}
                      className={clsx(style.tag_item)}
                      to={`/timkiem?s=${tag.name}`}
                    >
                      {tag.name}
                    </Link>
                  ))
                ) : (
                  <></>
                )}
              </Flex>
            </Col>
          </Row>
          <Row className={clsx(style.wrapper_try_brand)}>
            <Col className={clsx(style.menu_sub)}>
              {categories ? (
                categories.map((category) => (
                  <>
                    <Link
                      onMouseEnter={() => setCategoryActive(category._id)}
                      onMouseLeave={() => setCategoryActive("")}
                      onClick={(e) => {
                        handleSearchMenu(category._id, "");
                      }}
                      to={`/timkiem?s=${category.name}`}
                    >
                      <Space className={clsx(style.brand_item)}>
                        {category.name}
                        <DownOutlined />
                      </Space>

                      <Flex vertical className={clsx(style.brand_list)}>
                        {brands.map((brand) => {
                          if (
                            brand.categoryId === category._id &&
                            brand.categoryId === categoryActive
                          ) {
                            return (
                              <Link
                                to={`/timkiem?s=${category.name}&b=${brand.name}`}
                              >
                                <Flex
                                  onClick={(e) => {
                                    // ngăn chặn việc gọi lên handleSearchMenu ở hàm, đánh đổi reload lại trang
                                    e.stopPropagation();
                                    handleSearchMenu(category._id, brand._id);
                                  }}
                                  className={clsx(style.brand_list_item)}
                                >
                                  {brand.name}
                                </Flex>
                              </Link>
                            );
                          }
                        })}
                      </Flex>
                    </Link>
                  </>
                ))
              ) : (
                <></>
              )}
            </Col>
          </Row>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default HeaderScreen;
