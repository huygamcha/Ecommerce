/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect } from "react";
import style from "./pageLocation.module.css";
import clsx from "clsx";
import { Breadcrumb, Col, Flex, Row, Space } from "antd";
import { useAppDispatch, useAppSelector } from "../../store";
import { getAllBanner } from "../../slices/bannerSlice";
import { Link, useLocation } from "react-router-dom";
import ButtonNavigation from "../buttonNavigation";
// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Virtual } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import PolicyFooter from "../policyFooter";
import { FaFacebookMessenger } from "react-icons/fa6";
function PageLocation() {
  const dispatch = useAppDispatch();
  const { banners } = useAppSelector((state) => state.banners);
  const { locations } = useAppSelector((state) => state.locations);
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    if (banners.length === 0) dispatch(getAllBanner());
  }, [location]);

  return (
    <>
      <div
        style={{
          backgroundColor: "#eef0f3",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <div
          style={{
            backgroundColor: "#eef0f3",
          }}
          className={clsx(
            style.wrapper_global,
            style.wrapper_global_breadcrumb
          )}
        >
          <Row className={clsx(style.wrapper_breadcrumb)}>
            <Breadcrumb
              items={[
                {
                  title: (
                    <Link className={clsx(style.button_home)} to={"/"}>
                      Trang chủ
                    </Link>
                  ),
                },
                {
                  title: "Hệ thống cửa hàng",
                },
              ]}
            />
          </Row>
          <Row>
            <Col
              style={{
                fontSize: "20px",
                lineHeight: "28px",
                fontWeight: 600,
                marginTop: "8px",
              }}
              span={24}
            >
              {locations && locations.length && locations[0].name}
            </Col>
            <Col
              style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 400,
                color: "#4a4f63",
              }}
              span={24}
            >
              {locations && locations.length && locations[0].time}
            </Col>
          </Row>
        </div>
      </div>

      <div
        style={{
          justifyContent: "center",
          display: "flex",
          marginBottom: "16px",
        }}
      >
        <div
          className={clsx(style.wrapper_global, style.wrapper_global_location)}
        >
          <Row>
            <Col xs={0} sm={8}>
              <div
                style={{ fontSize: 0 }}
                className={clsx(
                  style.wrapper_subBanner,
                  style.wrapper_subBanner_img
                )}
              >
                {banners &&
                  banners.map((banner, index) => {
                    if (banner.subBanner) {
                      return (
                        <Link to={banner.link}>
                          <img
                            src={banner.pic}
                            className={clsx(style.content_img_subBanner)}
                            alt=""
                          />
                        </Link>
                      );
                    }
                  })}
              </div>
            </Col>
            <Col xs={24} sm={16}>
              {locations &&
                locations.map((location) => (
                  <div className={clsx(style.wrapper_detail_location)}>
                    <div className={clsx(style.location_name)}>
                      <div> {location.name}</div>
                      <div style={{ fontWeight: 400, fontSize: "15px" }}>
                        Cửa hàng mẹ và bé uy tín, giá cả tốt nhất tại Tam
                        kỳ,Quảng Nam. Miễn ship toàn Quảng Nam
                      </div>
                    </div>

                    <Row gutter={12}>
                      <Col xs={24} sm={11}>
                        <iframe
                          style={{
                            borderRadius: "12px",
                          }}
                          src={location.iframe}
                          width="100%"
                          height="200"
                          loading="lazy"
                        ></iframe>
                      </Col>
                      <Col xs={24} sm={13}>
                        <Flex vertical>
                          <Flex vertical>
                            <Space
                              style={{
                                fontSize: "16px",
                                lineHeight: "24px",
                                fontWeight: 400,
                              }}
                            >
                              Địa chỉ:
                            </Space>
                            <a
                              style={{
                                color: "#020b27",
                                fontSize: "16px",
                                lineHeight: "24px",
                                fontWeight: 500,
                                width: "max-content",
                              }}
                              href={location.map}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {location.address}
                            </a>
                          </Flex>

                          <Flex vertical>
                            <Space
                              style={{
                                fontSize: "16px",
                                lineHeight: "24px",
                                fontWeight: 500,
                              }}
                            >
                              {Date.now() > new Date().setHours(9, 0, 0, 0) &&
                              Date.now() < new Date().setHours(21, 0, 0, 0) ? (
                                <Space style={{ color: "#1250dc" }}>
                                  Đang mở
                                  <ul
                                    style={{ paddingLeft: "12px", margin: 0 }}
                                  >
                                    <li style={{ color: "#4a4f63" }}>
                                      Đóng cửa vào lúc 21:00
                                    </li>
                                  </ul>
                                </Space>
                              ) : (
                                <Space style={{ color: "#ff0200" }}>
                                  Đang đóng
                                  <ul
                                    style={{ paddingLeft: "12px", margin: 0 }}
                                  >
                                    <li style={{ color: "#4a4f63" }}>
                                      Mở cửa vào lúc 9:00
                                    </li>
                                  </ul>
                                </Space>
                              )}
                            </Space>
                          </Flex>

                          <Flex style={{ marginTop: "8px" }} align="center">
                            <Space
                              style={{
                                fontSize: "16px",
                                lineHeight: "24px",
                                fontWeight: 400,
                                color: "#4a4f63",
                              }}
                            >
                              Điện thoại:
                            </Space>
                            <a
                              style={{
                                color: "#1250dc",
                                fontWeight: 600,
                                marginLeft: "6px",
                              }}
                              href={`tel:0933110500`}
                            >
                              0933110500
                            </a>
                          </Flex>

                          {/* buy */}
                          <Flex
                            className={clsx(style.buy_wrapper)}
                            justify="space-between"
                          >
                            <a
                              href={location.map}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Space className={clsx(style.direction_map)}>
                                Xem chỉ đường
                              </Space>
                            </a>
                            <a href={`tel:0933110500`}>
                              <Space className={clsx(style.call_consult)}>
                                Gọi tư vấn
                              </Space>
                            </a>
                          </Flex>
                        </Flex>
                      </Col>
                    </Row>
                    <div className={clsx(style.location_wrapper_album)}>
                      Hình ảnh cửa hàng:
                      <Flex className={clsx(style.album_list)}>
                        {location.album &&
                          location.album.map((item, index) => (
                            <img
                              className={clsx(style.album_item)}
                              key={index}
                              src={item}
                              alt=""
                            />
                          ))}
                      </Flex>
                    </div>
                  </div>
                ))}
            </Col>
            <Col xs={24} sm={0}>
              <div
                style={{ fontSize: 0 }}
                className={clsx(style.wrapper_subBanner_line)}
              >
                <Swiper
                  modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                  loop={true}
                  autoplay={{
                    delay: 4000,
                  }}
                  spaceBetween={0}
                  slidesPerView={1}
                >
                  {banners &&
                    banners.map((banner, index) => {
                      if (banner.subBanner) {
                        return (
                          <SwiperSlide>
                            <Link to={banner.link}>
                              <img
                                key={index}
                                src={banner.pic}
                                className={clsx(
                                  style.content_img_subBanner_line
                                )}
                                alt=""
                              />
                            </Link>
                          </SwiperSlide>
                        );
                      }
                    })}
                </Swiper>
              </div>
            </Col>
          </Row>
          <div className={clsx(style.wrapper_policy_footer)}>
            <PolicyFooter />
          </div>

          <Flex
            className={clsx(style.buy_wrapper_mobile)}
            justify="space-between"
          >
            {locations && locations.length && (
              <a
                href={locations[0].map}
                className={clsx(style.map)}
                target="_blank"
                rel="noreferrer"
              >
                <Space>Xem chỉ đường</Space>
              </a>
            )}

            <a href={`tel:0933110500`} className={clsx(style.contact)}>
              <Space>Gọi tư vấn</Space>
            </a>
          </Flex>
        </div>
      </div>
    </>
  );
}

export default PageLocation;
