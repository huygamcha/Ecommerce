import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Col, Flex, Input, Row, Space, Image, Badge } from "antd";
import clsx from "clsx";
import style from "./header.module.css";
import {
  LogoutOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../store";
import { getAllProduct } from "../../slices/productSlice";
import Discount from "../discount";
import numeral from "numeral";
import { logout } from "../../slices/authSlice";
import {
  createCartFromCustomer,
  resetCartNotification,
} from "../../slices/cartSlice";

function HeaderScreen() {
  const currentUser = localStorage.getItem("userInfor")
    ? JSON.parse(localStorage.getItem("userInfor")!)
    : undefined;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>();
  const navigate = useNavigate();
  // notifications
  const [show, setShow] = useState(false);

  const location = useLocation();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);
  const { add } = useAppSelector((state) => state.carts);

  const handleSearch = (e: any) => {
    dispatch(getAllProduct({ search: e.target.value }));
    setSearch(e.target.value);
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
    console.log("««««« add »»»»»", add);
    if (add > 0) {
      setShow(true);
    }
  }, [add]);

  console.log("««««« add day »»»»»", add);
  return (
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
                    to={`/product/${product._id}`}
                    onClick={() => setSearch("")}
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
                <Badge dot={show} status="warning">
                  <ShoppingCartOutlined className={clsx(style.button_icon)} />
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
                  <Space>{currentUser ? currentUser.name : "Đăng nhập"}</Space>
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
    </>
  );
}

export default HeaderScreen;
