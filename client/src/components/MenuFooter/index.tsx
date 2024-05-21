import { Flex, Space } from "antd";
import clsx from "clsx";
import style from "./MenuFooter.module.css";
import { AiOutlineHome } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { useEffect } from "react";
import { getAllCart } from "../../slices/cartSlice";
import { PiShoppingCartLight } from "react-icons/pi";
import { PiUserThin } from "react-icons/pi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
function MenuFooter() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (carts.length === 0) dispatch(getAllCart());
  }, []);
  const { carts } = useAppSelector((state) => state.carts);

  return (
    <div>
      <Flex className={clsx(style.wrapper)} justify="space-between">
        <Flex vertical>
          <Flex justify="center">
            <AiOutlineHome className={clsx(style.icon, style.active)} />
          </Flex>
          <Link to="/" className={clsx(style.text, style.active)}>
            Trang chủ
          </Link>
        </Flex>

        <Flex vertical>
          <a href={`tel:0933110500`} className={clsx(style.text)}>
            <Flex justify="center">
              <IoChatboxEllipsesOutline className={clsx(style.icon)} />
            </Flex>
            Tư vấn
          </a>
        </Flex>

        <Flex vertical>
          <Link className={clsx(style.button_header_text)} to="/cart">
            <div className={clsx(style.cart_notification_wrapper)}>
              <PiShoppingCartLight style={{ fontSize: "24px" }} />
              <div className={clsx(style.cart_notification_item)}>
                {carts ? carts.length : 0}
              </div>
            </div>
          </Link>
          <Space className={clsx(style.text)}>Giỏ hàng</Space>
        </Flex>

        <Flex vertical>
          <Flex justify="center">
            <PiUserThin className={clsx(style.icon)} />
          </Flex>
          <Space className={clsx(style.text)}>Tài khoản</Space>
        </Flex>
      </Flex>
    </div>
  );
}

export default MenuFooter;
