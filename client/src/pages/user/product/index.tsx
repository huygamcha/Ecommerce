import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Flex, Row, Space, MenuProps, Empty, Pagination } from "antd";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getAllProduct,
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
    dispatch(getAllProduct({}));
    dispatch(getAllCategory());
    dispatch(getAllSupplier());
  }, [dispatch]);

  const handleDetail = (value: string) => {
    dispatch(getProductById(value));
  };

  const categoryItems: MenuProps["items"] = [];
  const supplierItems: MenuProps["items"] = [];
  categories.map((category) =>
    categoryItems?.push({
      key: category.name,
      label: (
        <Link
          to={`/sanpham/search/${category.name}`}
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
          to={`/sanpham/search/${supplier.name}`}
          onClick={(e) => dispatch(getProductBySuppliers(supplier._id))}
        >
          {supplier.name}
        </Link>
      ),
    })
  );

  return (
    <div className={clsx(style.wrapper_global, style.top_sale)}>
      <Row gutter={24}>
        <Col xs={24} sm={24}>
          <Row gutter={[14, 2]}>
            {products && error.message === "" ? (
              products.map((product) => (
                <Col
                  xs={12}
                  md={12}
                  lg={4}
                  style={{
                    paddingBottom: "10px",
                  }}
                >
                  <Link
                    onClick={() => handleDetail(product._id)}
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
