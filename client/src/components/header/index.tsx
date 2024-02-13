import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Col, Flex, Input, Layout, Row, Space } from "antd";
import clsx from "clsx";
import style from "./header.module.css";
import { MenuUnfoldOutlined, SearchOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../store";
import { getAllProduct } from "../../slices/productSlice";

function HeaderScreen() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const location = useLocation();
  const dispatch = useAppDispatch();

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
                onChange={(e) =>
                  dispatch(getAllProduct({ search: e.target.value }))
                }
                className={clsx(style.header_search_input)}
                placeholder="Tìm kiếm sản phẩm"
              ></Input>
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
