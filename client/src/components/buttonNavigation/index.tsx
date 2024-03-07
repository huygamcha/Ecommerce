// some-inner-component.jsx
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import clsx from "clsx";
import { useSwiper } from "swiper/react";
import style from "./buttonNavigation.module.css";

export default function ButtonNavigation() {
  const swiper = useSwiper();

  return (
    <Flex justify="space-between">
      <button
        className={clsx(style.customButton)}
        onClick={() => swiper.slidePrev()}
      >
        <LeftOutlined />
      </button>
      <button
        className={clsx(style.customButton)}
        onClick={() => swiper.slideNext()}
      >
        <RightOutlined />
      </button>
    </Flex>
  );
}
