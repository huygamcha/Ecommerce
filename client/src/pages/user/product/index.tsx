import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import {
  Col,
  Flex,
  Row,
  Space,
  Image,
  Dropdown,
  Button,
  MenuProps,
  Empty,
  Pagination,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getAllProduct,
  getProductByCategories,
  getProductBySuppliers,
} from "../../../slices/productSlice";
import numeral from "numeral";
import { getAllCategory } from "../../../slices/categorySlice";
import { getAllSupplier } from "../../../slices/supplierSlice";
import clsx from "clsx";
import style from "./product.module.css";

function ProductScreen() {
  const { products, error } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const { suppliers } = useAppSelector((state) => state.suppliers);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const param = useParams();
  const handlePagination = (e: number) => {
    console.log("««««« e »»»»»", e);
  };

  useEffect(() => {
    dispatch(getAllProduct());
    dispatch(getAllCategory());
    dispatch(getAllSupplier());
  }, [dispatch]);

  const categoryItems: MenuProps["items"] = [];
  const supplierItems: MenuProps["items"] = [];
  categories.map((category) =>
    categoryItems?.push({
      key: category.name,
      label: (
        <Link
          to={`/product/search/${category.name}`}
          onClick={(e) => dispatch(getProductByCategories(category._id))}
        >
          {category.name}
        </Link>
      ),
    })
  );
  suppliers.map((supplier) =>
    supplierItems?.push({
      key: supplier.name,
      label: (
        <Link
          to={`/product/search/${supplier.name}`}
          onClick={(e) => dispatch(getProductBySuppliers(supplier._id))}
        >
          {supplier.name}
        </Link>
      ),
    })
  );

  return (
    <div style={{ padding: "15px", background: "#fff" }}>
      <Row gutter={24}>
        <Col xs={0} sm={5}>
          search
          <Row>
            <Col>
              <Dropdown menu={{ items: categoryItems }} placement="bottom">
                <Button> Search by category</Button>
              </Dropdown>
            </Col>
          </Row>
          <Row>
            <Col>
              <Dropdown menu={{ items: supplierItems }} placement="bottom">
                <Button> Search by supplier</Button>
              </Dropdown>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={19}>
          <Row gutter={30}>
            {products && error === "" ? (
              products.map((product) => (
                <Col xs={24} sm={8} style={{ paddingBottom: "25px" }}>
                  <Link
                    to={`/product/${product.name}`}
                    className={clsx(style.wrapper)}
                  >
                    <Flex
                      style={{
                        background: "#f5f5f5",
                        borderRadius: "5px",
                      }}
                      vertical
                    >
                      <Space>
                        <img
                          src={product.pic}
                          style={{
                            height: "300px",
                            width: "100%",
                            borderTopLeftRadius: "5px",
                            borderTopRightRadius: "5px",
                          }}
                          alt=""
                        />
                      </Space>
                      <Flex justify="space-between" style={{ padding: "20px" }}>
                        <Space className={clsx(style.header_text)}>
                          {product.name}
                        </Space>
                        <Space>{numeral(product.price).format("$0,0.0")}</Space>
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
            <Col flex="end">
              <Pagination
                onChange={handlePagination}
                defaultCurrent={1}
                pageSize={6}
                total={20}
              ></Pagination>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;
