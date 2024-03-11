import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Flex, Row, Space, MenuProps, Empty, Pagination } from "antd";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getAllProduct,
  getAllProductSearch,
  getProductByCategories,
  getProductById,
  getProductBySuppliers,
} from "../../../slices/productSlice";
import numeral from "numeral";
import { getAllCategory } from "../../../slices/categorySlice";
import { getAllSupplier } from "../../../slices/supplierSlice";
import clsx from "clsx";
import style from "./product.module.css";
import Discount from "../../../components/discount";

function ProductScreen() {
  const { products, error } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const { suppliers } = useAppSelector((state) => state.suppliers);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // const handlePagination = (e: number) => {
  //   dispatch(getAllProduct({ page: e }));
  //   navigate(`/product?page=${e}`);
  // };

  useEffect(() => {
    if (products.length === 0) dispatch(getAllProduct({}));
    if (categories.length === 0) dispatch(getAllCategory());
    if (suppliers.length === 0) dispatch(getAllSupplier());
  }, []);

  const handleDetail = (value: string, categoryId: string) => {
    localStorage.setItem("filter", JSON.stringify({ categoryId: categoryId }));
    localStorage.setItem("productId", JSON.stringify(value));
    dispatch(getProductById(value));
    dispatch(getAllProductSearch({ categoryId: categoryId }));
  };

  return (
    <div className={clsx(style.wrapper_global, style.top_sale)}>
      <Row>
        <Col xs={24} sm={24}>
          <Row gutter={[14, 14]}>
            {products && error.message === "" ? (
              products.map((product) => (
                <Col xs={12} md={12} lg={4} style={{}}>
                  <Link
                    onClick={() =>
                      handleDetail(product._id, product.categoryId)
                    }
                    to={`/sanpham/${product.slug}`}
                    className={clsx(style.wrapper)}
                  >
                    <Flex className={clsx(style.content)} vertical>
                      <Space className={clsx(style.content_discount)}>
                        <Discount discount={product.discount}></Discount>
                      </Space>

                      <Flex justify="center">
                        <img
                          src={product.pic}
                          className={clsx(style.content_img)}
                          alt=""
                        />
                      </Flex>
                      <Flex
                        vertical
                        justify="space-between"
                        style={{ padding: "20px" }}
                      >
                        <Space className={clsx(style.header_text)}>
                          {product.name}
                        </Space>
                        <Space className={clsx(style.header_discount)}>
                          {numeral(
                            (product.price * (100 - product.discount)) / 100
                          ).format("$0,0")}
                        </Space>
                        <del className={clsx(style.header_price)}>
                          {numeral(product.price).format("$0,0")}
                        </del>
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
            <Col xs={24}>
              {/* <Pagination
                onChange={handlePagination}
                defaultCurrent={1}
                pageSize={6}
                total={20}
              ></Pagination> */}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;
