import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Col, Flex, Input, Layout, Row, Space, Image } from "antd";
import clsx from "clsx";
import style from "./header.module.css";
import { MenuUnfoldOutlined, SearchOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../store";
import { getAllProduct } from "../../slices/productSlice";
import Discount from "../discount";
import numeral from "numeral";

function HeaderScreen() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>();

  const location = useLocation();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);

  const handleSearch = (e: any) => {
    console.log("««««« e »»»»»", e.target.value);
    dispatch(getAllProduct({ search: e.target.value }));
    setSearch(e.target.value);
  };

  return (
    <div>
      <Row className={clsx(style.wrapper)}>
        <Col style={{ fontSize: "25px", fontWeight: "bold" }} md={12} xs={12}>
          TAA
        </Col>
        <Col xs={0} sm={8} md={8} lg={6}>
          <Flex style={{ fontSize: "15px" }} justify="space-between">
            <Link to="/home">
              <Space
                className={clsx(style.child_wrapper)}
                style={{
                  ...(location.pathname === "/home"
                    ? { textDecoration: "underline", fontWeight: "bold" }
                    : {}),
                }}
              >
                Home
              </Space>
            </Link>
            <Link to="/product">
              <Space
                className={clsx(style.child_wrapper)}
                style={{
                  ...(location.pathname === "/product"
                    ? { textDecoration: "underline", fontWeight: "bold" }
                    : {}),
                }}
              >
                Product
              </Space>
            </Link>
            <Link to="/profile">
              <Space
                className={clsx(style.child_wrapper)}
                style={{
                  ...(location.pathname === "/profile"
                    ? { textDecoration: "underline", fontWeight: "bold" }
                    : {}),
                }}
              >
                Profile
              </Space>
            </Link>
            <Link to="/cart">
              <Space
                className={clsx(style.child_wrapper)}
                style={{
                  ...(location.pathname === "/cart"
                    ? { textDecoration: "underline", fontWeight: "bold" }
                    : {}),
                }}
              >
                Cart
              </Space>
            </Link>
          </Flex>
        </Col>
        {/* res mobile */}
        <Col style={{ fontSize: "20px", textAlign: "right" }} xs={12} sm={0}>
          <div
            onClick={() => setIsOpen(!isOpen)}
            style={{ outline: "none", border: "none" }}
          >
            <MenuUnfoldOutlined />
          </div>
        </Col>
        <Space>
          {isOpen ? (
            <Flex className={clsx(style.menu_mobile)} vertical>
              <div style={{ fontSize: "35px" }}>TAA</div>

              <div>
                <Link
                  className={clsx(style.menu_mobile_child)}
                  onClick={() => setIsOpen(false)}
                  to="/home"
                >
                  <Space
                    style={{
                      ...(location.pathname === "/home"
                        ? { textDecoration: "underline", fontWeight: "bold" }
                        : {}),
                    }}
                  >
                    Home
                  </Space>
                </Link>
              </div>
              <div>
                <Link
                  className={clsx(style.menu_mobile_child)}
                  onClick={() => setIsOpen(false)}
                  to="/product"
                >
                  <Space
                    style={{
                      ...(location.pathname === "/product"
                        ? { textDecoration: "underline", fontWeight: "bold" }
                        : {}),
                    }}
                  >
                    Product
                  </Space>
                </Link>
              </div>
              <div>
                <Link
                  className={clsx(style.menu_mobile_child)}
                  onClick={() => setIsOpen(false)}
                  to="/profile"
                >
                  <Space
                    style={{
                      ...(location.pathname === "/profile"
                        ? { textDecoration: "underline", fontWeight: "bold" }
                        : {}),
                    }}
                  >
                    Profile
                  </Space>
                </Link>
              </div>
              <div>
                <Link
                  className={clsx(style.menu_mobile_child)}
                  onClick={() => setIsOpen(false)}
                  to="/cart"
                >
                  <Space
                    style={{
                      ...(location.pathname === "/cart"
                        ? { textDecoration: "underline", fontWeight: "bold" }
                        : {}),
                    }}
                  >
                    Cart
                  </Space>
                </Link>
              </div>
            </Flex>
          ) : (
            <></>
          )}
        </Space>
      </Row>

      <div
        style={{ background: "#f5f5f3", padding: "15px", marginTop: "70px" }}
      >
        <Row className={clsx(style.wrapper_sub)} gutter={24}>
          <Col style={{ fontSize: "20px", display: "flex" }} xs={0} sm={5}>
            <MenuUnfoldOutlined />
          </Col>
          <Col xs={24} sm={19}>
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
        </Row>
      </div>
    </div>
  );
}

export default HeaderScreen;
