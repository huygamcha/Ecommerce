import React, { memo, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Col, Flex, Input, Row, Space, Image, Badge } from "antd";

import clsx from "clsx";
import style from "./header.module.css";
import { LogoutOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { RiSearchLine } from "react-icons/ri";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaCartShopping, FaBars } from "react-icons/fa6";
import { HiOutlineXMark } from "react-icons/hi2";
import { RiHome5Fill } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { useAppDispatch, useAppSelector } from "../../store";
import { getAllProductSearch, getProductById } from "../../slices/productSlice";
import numeral from "numeral";
import { logout } from "../../slices/authSlice";
import {
  createCartFromCustomer,
  getAllCart,
  resetCartNotification,
} from "../../slices/cartSlice";
import { getAllTag, getTagByName } from "../../slices/tagSlice";
import { getAllBrand } from "../../slices/brandSlice";
import useDebounceCustom from "../../hooks/useDebounce";
import { LazyLoadImage } from "react-lazy-load-image-component";

const ListItemBrand = memo(
  ({
    categoryId,
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
          className={clsx(style.brand_list_mobile)}
        >
          {brands.map((brand, index) => {
            if (brand.categoryId === categoryId && isShow) {
              return (
                <Link key={index} to={`/timkiem?b=${brand.name}`}>
                  <Flex
                    onClick={(e) => {
                      // ngăn chặn việc gọi lên handleSearchMenu ở hàm,
                      // đánh đổi reload lại trang
                      e.stopPropagation();
                      // e.preventDefault();
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
  }
);

function HeaderScreen() {
  const currentUser = localStorage.getItem("userInfor")
    ? JSON.parse(localStorage.getItem("userInfor")!)
    : undefined;

  // mở tabmobile
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // hiển thị danh sách tìm kiém
  const [isList, setIsList] = useState<boolean>(false);
  // tìm kiếm
  const [search, setSearch] = useState<string>("");
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

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { productsSearch } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const { brands } = useAppSelector((state) => state.brands);
  const { add } = useAppSelector((state) => state.carts);
  const { tags } = useAppSelector((state) => state.tags);
  const { carts } = useAppSelector((state) => state.carts);

  // khi search thay đổi thì debouncedSearchItem sẽ được gọi
  const debouncedSearchItem = useDebounceCustom({
    inputValue: search,
    delay: 400,
  });
  useEffect(() => {
    if (debouncedSearchItem) {
      dispatch(getAllProductSearch({ search: debouncedSearchItem }));
    }
  }, [debouncedSearchItem, dispatch]);

  const handleSearch = (e: any) => {
    // fix lỗi gọi api khi click vào
    if (e.type !== "focus") {
      // dispatch(getAllProductSearch({ search: e.target.value }));
      setIsList(true);
      setSearch(e.target.value);
      if (e.target.value === "") {
        setIsList(false);
      }
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

  // add sản phẩm thì show hiện thông báo
  useEffect(() => {
    if (add > 0) {
      setShow(true);
    }
  }, [add]);

  // khi mở được thanh menu của mobile thì ngăn sự kiện lăn chuột ở sau modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  useEffect(() => {
    setIsList(false);
  }, [location]);

  useEffect(() => {
    if (tags.length === 0) dispatch(getAllTag());
    if (brands.length === 0) dispatch(getAllBrand());
    // huyg bên mobile đã gọi rồi nên ở đây ẩn lại
    // if (categories.length === 0) dispatch(getAllCategory());
    if (carts.length === 0) dispatch(getAllCart());
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

  // useREF chỉ được sử dụng 1 lần trên cùng thời điểm, nếu tuỳ hợp phải xử lí để ẩn các useRef còn lại
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

  // // // khi bấm ra ngoài thanh menu phụ sẽ tắt
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
                  <Link to="/" className={clsx(style.header_image)}>
                    <LazyLoadImage
                      effect="blur"
                      src="https://pub-50bb58cfabdd4b93abb4e154d0eada9e.r2.dev/fff.png"
                      alt="product"
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
                      <RiSearchLine />
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
                      // ref={wrapperRef}
                      className={clsx(style.header_search_result, style.active)}
                    >
                      {isList &&
                        productsSearch &&
                        productsSearch.map((product, index) => (
                          <Link
                            // pc
                            key={index}
                            className={clsx(style.header_search_items)}
                            to={`/sanpham/${product.slug}`}
                            onClick={() => handleDetail(product._id)}
                          >
                            <Flex>
                              <Space style={{ marginRight: "10px" }}>
                                <LazyLoadImage
                                  effect="blur"
                                  className={clsx(
                                    style.header_search_items_img
                                  )}
                                  src={product?.pic}
                                  alt="product"
                                />
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
                        ))}
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
                          <RiSearchLine />
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
            <Link to="/" className={clsx(style.header_image)}>
              <LazyLoadImage
                effect="blur"
                src="https://pub-50bb58cfabdd4b93abb4e154d0eada9e.r2.dev/fff.png"
                alt="header"
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
                <RiSearchLine />
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
                ref={!isMobile && !isOpen ? wrapperRef : null}
                className={clsx(style.header_search_result, style.active)}
              >
                {isList &&
                  productsSearch &&
                  productsSearch.map((product, index) => (
                    <Link
                      key={index}
                      // pc
                      className={clsx(style.header_search_items)}
                      to={`/sanpham/${product.slug}`}
                      onClick={() => handleDetail(product._id)}
                    >
                      <Flex>
                        <Space style={{ marginRight: "10px" }}>
                          <LazyLoadImage
                            effect="blur"
                            className={clsx(style.header_search_items_img)}
                            src={product?.pic}
                            alt="product"
                          />
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
                  ))}
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

          {/* open mobile navigation*/}
          <Space>
            {isOpen && (
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
                      className={clsx(style.header_image)}
                    >
                      <LazyLoadImage
                        effect="blur"
                        src="https://pub-50bb58cfabdd4b93abb4e154d0eada9e.r2.dev/LOGO%20xanh.png"
                        alt="header"
                      />
                    </Link>
                    <Space>
                      <HiOutlineXMark
                        onClick={() => setIsOpen(false)}
                        style={{ fontSize: "24px" }}
                      />
                    </Space>
                  </Flex>

                  {/* danh mục và thương hiệu mobile */}
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
                      {categories &&
                        categories.map((category, index) => (
                          <div key={index}>
                            <Flex
                              vertical
                              justify="space-between"
                              className={clsx(style.brand_item)}
                            >
                              <Link
                                onClick={(e) => {
                                  handleSearchMenu(category._id, "");
                                }}
                                to={`/timkiem?c=${category.name}`}
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
                        ))}
                      <Link
                        style={{ display: "flex", alignItems: "center" }}
                        className={clsx(style.hethongcuahang, style.brand_item)}
                        onClick={() => setIsOpen(false)}
                        to={"/hethongcuahang"}
                      >
                        <RiHome5Fill style={{ marginRight: "4px" }} />
                        Hệ thống cửa hàng
                      </Link>
                    </Col>
                  </Row>

                  <a href="https://zalo.me/0933110500">
                    <Flex className={clsx(style.contactNowMobile_wrapper)}>
                      <Flex className={clsx(style.contactNowMobile)}>
                        <Space>
                          <LazyLoadImage
                            effect="blur"
                            className={clsx(style.contactNowMobile_phone_icon)}
                            src="https://cdn1.nhathuoclongchau.com.vn/smalls/Logo_Zalo_979d41d52b.svg"
                            alt="zalo"
                          />
                        </Space>
                        <Space
                          className={clsx(style.contactNowMobile_phone_text)}
                        >
                          Tư vấn qua Zalo 24/7
                        </Space>
                      </Flex>
                    </Flex>
                  </a>
                </Flex>
              </div>
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
              {tags &&
                tags.map((tag, index) => (
                  <Link
                    key={index}
                    onClick={() => handleSearchTag(tag._id)}
                    className={clsx(style.tag_item)}
                    to={`/timkiem?t=${tag.name}`}
                  >
                    {tag.name}
                  </Link>
                ))}
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
          <Col span={20} className={clsx(style.menu_sub)}>
            {categories &&
              categories.map((category, index) => (
                <React.Fragment key={index}>
                  <Link
                    onMouseEnter={() => setCategoryActive(category._id)}
                    onMouseLeave={() => setCategoryActive("")}
                    onClick={(e) => {
                      handleSearchMenu(category._id, "");
                    }}
                    to={`/timkiem?c=${category.name}`}
                  >
                    <div className={clsx(style.brand_item)}>
                      {category.name}
                      <Flex style={{ marginLeft: "2px" }} align="center">
                        <FiChevronDown />
                      </Flex>
                    </div>

                    <Flex
                      vertical
                      className={clsx(
                        style.brand_list,
                        style.brand_list_mobile
                      )}
                    >
                      {brands.map((brand, index) => {
                        if (
                          brand.categoryId === category._id &&
                          brand.categoryId === categoryActive
                        ) {
                          return (
                            <Link key={index} to={`/timkiem?b=${brand.name}`}>
                              <Flex
                                onClick={(e) => {
                                  // ngăn chặn việc gọi lên handleSearchMenu ở hàm, đánh đổi reload lại trang
                                  e.stopPropagation();
                                  // e.preventDefault();
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
                </React.Fragment>
              ))}
          </Col>
          <Col span={4}>
            <Link
              style={{ display: "flex", alignItems: "center" }}
              className={clsx(style.hethongcuahang)}
              to={"/hethongcuahang"}
            >
              <RiHome5Fill style={{ marginRight: "4px" }} />
              Hệ thống cửa hàng
            </Link>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default HeaderScreen;
