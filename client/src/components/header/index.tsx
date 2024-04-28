import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Col, Flex, Input, Row, Space, Image, Badge } from "antd";
import clsx from "clsx";
import style from "./header.module.css";
import {
  LogoutOutlined,
  SearchOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaCartShopping, FaBars } from "react-icons/fa6";
import { HiOutlineXMark } from "react-icons/hi2";

import { TiDelete } from "react-icons/ti";
import { FaPhoneAlt } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../store";
import { getAllProductSearch, getProductById } from "../../slices/productSlice";
import numeral from "numeral";
import { logout } from "../../slices/authSlice";
import {
  createCartFromCustomer,
  getAllCart,
  resetCartNotification,
} from "../../slices/cartSlice";
import { getAllTag } from "../../slices/tagSlice";
import { getAllBrand } from "../../slices/brandSlice";
import { getAllCategory } from "../../slices/categorySlice";
import { useOutsideClick } from "../OutsideClick/index";

const ListItemBrand = ({
  categoryId,
  categoryName,
  onClickBrand,
}: {
  categoryId: string;
  categoryName: string;
  categoryActive: string;
  onClickBrand: (categoryId: string, brandId: string) => void;
}) => {
  const { brands } = useAppSelector((state) => state.brands);
  const [isShow, setIsShow] = useState<boolean>(false);

  return (
    <>
      <Flex
        className={clsx(style.brand_item_icon)}
        onClick={() => setIsShow(!isShow)}
        align="center"
      >
        {!isShow ? (
          <FiChevronDown style={{ fontSize: "20px" }} />
        ) : (
          <FiChevronUp style={{ fontSize: "20px" }} />
        )}
      </Flex>
      <Flex
        style={{
          background: "#eaeffa",
          borderRadius: "10px",
        }}
        vertical
      >
        {brands.map((brand) => {
          if (brand.categoryId === categoryId && isShow) {
            return (
              <Link to={`/timkiem?s=${categoryName}`}>
                <Flex
                  onClick={(e) => {
                    // ngăn chặn việc gọi lên handleSearchMenu ở hàm, đánh đổi reload lại trang
                    e.stopPropagation();
                    onClickBrand(categoryId, brand._id);
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
    </>
  );
};

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
  // xác định chiều dài để thu gọn header mobile
  const [headerShowMobile, setHeaderShowMobile] = useState<boolean>(false);
  // set mobile de dung useRef, bởi vì useRef chỉ được sử dụng 1 lần, nên phải ẩn useRef trên pc
  // đi để cho useRef của mobile được hoạt động trong khi sử dụng hàm useOutsideAlerter
  //  nếu không có thì bị lỗi ko thẻ chọn sản phẩm trên mobile được
  const [isMobile, setIsMobile] = useState<boolean>(false);

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
  const { carts } = useAppSelector((state) => state.carts);

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
    if (carts.length === 0) dispatch(getAllCart());
  }, []);

  //click
  const handleDetail = (value: string) => {
    dispatch(getProductById(value));
    localStorage.setItem("productId", JSON.stringify(value));
    console.log("««««« value id id »»»»»", value);
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
        // console.log("««««« ref.current »»»»»", ref.current);
        // console.log("««««« event »»»»»", event.target);
        if (ref.current && !ref.current.contains(event.target)) {
          // list kết quả search ra được
          setIsList(false);
          // thanh menu mobile
          setIsOpen(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  // kiểm tra chiều dài để hiển thị header
  useEffect(() => {
    function handleScrollHeader() {
      if (window.innerWidth <= 575) {
        setIsMobile(true);
      }
      if (window.scrollY > 200) {
        setHeaderShowMobile(true);
      } else {
        setHeaderShowMobile(false);
      }
    }

    document.addEventListener("scroll", handleScrollHeader);
    return () => {
      document.removeEventListener("scroll", handleScrollHeader);
    };
  });
  // // khi bấm ra ngoài thanh kết quả sẽ tắt
  const wrapperRef = useRef(null);
  // // khi bấm ra ngoài thanh kết quả sẽ tắt
  // const wrapperRefMobile = useRef(null);
  // // // khi bấm ra ngoài thanh menu phụ sẽ  tắt
  const menuMobileRef = useRef(null);
  // khi scroll
  useOutsideAlerter(wrapperRef);
  useOutsideAlerter(menuMobileRef);
  // useOutsideAlerterMobile(wrapperRefMobile);

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
          {/* mobile */}
          {!headerShowMobile ? (
            <Col
              style={{
                transition: ".3s linear",
              }}
              span={24}
            >
              <Row style={{ display: "flex", alignItems: "center" }}>
                <Col xs={2} sm={0}>
                  <Space>
                    <FaBars
                      onClick={() => setIsOpen(!isOpen)}
                      className={clsx(style.button_icon)}
                    />
                  </Space>
                </Col>
                <Col xs={20} sm={0}>
                  <Link to="/" className={clsx(style.header_text)}>
                    <img
                      src="https://cms-prod.s3-sgn09.fptcloud.com/smalls/Logo_LC_Default_2e36f42b6b.svg"
                      alt=""
                    />
                  </Link>
                </Col>
                <Col xs={2} sm={0}>
                  <Link
                    onClick={handleCart}
                    className={clsx(style.button_header_text)}
                    to="/cart"
                    style={{ display: "flex", justifyContent: "end" }}
                  >
                    <div className={clsx(style.button_header_text)}>
                      <FaCartShopping
                        className={clsx(style.cart_notification_wrapper)}
                      />
                      <div className={clsx(style.cart_notification_item)}>
                        {carts ? carts.length : 0}
                      </div>
                    </div>
                  </Link>
                </Col>
                <Col xs={24} sm={0}>
                  <Flex>
                    <Input
                      type="text"
                      className={clsx(style.header_search_input)}
                      placeholder="Tìm kiếm sản phẩm"
                      onClick={() => navigate("/mobile")}
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

                    {/* search result mobile */}
                    <Space
                      ref={wrapperRef}
                      className={clsx(style.header_search_result, style.active)}
                    >
                      {isList && productsSearch ? (
                        productsSearch.map((product) => (
                          <Link
                            // pc
                            className={clsx(style.header_search_items)}
                            to={`/sanpham/${product.slug}`}
                            onClick={() => handleDetail(product._id)}
                          >
                            <Flex>
                              <Space style={{ marginRight: "10px" }}>
                                <Image
                                  className={clsx(
                                    style.header_search_items_img
                                  )}
                                  src={product?.pic}
                                ></Image>
                              </Space>
                              <Flex vertical>
                                <div className={clsx(style.header_name)}>
                                  {product.name}
                                </div>
                                <Space style={{ fontWeight: "bold" }}>
                                  <div className={clsx(style.header_price)}>
                                    {" "}
                                    {numeral(product.total).format(
                                      "0,0$"
                                    )} / {product.unit}
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
              </Row>
            </Col>
          ) : (
            <Col span={24}>
              <Row>
                <Col
                  style={{
                    transition: ".3s linear",
                  }}
                  span={24}
                >
                  <Row style={{ display: "flex", alignItems: "center" }}>
                    <Col xs={2} sm={0}>
                      <Space>
                        <FaBars
                          onClick={() => setIsOpen(!isOpen)}
                          className={clsx(style.button_icon)}
                        />
                      </Space>
                    </Col>
                    <Col xs={20} sm={0}>
                      <Flex>
                        <Input
                          onClick={() => navigate("/mobile")}
                          type="text"
                          className={clsx(style.header_search_input)}
                          placeholder="Tìm kiếm sản phẩm"
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
                      </Flex>
                    </Col>
                    <Col xs={2} sm={0}>
                      <Link
                        onClick={handleCart}
                        className={clsx(style.button_header_text)}
                        to="/cart"
                        style={{ display: "flex", justifyContent: "end" }}
                      >
                        <div className={clsx(style.button_header_text)}>
                          <FaCartShopping
                            className={clsx(style.cart_notification_wrapper)}
                          />
                          <div className={clsx(style.cart_notification_item)}>
                            {carts ? carts.length : 0}
                          </div>
                        </div>
                      </Link>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          )}

          {/* pc */}
          <Col xs={0} sm={2} md={2} lg={5}>
            <Link to="/" className={clsx(style.header_text)}>
              <img
                src="https://cms-prod.s3-sgn09.fptcloud.com/smalls/Logo_LC_Default_2e36f42b6b.svg"
                alt=""
              />
            </Link>
          </Col>
          <Col xs={0} sm={14} md={13} lg={13}>
            <Flex>
              <Input
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

              {/* search result pc */}
              <Space
                ref={!isMobile ? wrapperRef : null}
                className={clsx(style.header_search_result, style.active)}
              >
                {isList && productsSearch ? (
                  productsSearch.map((product) => (
                    <Link
                      // pc
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
                          <div className={clsx(style.header_name)}>
                            {product.name}
                          </div>
                          <Space style={{ fontWeight: "bold" }}>
                            <div>
                              {" "}
                              {numeral(product.total).format("0,0$")} /{" "}
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
                  <div className={clsx(style.cart_notification_wrapper)}>
                    <FaCartShopping />
                    <div className={clsx(style.cart_notification_item)}>
                      {carts ? carts.length : 0}
                    </div>
                  </div>
                  <Space style={{ marginLeft: "4px" }}>Giỏ hàng</Space>
                </Link>
              </Space>
            </Flex>
          </Col>

          {/* open mobile */}
          <Space>
            {isOpen ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className={clsx(style.menu_mobile_wrapper)}
              >
                <Flex
                  ref={menuMobileRef}
                  className={clsx(style.menu_mobile)}
                  vertical
                >
                  <Flex justify="space-between">
                    <Link
                      onClick={() => setIsOpen(false)}
                      to="/"
                      className={clsx(style.header_text)}
                    >
                      <img
                        src="https://cms-prod.s3-sgn09.fptcloud.com/smalls/Logo_LC_Default_2e36f42b6b.svg"
                        alt=""
                      />
                    </Link>
                    <Space>
                      <HiOutlineXMark
                        onClick={() => setIsOpen(false)}
                        style={{ fontSize: "24px" }}
                      />
                    </Space>
                  </Flex>

                  {/* danh mục và thương hiệu */}
                  <Row>
                    <Col span={24}>
                      <Flex
                        className={clsx(style.auth_wrapper_mobile)}
                        vertical
                      >
                        <Space className={clsx(style.auth_wrapper_mobile_text)}>
                          Đăng nhập để hưởng những đặc quyền dành riêng cho hội
                          viên
                        </Space>
                        <Flex justify="space-between">
                          <Space className={clsx(style.add_to_cart)}>
                            Đăng nhập
                          </Space>
                          <Space className={clsx(style.buy_now)}>Đăng kí</Space>
                        </Flex>
                      </Flex>
                    </Col>
                    <Col span={24}>
                      {categories ? (
                        categories.map((category) => (
                          <div>
                            <Flex
                              vertical
                              justify="space-between"
                              className={clsx(style.brand_item)}
                            >
                              <Link
                                onClick={(e) => {
                                  handleSearchMenu(category._id, "");
                                }}
                                to={`/timkiem?s=${category.name}`}
                              >
                                <div
                                  style={{ width: "70%" }}
                                  onClick={() => setIsOpen(false)}
                                >
                                  {category.name}
                                </div>
                              </Link>

                              <ListItemBrand
                                // config mobile arrow function callback from component children
                                onClickBrand={handleSearchMenu}
                                categoryId={category._id}
                                categoryName={category.name}
                                categoryActive={category._id}
                              />
                            </Flex>
                          </div>
                        ))
                      ) : (
                        <></>
                      )}
                    </Col>
                  </Row>

                  <Flex className={clsx(style.contactNowMobile_wrapper)}>
                    <Flex className={clsx(style.contactNowMobile)}>
                      <Space>
                        <FaPhoneAlt
                          className={clsx(style.contactNowMobile_phone_icon)}
                        />
                      </Space>
                      <Space
                        className={clsx(style.contactNowMobile_phone_text)}
                      >
                        Tư vấn: 1800 6928 (Miễn phí)
                      </Space>
                    </Flex>
                  </Flex>
                </Flex>
              </div>
            ) : (
              <></>
            )}
          </Space>
        </Row>
      </div>

      {/* tag */}
      <div
        style={{
          background: "#256cdf",
          display: "flex",
          justifyContent: "center",
        }}
      >
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
          zIndex: 9,
          boxShadow: "rgba(0, 0, 0, 0.05) 0px 0.4px 0px",
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
