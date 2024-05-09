import clsx from "clsx";
import style from "./orderSuccess.module.css";
import { Col, Flex, Row, Space } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

function OrderSuccess() {
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
                    src="https://nhathuoclongchau.com.vn/estore-images/dat-hang-thanh-cong.svg"
                    alt=""
                  />
                </Flex>
              </Col>
              <Col
                span={24}
                style={{ background: "#fff", borderRadius: "10px" }}
              >
                <Row style={{ padding: "16px" }}>
                  <Col className={clsx(style.header_success)} span={24}>
                    Đặt hàng thành công
                  </Col>
                  <Col className={clsx(style.header_des)} span={24}>
                    Shop sẽ liên hệ với bạn để xác nhận đơn hàng
                  </Col>
                  <Col className={clsx(style.payment_type)} span={24}>
                    Phương thức thanh toán
                  </Col>
                  <Col className={clsx(style.payment_type_detail)} span={24}>
                    <Flex align="center">
                      <div>
                        <img
                          style={{
                            width: "40px",
                            height: "40px",
                            marginRight: "12px",
                          }}
                          src="https://s3-sgn09.fptcloud.com/lc-public/app-lc/payment/cod.png"
                          alt=""
                        />
                      </div>
                      {/* update with type */}
                      <div>Thanh toán tiền mặt khi nhận hàng</div>
                    </Flex>
                  </Col>
                  <Col className={clsx(style.payment_type_detail)} span={24}>
                    <Flex align="center">
                      <div>
                        <img
                          style={{
                            width: "40px",
                            height: "40px",
                            marginRight: "12px",
                          }}
                          src="https://s3-sgn09.fptcloud.com/lc-public/app-lc/payment-method/voucher.png"
                          alt=""
                        />
                      </div>
                      {/* update with type */}
                      <div>Thanh toán bằng voucher</div>
                    </Flex>
                  </Col>
                  <Col span={24}>
                    <Flex
                      className={clsx(style.buy_wrapper)}
                      justify="space-between"
                    >
                      <Link to={"/cart"} className={clsx(style.detail_cart)}>
                        Chi tiết đơn hàng
                      </Link>
                      <Link
                        to={"/"}
                        onClick={() => {
                          localStorage.removeItem("carts");
                        }}
                        className={clsx(style.home)}
                      >
                        Về trang chủ
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

export default OrderSuccess;
