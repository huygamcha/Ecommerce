import { Col, Flex, Row, Space } from "antd";
import React from "react";
import style from "./footer.module.css";
import clsx from "clsx";

function FooterScreen() {
  return (
    <div style={{ padding: "15px", width: "100%" }}>
      <Row>
        <Col xs={24} sm={8}>
          <h4 className={clsx(style.text_center)}>
            © 2024 Taa. Tất cả các quyền được bảo lưu.
          </h4>
        </Col>
        <Col xs={24} sm={8}>
          <h4 className={clsx(style.text_center)}>Phương thức thanh toán</h4>
          <Flex justify="center">
            <img
              style={{
                width: "50%",
              }}
              src="https://orebishopping.reactbd.com/static/media/payment.3e00cc601c9e7fc1e7d3.png"
              alt=""
            />
          </Flex>
        </Col>
        <Col xs={24} sm={8}>
          <h4 className={clsx(style.text_center)}>Theo dõi chúng tôi tại</h4>
          <Flex className={clsx(style.items)} justify="center">
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
      </Row>
    </div>
  );
}

export default FooterScreen;
