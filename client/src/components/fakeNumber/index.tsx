import clsx from "clsx";
import React from "react";
import style from "./specifications.module.css";
import { Space } from "antd";

function FakeNumber({ title }: { title: string }) {
  return (
    title && <div className={clsx(style.wrapper, {})}>Đã bán: {title}</div>
  );
}

export default FakeNumber;
