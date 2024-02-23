import { Flex, Space } from "antd";
import React from "react";
import style from "./discount.module.css";
import clsx from "clsx";

function Discount({ discount, font }: any) {
  return (
    <span style={{ fontSize: `${font}px` }} className={clsx(style.wrapper)}>
      <span>-{discount}</span>
      <span>%</span>
    </span>
  );
}

export default Discount;
