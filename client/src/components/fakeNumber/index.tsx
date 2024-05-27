import clsx from "clsx";
import React from "react";
import style from "./specifications.module.css";
import { Flex, Space } from "antd";
import { FaCartShopping } from "react-icons/fa6";

function FakeNumber({
  fakeNumber,
  realNumber,
}: {
  fakeNumber: number;
  realNumber: number;
}) {
  return (
    fakeNumber && (
      <Flex align="center" className={clsx(style.wrapper, {})}>
        <FaCartShopping style={{ marginRight: "2px" }} />
        Đã bán: {fakeNumber + realNumber}
      </Flex>
    )
  );
}

export default FakeNumber;
