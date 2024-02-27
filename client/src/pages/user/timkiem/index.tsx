import { Col, Row, Space } from "antd";
import React from "react";
import style from "./timkiem.module.css";
import clsx from "clsx";

function Timkiem() {
  return (
    <>
      <Row gutter={12} className={clsx(style.wrapper_global)}>
        <Col span={6}>
          <Space className={clsx(style.navbar)}>Gía bán</Space>
          <Space className={clsx(style.navbar)}>Độ tuổi</Space>
        </Col>
        <Col span={18}>123</Col>
      </Row>
      ``
    </>
  );
}

export default Timkiem;
