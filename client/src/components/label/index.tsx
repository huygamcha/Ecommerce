import clsx from "clsx";
import React from "react";
import style from "./label.module.css";
import { Space } from "antd";

function Label({ title }: { title: string }) {
  return <div className={clsx(style.wrapper)}>{title}</div>;
}

export default Label;
