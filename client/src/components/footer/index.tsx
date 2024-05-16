import { Col, Flex, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import style from "./footer.module.css";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../../store";
import { getAllFooter } from "../../slices/footerSlice";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { FaLocationCrosshairs, FaLocationDot } from "react-icons/fa6";
import { getAllLocation } from "../../slices/locationSlice";

const ListRender = ({
  title,
  specificColumn,
}: {
  title: string;
  specificColumn: number;
}) => {
  const { footers } = useAppSelector((state) => state.footers);
  return (
    <Col xs={0} sm={4}>
      {specificColumn === 4 ? (
        <>
          <h4 className={clsx(style.text_heading)}>{title}</h4>
          <Flex vertical>
            {footers.map((footer, index) =>
              footer.column === specificColumn ? (
                <>
                  {footer.optional ? (
                    <div key={index} className={clsx(style.item_optional)}>
                      <a
                        className={clsx(style.text_item_optional)}
                        target="_blank"
                        href={footer.url}
                        rel="noreferrer"
                      >
                        {footer.name}
                      </a>
                      <div>
                        <a
                          className={clsx(style.optional_item)}
                          href={`tel:${footer.optional}`}
                        >
                          {footer.optional}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <a
                      key={index}
                      className={clsx(style.text_item)}
                      target="_blank"
                      href={footer.url}
                      rel="noreferrer"
                    >
                      {footer.name}
                    </a>
                  )}
                </>
              ) : (
                <></>
              )
            )}
          </Flex>

          <h4 className={clsx(style.text_heading)}>Hỗ trợ thanh toán</h4>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <img
              className={clsx(style.payment_list)}
              src="https://cdn1.nhathuoclongchau.com.vn/visa_fdc3324c35.svg"
              alt=""
            />{" "}
            <img
              className={clsx(style.payment_list)}
              src="https://cdn1.nhathuoclongchau.com.vn/mtc_1ed684ff7c.svg"
              alt=""
            />
            <img
              className={clsx(style.payment_list)}
              src="https://cdn1.nhathuoclongchau.com.vn/jcb_7655e615ce.svg"
              alt=""
            />
            <img
              className={clsx(style.payment_list)}
              src="https://cdn1.nhathuoclongchau.com.vn/amex_2610a984a5.svg"
              alt=""
            />
            <img
              className={clsx(style.payment_list)}
              src="https://cdn1.nhathuoclongchau.com.vn/smalls/vnpay_1f73f546c4.svg"
              alt=""
            />
            <img
              className={clsx(style.payment_list)}
              src="https://cdn1.nhathuoclongchau.com.vn/zalopay_884e503cf9.svg"
              alt=""
            />
            <img
              className={clsx(style.payment_list)}
              src="https://cdn1.nhathuoclongchau.com.vn/smalls/momo_ebbd8eb9b0.svg"
              alt=""
            />
          </div>
        </>
      ) : (
        <>
          <h4 className={clsx(style.text_heading)}>{title}</h4>
          <Flex vertical>
            {footers.map((footer, index) =>
              footer.column === specificColumn ? (
                <>
                  {footer.optional ? (
                    <div key={index} className={clsx(style.item_optional)}>
                      <a
                        className={clsx(style.text_item_optional)}
                        target="_blank"
                        href={footer.url}
                        rel="noreferrer"
                      >
                        {footer.name}
                      </a>
                      <div>
                        <a
                          className={clsx(style.optional_item)}
                          href={`tel:${footer.optional}`}
                        >
                          {footer.optional}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={index}
                      to={`${footer.url}`}
                      className={clsx(style.text_item)}
                      // target="_blank"
                      // href={footer.url}
                      // rel="noreferrer"
                    >
                      {footer.name}
                    </Link>
                  )}
                </>
              ) : (
                <></>
              )
            )}
          </Flex>
        </>
      )}
    </Col>
  );
};
const ListRenderMobile = ({
  title,
  specificColumn,
}: {
  title: string;
  specificColumn: number;
}) => {
  const { footers } = useAppSelector((state) => state.footers);
  const [isShow, setIsShow] = useState<boolean>(
    specificColumn === 4 ? true : false
  );
  return (
    <Col className={clsx(style.wrapper_mobile)} xs={24} sm={0}>
      {specificColumn === 4 ? (
        <>
          <h4
            onClick={() => setIsShow(!isShow)}
            className={clsx(style.text_heading_mobile)}
          >
            <Flex justify="space-between">
              <Space style={{ textTransform: "uppercase" }}>{title} </Space>
              <Space>{isShow ? <IoChevronDown /> : <IoChevronUp />}</Space>
            </Flex>
          </h4>
          <Flex
            className={clsx(style.dropdown_item, isShow ? style.active : "")}
            vertical
          >
            {footers.map((footer, index) =>
              footer.column === specificColumn ? (
                <>
                  {footer.optional ? (
                    <div key={index} className={clsx(style.item_optional)}>
                      <a
                        className={clsx(style.text_item_mobile)}
                        target="_blank"
                        href={footer.url}
                        rel="noreferrer"
                      >
                        {footer.name}
                      </a>
                      <div>
                        <a
                          className={clsx(style.optional_item)}
                          href={`tel:${footer.optional}`}
                        >
                          {footer.optional}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <a
                      key={index}
                      className={clsx(style.text_item_mobile)}
                      target="_blank"
                      href={footer.url}
                      rel="noreferrer"
                    >
                      {footer.name}
                    </a>
                  )}
                </>
              ) : (
                <></>
              )
            )}
          </Flex>
        </>
      ) : (
        <>
          <h4
            onClick={() => setIsShow(!isShow)}
            className={clsx(style.text_heading_mobile)}
          >
            <Flex justify="space-between">
              <Space>{title} </Space>
              <Space>{isShow ? <IoChevronDown /> : <IoChevronUp />}</Space>
            </Flex>
          </h4>
          <Flex
            className={clsx(style.dropdown_item, isShow ? style.active : "")}
            vertical
          >
            {footers.map((footer, index) =>
              footer.column === specificColumn ? (
                <>
                  {footer.optional ? (
                    <div key={index} className={clsx(style.item_optional)}>
                      <a
                        className={clsx(style.text_item_mobile)}
                        target="_blank"
                        href={footer.url}
                        rel="noreferrer"
                      >
                        {footer.name}
                      </a>
                      <div>
                        <a
                          className={clsx(style.optional_item)}
                          href={`tel:${footer.optional}`}
                        >
                          {footer.optional}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={index}
                      to={`${footer.url}`}
                      className={clsx(style.text_item_mobile)}
                      // target="_blank"
                      // href={footer.url}
                      // rel="noreferrer"
                    >
                      {footer.name}
                    </Link>
                  )}
                </>
              ) : (
                <></>
              )
            )}
          </Flex>
        </>
      )}
    </Col>
  );
};

function FooterScreen() {
  const dispatch = useAppDispatch();
  const { footers } = useAppSelector((state) => state.footers);
  const { locations } = useAppSelector((state) => state.locations);

  useEffect(() => {
    if (footers.length === 0) dispatch(getAllFooter());
    if (locations.length === 0) dispatch(getAllLocation());
  }, []);

  return (
    <>
      <div style={{ background: "#2267de" }}>
        <Row
          className={clsx(style.global_wrapper, style.global_wrapper_direction)}
        >
          <Col>
            <Flex
              style={{
                margin: "5px 0px",
              }}
              align="center"
            >
              <FaLocationDot
                style={{
                  color: "#fff",
                  fontSize: "28px",
                  marginRight: "5px",
                }}
              />
              <Space className={clsx(style.direction_left_text)}>
                Xem địa chỉ cửa hàng
              </Space>
            </Flex>
          </Col>
          <Col>
            <div className={clsx(style.location_map_wrapper)}>
              {locations && locations.length > 0 && (
                <a
                  target="_blank"
                  href={locations[0].map}
                  rel="noreferrer"
                  className={clsx(style.location_map)}
                >
                  <Flex align="center">
                    <FaLocationCrosshairs
                      style={{
                        fontSize: "15px",
                        marginRight: "5px",
                      }}
                    />
                    <Space>Chỉ đường</Space>
                  </Flex>
                </a>
              )}
            </div>
          </Col>
        </Row>
      </div>
      <div style={{ background: "#fff" }}>
        <Row className={clsx(style.global_wrapper)}>
          <ListRender title="chính sách" specificColumn={1} />
          <ListRender title="danh mục" specificColumn={2} />
          <ListRender title="hỗ trợ" specificColumn={3} />
          <ListRender title="tổng đài" specificColumn={4} />
          <Col xs={0} sm={4}>
            <h4 className={clsx(style.text_heading)}>KẾT NỐI VỚI CHÚNG TÔI</h4>
            <Flex className={clsx(style.items)}>
              <a href="https://www.facebook.com/lehuynhhuy.taa">
                <img
                  style={{ width: "30px", height: "30px" }}
                  src="http://res.cloudinary.com/drqphlfn6/image/upload/v1707809091/vrvzmcykp5acusyvrvoa.png"
                  alt="facebook"
                />
              </a>
              <a href="https://zalo.me/0933110500">
                <img
                  style={{ width: "30px", height: "30px" }}
                  src="https://cdn1.nhathuoclongchau.com.vn/smalls/Logo_Zalo_979d41d52b.svg"
                  alt="facebook"
                />
              </a>
            </Flex>
          </Col>

          {/* mobile */}
          <ListRenderMobile title="TỔNG ĐÀI" specificColumn={4} />
          <Col className={clsx(style.wrapper_mobile)} xs={24} sm={0}>
            <h4 className={clsx(style.text_heading_mobile)}>
              <Flex justify="space-between">
                <Space style={{ textTransform: "uppercase" }}>
                  Hỗ trợ thanh toán
                </Space>
              </Flex>
            </h4>
            <Flex style={{ flexWrap: "wrap" }}>
              <img
                className={clsx(style.payment_list)}
                src="https://cdn1.nhathuoclongchau.com.vn/visa_fdc3324c35.svg"
                alt=""
              />{" "}
              <img
                className={clsx(style.payment_list)}
                src="https://cdn1.nhathuoclongchau.com.vn/mtc_1ed684ff7c.svg"
                alt=""
              />
              <img
                className={clsx(style.payment_list)}
                src="https://cdn1.nhathuoclongchau.com.vn/jcb_7655e615ce.svg"
                alt=""
              />
              <img
                className={clsx(style.payment_list)}
                src="https://cdn1.nhathuoclongchau.com.vn/amex_2610a984a5.svg"
                alt=""
              />
              <img
                className={clsx(style.payment_list)}
                src="https://cdn1.nhathuoclongchau.com.vn/smalls/vnpay_1f73f546c4.svg"
                alt=""
              />
              <img
                className={clsx(style.payment_list)}
                src="https://cdn1.nhathuoclongchau.com.vn/zalopay_884e503cf9.svg"
                alt=""
              />
              <img
                className={clsx(style.payment_list)}
                src="https://cdn1.nhathuoclongchau.com.vn/smalls/momo_ebbd8eb9b0.svg"
                alt=""
              />
            </Flex>
          </Col>
          <Col className={clsx(style.wrapper_mobile)} xs={24} sm={0}>
            <h4 className={clsx(style.text_heading_mobile)}>
              <Flex justify="space-between">
                <Space>KẾT NỐI VỚI CHÚNG TÔI </Space>
                <Flex
                  className={clsx(
                    style.dropdown_item,
                    style.active,
                    style.dropdown_item_social
                  )}
                >
                  <a href="https://www.facebook.com/lehuynhhuy.taa">
                    <img
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "10px",
                      }}
                      src="http://res.cloudinary.com/drqphlfn6/image/upload/v1707809091/vrvzmcykp5acusyvrvoa.png"
                      alt="facebook"
                    />
                  </a>
                  <a href="https://zalo.me/0933110500">
                    <img
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "10px",
                      }}
                      src="https://cdn1.nhathuoclongchau.com.vn/smalls/Logo_Zalo_979d41d52b.svg"
                      alt="facebook"
                    />
                  </a>
                </Flex>
              </Flex>
            </h4>
          </Col>
          <ListRenderMobile title="chính sách" specificColumn={1} />
          <ListRenderMobile title="hỗ trợ" specificColumn={2} />
          <ListRenderMobile title="TÌM HIỂU THÊM" specificColumn={3} />

          <Col style={{ textAlign: "center", margin: "30px 0px" }} span={24}>
            © 2024 Cửa hàng Pam
          </Col>
        </Row>
      </div>
    </>
  );
}

export default FooterScreen;
