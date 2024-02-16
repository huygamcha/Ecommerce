import { Flex, Space } from "antd";
import React from "react";
import style from "./discount.module.css";
import clsx from "clsx";

function Discount({ discount, font }: any) {
  return (
    <Flex style={{ fontSize: `${font}px` }} className={clsx(style.wrapper)}>
      <span> {discount}</span>
      <span>% GIẢM</span>
    </Flex>
  );
}

export default Discount;
