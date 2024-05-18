import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store";

import { Flex, Space, Image, Row, Col } from "antd";
import numeral from "numeral";
import { Link, useLocation, useNavigate } from "react-router-dom";
import style from "./MobileResultSearch.module.css";
import clsx from "clsx";

import axios from "axios";
import {
  getAllProductSearch,
  getProductById,
} from "../../../../slices/productSlice";

function MobileResultSearch() {
  const currentUser = localStorage.getItem("userInfor")
    ? JSON.parse(localStorage.getItem("userInfor")!)
    : undefined;
  const location = useLocation();

  const { productsSearch, isList } = useAppSelector((state) => state.products);
  const { tags } = useAppSelector((state) => state.tags);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location]);

  const handleDetail = (value: string, categoryId: string) => {
    localStorage.setItem("filter", JSON.stringify({ categoryId: categoryId }));
    localStorage.setItem("productId", JSON.stringify(value));

    dispatch(getProductById(value));
    dispatch(getAllProductSearch({ categoryId: categoryId }));
  };

  // search
  const handleSearchTag = (e: string) => {
    localStorage.setItem("filter", JSON.stringify({ searchTag: e }));
  };

  return (
    <div>
      <div
        style={{
          background: "#fff",
          padding: "20px",
          paddingTop: "10px",
        }}
        className={clsx(style.wrapper_global)}
      >
        <Space className={clsx(style.header_search_result)}>
          <Row>
            {productsSearch && isList ? (
              productsSearch.map((product, index) => (
                <Col key={index} span={24}>
                  <Link
                    className={clsx(style.header_search_items)}
                    to={`/sanpham/${product.slug}`}
                    onClick={() =>
                      handleDetail(product._id, product.categoryId)
                    }
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
                            {numeral(product.total).format("0,0$")} /{" "}
                            {product.unit}
                          </div>
                        </Space>
                      </Flex>
                    </Flex>
                  </Link>
                </Col>
              ))
            ) : (
              <div>
                <div className={clsx(style.header_tag)}>Tra cứu hàng đầu</div>
                <div className={clsx(style.tag_wrapper)}>
                  {tags ? (
                    tags.map((tag, index) => (
                      <Link
                        key={index}
                        onClick={() => handleSearchTag(tag._id)}
                        className={clsx(style.tag_item)}
                        to={`/timkiem?t=${tag.name}`}
                      >
                        {tag.name}
                      </Link>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            )}
          </Row>
        </Space>
      </div>
    </div>
  );
}

export default MobileResultSearch;
