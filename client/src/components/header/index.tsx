import React, { useEffect, useState } from "react";
import { Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Flex,
  Input,
  Layout,
  Row,
  Space,
  Image,
  Badge,
  Avatar,
} from "antd";
import clsx from "clsx";
import style from "./header.module.css";
import {
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
import { createCartFromCustomer } from "../../slices/cartSlice";

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
    navigate(-1);
  };

  // notifications
  const handleCart = () => {
    setShow(false);
  };

  useEffect(() => {
    if (add > 0) {
      setShow(true);
    }
  }, [add]);

  return (
    <>
      {" "}
      <Row justify="end" className={clsx(style.wrapper_try)}>
        <Col xs={4} sm={2} md={2} lg={2}>
          <Space className={clsx(style.header_text)}>Pam</Space>
        </Col>
        <Col xs={17} sm={12} md={12} lg={16}>
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
        <Col xs={0} sm={10} md={10} lg={6}>
          <Flex justify="end">
            <Space
              style={{ marginRight: "14px" }}
              className={clsx(style.button_header)}
            >
              <UserDeleteOutlined className={clsx(style.button_icon)} />
              <Link className={clsx(style.button_header_text)} to="/auth/login">
                <Space>{currentUser ? currentUser.name : "Đăng nhập"}</Space>
              </Link>
            </Space>

            <Space
              className={clsx(style.button_header, style.button_background)}
            >
              <ShoppingCartOutlined className={clsx(style.button_icon)} />
              <Link className={clsx(style.button_header_text)} to="/cart">
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
              <div style={{ fontSize: "35px" }}>Pam</div>

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
