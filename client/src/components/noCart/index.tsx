import clsx from "clsx";
import style from "./noCart.module.css";
import { Col, Flex, Row, Space } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

function NoCart() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        background: "#edf0f3",
      }}
    >
      <div className={clsx(style.wrapper_global)}>
        <Row style={{ display: "flex", justifyContent: "center" }}>
          <Col xs={20} sm={12}>
            <Row>
              <Col span={24}>
                <Flex justify="center">
                  <img
                    src="https://nhathuoclongchau.com.vn/estore-images/empty-cart.png"
                    alt=""
                  />
                </Flex>
              </Col>
              <Col span={24}>
                <Row style={{ padding: "16px" }}>
                  <Col className={clsx(style.header_success)} span={24}>
                    Chưa có sản phẩm nào trong giỏ hàng
                  </Col>
                  <Col className={clsx(style.header_des)} span={24}>
                    Cùng mua sắm hàng ngàn sản phẩm tại nhà thuốc shop Min nhé!
                  </Col>
                  <Col span={24}>
                    <Flex className={clsx(style.buy_wrapper)} justify="center">
                      <Link to={"/"} className={clsx(style.detail_cart)}>
                        Mua hàng
                      </Link>
                    </Flex>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default NoCart;
