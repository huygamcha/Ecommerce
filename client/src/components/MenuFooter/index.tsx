import { Flex, Space } from "antd";
import clsx from "clsx";
import style from "./MenuFooter.module.css";
import { BsCart3 } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { FaHeadphonesSimple } from "react-icons/fa6";
import { AiOutlineHome } from "react-icons/ai";
import { Link } from "react-router-dom";

function MenuFooter() {
  return (
    <div>
      <Flex className={clsx(style.wrapper)} justify="space-between">
        <Flex vertical>
          <Flex justify="center">
            <AiOutlineHome className={clsx(style.icon)} />
          </Flex>
          <Link to="/" className={clsx(style.text)}>
            Trang chủ
          </Link>
        </Flex>

        <Flex vertical>
          <Flex justify="center">
            <FaHeadphonesSimple className={clsx(style.icon)} />
          </Flex>
          <Space>Tư vấn</Space>
        </Flex>
        <Flex vertical>
          <Flex justify="center">
            <BsCart3 className={clsx(style.icon)} />
          </Flex>
          <Link to="/cart" className={clsx(style.text)}>
            Giỏ hàng
          </Link>
        </Flex>
        <Flex vertical>
          <Flex justify="center">
            <FaRegUserCircle className={clsx(style.icon)} />
          </Flex>
          <Space>Tài khoản</Space>
        </Flex>
      </Flex>
    </div>
  );
}

export default MenuFooter;
