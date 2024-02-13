import { Flex, Space } from "antd";
import React from "react";
import style from "./discount.module.css";
import clsx from "clsx";

function Discount({ discount }: any) {
  return (
    <Flex className={clsx(style.wrapper)}>
      <span> {discount}</span>
      <span>% GIẢM</span>
    </Flex>
  );
}

export default Discount;
