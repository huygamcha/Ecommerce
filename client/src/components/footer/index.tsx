import { Col, Flex, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import style from "./footer.module.css";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../../store";
import { getAllFooter } from "../../slices/footerSlice";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const ListRender = ({
  title,
  specificColumn,
}: {
  title: string;
  specificColumn: number;
}) => {
  const { footers } = useAppSelector((state) => state.footers);
  const [isShow, setIsShow] = useState<boolean>(false);
  return (
    <Col className={clsx(style.wrapper_mobile)} xs={24} sm={0}>
      <h4
        onClick={() => setIsShow(!isShow)}
        className={clsx(style.text_heading_mobile)}
      >
        <Flex justify="space-between">
          <Space>{title} </Space>
          <Space>{isShow ? <IoChevronDown /> : <IoChevronUp />}</Space>
        </Flex>
      </h4>
      <Flex
        className={clsx(style.dropdown_item, isShow ? style.active : "")}
        vertical
      >
        {footers.map((footer) =>
          footer.column === specificColumn ? (
            <a
              className={clsx(style.text_item_mobile)}
              target="_blank"
              href={footer.url}
              rel="noreferrer"
            >
              {footer.name}
            </a>
          ) : (
            <></>
          )
        )}
      </Flex>
    </Col>
  );
};

function FooterScreen() {
  const dispatch = useAppDispatch();
  const { footers } = useAppSelector((state) => state.footers);
  const [isAbout, setIsAbout] = useState<boolean>(false);
  const [isCategory, setIsCategory] = useState<boolean>(false);
  const [isMore, setIsMore] = useState<boolean>(false);
  const [isSwitchBoard, setIsSwitchBoard] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getAllFooter());
  }, []);

  return (
    <div style={{ background: "#fff" }}>
      <Row className={clsx(style.global_wrapper)}>
        <Col xs={0} sm={4}>
          <h4 className={clsx(style.text_heading)}>VỀ CHÚNG TÔI</h4>
          <Flex vertical>
            {footers.map((footer) =>
              footer.column === 1 ? (
                <a
                  className={clsx(style.text_item)}
                  target="_blank"
                  href={footer.url}
                  rel="noreferrer"
                >
                  {footer.name}
                </a>
              ) : (
                <></>
              )
            )}
          </Flex>
        </Col>
        <Col xs={0} sm={4}>
          <h4 className={clsx(style.text_heading)}>DANH MỤC</h4>
          <Flex vertical>
            {footers.map((footer) =>
              footer.column === 2 ? (
                <a
                  className={clsx(style.text_item)}
                  target="_blank"
                  href={footer.url}
                  rel="noreferrer"
                >
                  {footer.name}
                </a>
              ) : (
                <></>
              )
            )}
          </Flex>
        </Col>
        <Col xs={0} sm={4}>
          <h4 className={clsx(style.text_heading)}>TÌM HIỂU THÊM</h4>
          <Flex vertical>
            {footers.map((footer) =>
              footer.column === 3 ? (
                <a
                  className={clsx(style.text_item)}
                  target="_blank"
                  href={footer.url}
                  rel="noreferrer"
                >
                  {footer.name}
                </a>
              ) : (
                <></>
              )
            )}
          </Flex>
        </Col>
        <Col xs={0} sm={4}>
          <h4 className={clsx(style.text_heading)}>TỔNG ĐÀI</h4>
          <Flex vertical>
            {footers.map((footer) =>
              footer.column === 4 ? (
                <a
                  className={clsx(style.text_item)}
                  target="_blank"
                  href={footer.url}
                  rel="noreferrer"
                >
                  {footer.name}
                </a>
              ) : (
                <></>
              )
            )}
          </Flex>
        </Col>
        <Col xs={0} sm={4}>
          <h4 className={clsx(style.text_heading)}>KẾT NỐI VỚI CHÚNG TÔI</h4>
          <Flex className={clsx(style.items)}>
            <a href="https://github.com/huygamcha">
              <img
                style={{ width: "30px", height: "30px" }}
                src="http://res.cloudinary.com/drqphlfn6/image/upload/v1707808894/lzhvyybdxf29paic3spm.png"
                alt="github"
              />
            </a>
            <a href="https://www.facebook.com/lehuynhhuy.taa">
              <img
                style={{ width: "30px", height: "30px" }}
                src="http://res.cloudinary.com/drqphlfn6/image/upload/v1707809091/vrvzmcykp5acusyvrvoa.png"
                alt="facebook"
              />
            </a>
            <a href="mailto:lehuynhhuy2002@gmail.com">
              <img
                style={{ width: "30px", height: "30px" }}
                src="http://res.cloudinary.com/drqphlfn6/image/upload/v1707809450/wk6gi5wxxm23rytw9ey4.jpg"
                alt="email"
              />
            </a>
          </Flex>
        </Col>

        {/* mobile */}
        <Col className={clsx(style.wrapper_mobile)} xs={24} sm={0}>
          <h4 className={clsx(style.text_heading_mobile)}>
            <Flex justify="space-between">
              <Space>KẾT NỐI VỚI CHÚNG TÔI </Space>
              <Flex
                className={clsx(
                  style.dropdown_item,
                  style.active,
                  style.dropdown_item_social
                )}
              >
                <a href="https://github.com/huygamcha">
                  <img
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "10px",
                    }}
                    src="http://res.cloudinary.com/drqphlfn6/image/upload/v1707808894/lzhvyybdxf29paic3spm.png"
                    alt="github"
                  />
                </a>
                <a href="https://www.facebook.com/lehuynhhuy.taa">
                  <img
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "10px",
                    }}
                    src="http://res.cloudinary.com/drqphlfn6/image/upload/v1707809091/vrvzmcykp5acusyvrvoa.png"
                    alt="facebook"
                  />
                </a>
                <a href="mailto:lehuynhhuy2002@gmail.com">
                  <img
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "10px",
                    }}
                    src="http://res.cloudinary.com/drqphlfn6/image/upload/v1707809450/wk6gi5wxxm23rytw9ey4.jpg"
                    alt="email"
                  />
                </a>
              </Flex>
            </Flex>
          </h4>
        </Col>

        <ListRender title="VỀ CHÚNG TÔI" specificColumn={1} />
        <ListRender title="DANH MỤC" specificColumn={2} />
        <ListRender title="TÌM HIỂU THÊM" specificColumn={3} />
        <ListRender title="TỔNG ĐÀI" specificColumn={4} />

        <Col style={{ textAlign: "center", margin: "30px 0px" }} span={24}>
          © 2024 Cửa hàng Pam
        </Col>
      </Row>
    </div>
  );
}

export default FooterScreen;
