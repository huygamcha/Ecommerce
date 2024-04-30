import clsx from "clsx";
import React from "react";
import style from "./specifications.module.css";
import { Space } from "antd";

function Specifications({ title }: { title: string }) {
  return title && <div className={clsx(style.wrapper, {})}>{title}</div>;
}

export default Specifications;
