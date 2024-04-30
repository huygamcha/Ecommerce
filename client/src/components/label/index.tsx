import clsx from "clsx";
import React from "react";
import style from "./label.module.css";
import { Space } from "antd";

function Label({ title, soldOut }: { title: string; soldOut: boolean }) {
  return (
    <div
      className={clsx(style.wrapper, {
        [style.soldOut]: soldOut,
      })}
    >
      {!soldOut ? title : "Hết hàng"}
    </div>
  );
}

export default Label;
