import { Col, Flex, Row, Space } from "antd";
import React, { useEffect } from "react";
import style from "./footer.module.css";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../../store";
import { getAllFooter } from "../../slices/footerSlice";

function FooterScreen() {
  const dispatch = useAppDispatch();
  const { footers } = useAppSelector((state) => state.footers);

  useEffect(() => {
    dispatch(getAllFooter());
  }, []);

  return (
    <div className={clsx(style.global_wrapper)}>
      <Row justify="space-between">
        <Col xs={24} sm={4}>
          <h4 className={clsx(style.text_heading)}>VỀ CHÚNG TÔI</h4>
          <Flex vertical>
            {footers.map((footer) =>
              footer.column === 1 ? (
                <a
                  className={clsx(style.text_item)}
                  target="_blank"
                  href={footer.url}
                  rel="noreferrer"
                >
                  {footer.name}
                </a>
              ) : (
                <></>
              )
            )}
          </Flex>
        </Col>
        <Col xs={24} sm={4}>
          <h4 className={clsx(style.text_heading)}>DANH MỤC</h4>
          <Flex vertical>
            {footers.map((footer) =>
              footer.column === 2 ? (
                <a
                  className={clsx(style.text_item)}
                  target="_blank"
                  href={footer.url}
                  rel="noreferrer"
                >
                  {footer.name}
                </a>
              ) : (
                <></>
              )
            )}
          </Flex>
        </Col>
        <Col xs={24} sm={4}>
          <h4 className={clsx(style.text_heading)}>TÌM HIỂU THÊM</h4>
          <Flex vertical>
            {footers.map((footer) =>
              footer.column === 3 ? (
                <a
                  className={clsx(style.text_item)}
                  target="_blank"
                  href={footer.url}
                  rel="noreferrer"
                >
                  {footer.name}
                </a>
              ) : (
                <></>
              )
            )}
          </Flex>
        </Col>
        <Col xs={24} sm={4}>
          <h4 className={clsx(style.text_heading)}>TỔNG ĐÀI</h4>
          <Flex vertical>
            {footers.map((footer) =>
              footer.column === 4 ? (
                <a
                  className={clsx(style.text_item)}
                  target="_blank"
                  href={footer.url}
                  rel="noreferrer"
                >
                  {footer.name}
                </a>
              ) : (
                <></>
              )
            )}
          </Flex>
          {/* <Flex justify="center">
            <img
              style={{
                width: "50%",
              }}
              src="https://orebishopping.reactbd.com/static/media/payment.3e00cc601c9e7fc1e7d3.png"
              alt=""
            />
          </Flex> */}
        </Col>
        <Col xs={24} sm={4}>
          <h4 className={clsx(style.text_heading)}>THEO DÕI CHÚNG TÔI TẠI</h4>
          <Flex className={clsx(style.items)}>
            <a href="https://github.com/huygamcha">
              <img
                style={{ width: "30px", height: "30px" }}
                src="http://res.cloudinary.com/drqphlfn6/image/upload/v1707808894/lzhvyybdxf29paic3spm.png"
                alt="github"
              />
            </a>
            <a href="https://www.facebook.com/lehuynhhuy.taa">
              <img
                style={{ width: "30px", height: "30px" }}
                src="http://res.cloudinary.com/drqphlfn6/image/upload/v1707809091/vrvzmcykp5acusyvrvoa.png"
                alt="facebook"
              />
            </a>
            <a href="mailto:lehuynhhuy2002@gmail.com">
              <img
                style={{ width: "30px", height: "30px" }}
                src="http://res.cloudinary.com/drqphlfn6/image/upload/v1707809450/wk6gi5wxxm23rytw9ey4.jpg"
                alt="email"
              />
            </a>
          </Flex>
        </Col>

        <Col style={{ textAlign: "center", margin: "30px 0px" }} span={24}>
          © 2024 Cửa hàng Pam
        </Col>
      </Row>
    </div>
  );
}

export default FooterScreen;
