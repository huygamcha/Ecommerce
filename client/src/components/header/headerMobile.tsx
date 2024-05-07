import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Col, Flex, Input, Row, Space } from "antd";
import clsx from "clsx";
import style from "./header.module.css";
import { SearchOutlined } from "@ant-design/icons";
import { BsChevronLeft } from "react-icons/bs";

import { TiDelete } from "react-icons/ti";
import { useAppDispatch, useAppSelector } from "../../store";
import { getAllProductSearch, hasList } from "../../slices/productSlice";
import { getAllTag } from "../../slices/tagSlice";
import { getAllBrand } from "../../slices/brandSlice";
import { getAllCategory } from "../../slices/categorySlice";
import { useOutsideClick } from "../OutsideClick/index";

function HeaderScreenMobile() {
  const currentUser = localStorage.getItem("userInfor")
    ? JSON.parse(localStorage.getItem("userInfor")!)
    : undefined;

  const filter = localStorage.getItem("filter")
    ? JSON.parse(localStorage.getItem("filter")!)
    : undefined;
  // hiển thị danh sách tìm kiém
  const [isList, setIsList] = useState<boolean>(false);
  // tìm kiếm
  const [search, setSearch] = useState<string>();

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
  const { tags } = useAppSelector((state) => state.tags);

  const handleSearch = (e: any) => {
    dispatch(getAllProductSearch({ search: e.target.value }));
    dispatch(hasList({ isList: true }));
    setSearch(e.target.value);
    if (e.target.value === "") {
      dispatch(hasList({ isList: false }));
    }
  };

  // search
  const handleSearchTag = (e: string) => {
    localStorage.setItem("filter", JSON.stringify({ searchTag: e }));
  };

  useEffect(() => {
    setIsList(false);
  }, [location]);

  useEffect(() => {
    if (tags.length === 0) dispatch(getAllTag());
    if (brands.length === 0) dispatch(getAllBrand());
    if (categories.length === 0) dispatch(getAllCategory());
  }, []);

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
                      <BsChevronLeft
                        onClick={() => navigate(-1)}
                        className={clsx(style.button_icon)}
                      />
                    </Space>
                  </Col>
                  <Col xs={22} sm={0}>
                    <Flex>
                      <Input
                        autoFocus
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
                    </Flex>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
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
                    to={`/timkiem?s=${tag.name}`}
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
    </>
  );
}

export default HeaderScreenMobile;
