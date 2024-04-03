import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Col, Flex, Input, Row, Space, Image, Badge } from "antd";
import clsx from "clsx";
import style from "./header.module.css";
import {
  LogoutOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { FiChevronDown } from "react-icons/fi";
import { FaCartShopping, FaBars } from "react-icons/fa6";

import { TiDelete } from "react-icons/ti";
import { useAppDispatch, useAppSelector } from "../../store";
import { getAllProductSearch, getProductById } from "../../slices/productSlice";
import numeral from "numeral";
import { logout } from "../../slices/authSlice";
import {
  createCartFromCustomer,
  resetCartNotification,
} from "../../slices/cartSlice";
import { getAllTag } from "../../slices/tagSlice";
import { getAllBrand } from "../../slices/brandSlice";
import { getAllCategory } from "../../slices/categorySlice";
import { useOutsideClick } from "../OutsideClick/index";

function HeaderScreen() {
  const currentUser = localStorage.getItem("userInfor")
    ? JSON.parse(localStorage.getItem("userInfor")!)
    : undefined;

  const filter = localStorage.getItem("filter")
    ? JSON.parse(localStorage.getItem("filter")!)
    : undefined;
  // mở tabmobile
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // hiển thị danh sách tìm kiém
  const [isList, setIsList] = useState<boolean>(false);
  // tìm kiếm
  const [search, setSearch] = useState<string>();
  // xác định phần tử con nào được liệt kê
  const [categoryActive, setCategoryActive] = useState<string>("");
  // thông báo về mua sản phẩm
  const [show, setShow] = useState(false);

  //  ẩn hiện thi click ra ngoài
  const ref = useOutsideClick(() => {
    console.log("Clicked outside of MyComponent");
  });

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { products, productsSearch } = useAppSelector(
    (state) => state.products
  );
  const { categories } = useAppSelector((state) => state.categories);
  const { brands } = useAppSelector((state) => state.brands);
  const { add } = useAppSelector((state) => state.carts);
  const { tags } = useAppSelector((state) => state.tags);

  const handleSearch = (e: any) => {
    dispatch(getAllProductSearch({ search: e.target.value }));
    setIsList(true);
    setSearch(e.target.value);
    if (e.target.value === "") {
      setIsList(false);
    }
  };

  // search
  const handleSearchTag = (e: string) => {
    localStorage.setItem("filter", JSON.stringify({ searchTag: e }));
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
    setIsList(false);
  }, [location]);

  useEffect(() => {
    if (tags.length === 0) dispatch(getAllTag());
    if (brands.length === 0) dispatch(getAllBrand());
    if (categories.length === 0) dispatch(getAllCategory());
  }, []);

  //click
  const handleDetail = (value: string) => {
    dispatch(getProductById(value));
    localStorage.setItem("productId", JSON.stringify(value));
    // setSearch("");
  };

  //search category and brand
  const handleSearchMenu = (categoryId: string, brandId: string) => {
    localStorage.setItem(
      "filter",
      JSON.stringify({ categoryId: categoryId, brandId: brandId })
    );
  };

  // useREF
  function useOutsideAlerter(ref: React.RefObject<any>) {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        //  kiểm tra DOM cả 2 nếu khác nhau thì đã click ở ngoài
        // console.log("««««« ref »»»»»", ref.current.input);
        console.log("««««« ref.current »»»»»", ref.current);
        console.log("««««« event »»»»»", event.target);
        if (ref.current && !ref.current.contains(event.target)) {
          setIsList(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    // 5 16 0 3

    <>
      <div
        style={{
          background: "#256cdf",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Row justify="end" className={clsx(style.wrapper_try)}>
          <Col xs={2} sm={0}>
            <Link to="/" className={clsx(style.header_text)}>
              <FaBars className={clsx(style.button_icon)} />
            </Link>
          </Col>
          <Col xs={0} sm={2} md={2} lg={5}>
            <Link to="/" className={clsx(style.header_text)}>
              <img
                src="https://cms-prod.s3-sgn09.fptcloud.com/smalls/Logo_LC_Default_2e36f42b6b.svg"
                alt=""
              />
            </Link>
          </Col>
          <Col xs={20} sm={14} md={13} lg={13}>
            <Flex>
              <Input
                // ref={inputRef}
                // ref={wrapperRef}
                type="text"
                value={search}
                onChange={handleSearch}
                className={clsx(style.header_search_input)}
                placeholder="Tìm kiếm sản phẩm"
                onFocus={handleSearch}
              ></Input>

              <div className={clsx(style.header_search_icon_search)}>
                <SearchOutlined />
              </div>
              <div
                onClick={() => {
                  setSearch("");
                  setIsList(false);
                }}
                className={clsx(style.header_search_icon_delete)}
              >
                {search ? <TiDelete /> : <></>}
              </div>
              {/* search result */}
              <Space
                ref={wrapperRef}
                className={clsx(style.header_search_result, style.active)}
              >
                {isList && productsSearch ? (
                  productsSearch.map((product) => (
                    <Link
                      className={clsx(style.header_search_items)}
                      to={`/sanpham/${product.slug}`}
                      onClick={() => handleDetail(product._id)}
                    >
                      <Flex>
                        <Space style={{ marginRight: "10px" }}>
                          <Image
                            className={clsx(style.header_search_items_img)}
                            src={product?.pic}
                          ></Image>
                        </Space>
                        <Flex vertical>
                          <Space
                            style={{ fontSize: "16px", lineHeight: "24px" }}
                          >
                            {product.name}
                          </Space>
                          <Space style={{ fontWeight: "bold" }}>
                            <div>
                              {" "}
                              {numeral(product.total).format("$0,0")} /{" "}
                              {product.unit}
                            </div>
                          </Space>
                        </Flex>
                      </Flex>
                    </Link>
                  ))
                ) : (
                  <></>
                )}
              </Space>
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
                      <UserDeleteOutlined className={clsx(style.button_icon)} />
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
                      <UserDeleteOutlined className={clsx(style.button_icon)} />
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
                  <Badge
                    className={clsx(style.customFA)}
                    dot={show}
                    status="warning"
                  >
                    <FaCartShopping className={clsx(style.button_icon)} />
                  </Badge>
                  <Space>Giỏ hàng</Space>
                </Link>
              </Space>
            </Flex>
          </Col>

          <Col xs={2} sm={0}>
            <Link
              onClick={handleCart}
              className={clsx(style.button_header_text)}
              to="/cart"
              style={{ display: "flex", justifyContent: "end" }}
            >
              <Badge
                className={clsx(style.customFA)}
                dot={show}
                status="warning"
              >
                <FaCartShopping className={clsx(style.button_icon)} />
              </Badge>
            </Link>
          </Col>

          <Col xs={0} sm={0}>
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
                    style={{ display: "flex" }}
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
      </div>
      <div
        style={{
          background: "#256cdf",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* tag */}
        <Row
          style={{ paddingTop: "0px", zIndex: 1 }}
          justify="end"
          className={clsx(style.wrapper_try, style.wrapper_try_tag)}
        >
          <Col xs={0} sm={2} md={2} lg={5}></Col>
          <Col
            xs={0}
            sm={14}
            md={13}
            lg={13}
            className={clsx(style.wrapper_try_tag)}
          >
            <Flex className={clsx(style.wrapper_try_tag_display)}>
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
          <Col xs={0} sm={8} md={9} lg={6}></Col>
          <Col xs={0} sm={0}></Col>
        </Row>
      </div>

      {/* danh mục và thương hiệu */}
      <div
        style={{
          background: "#fff",
          display: "flex",
          justifyContent: "center",
        }}
      >
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
                      <Flex align="center">
                        <FiChevronDown />
                      </Flex>
                    </Space>

                    <Flex vertical className={clsx(style.brand_list)}>
                      {brands.map((brand) => {
                        if (
                          brand.categoryId === category._id &&
                          brand.categoryId === categoryActive
                        ) {
                          return (
                            <Link to={`/timkiem?s=${category.name}`}>
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
      </div>
    </>
  );
}

export default HeaderScreen;
