import { Breadcrumb, Col, Flex, Row, Space } from "antd";
import clsx from "clsx";
import style from "./policy.module.css";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useEffect } from "react";
import { getAllPolicy, getPolicyById } from "../../../slices/policySlice";
import { Link, useParams } from "react-router-dom";
import { AiOutlineBars } from "react-icons/ai";

function PolicyScreen() {
  const { policies, policy } = useAppSelector((state) => state.policies);
  const dispatch = useAppDispatch();
  const params = useParams();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    if (policies.length === 0) dispatch(getAllPolicy());
    if (params.search !== policy.slug) dispatch(getPolicyById(params.search));
  }, [params]);
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#eef0f3",
        }}
      >
        <div className={clsx(style.wrapper_global_breadcrumb)}>
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
                  title: <Space>{policy.name}</Space>,
                },
              ]}
            />
          </Row>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <div className={clsx(style.wrapper_global)}>
          <Row>
            <Col xs={0} sm={7}>
              <Flex className={clsx(style.wrapper_list)} vertical>
                <Flex
                  className={clsx(style.wrapper_list_header)}
                  align="center"
                >
                  <AiOutlineBars style={{ marginRight: "5px" }} />
                  <Space className={clsx(style.wrapper_list_header_text)}>
                    Nội dung chính
                  </Space>
                </Flex>
                {policies &&
                  policies.map((policy: any, index: number) => (
                    <Link
                      key={index}
                      className={clsx(
                        style.wrapper_list_content_list,
                        params.search === policy.slug && style.active
                      )}
                      to={policy.link}
                    >
                      <Space className={clsx(style.wrapper_list_content_item)}>
                        {policy.name}
                      </Space>
                    </Link>
                  ))}
              </Flex>
            </Col>
            <Col
              xs={24}
              sm={13}
              dangerouslySetInnerHTML={{
                __html: policy?.content as string,
              }}
            ></Col>
            <Col xs={0} sm={4}></Col>
            <Col xs={24} sm={0}>
              <Flex className={clsx(style.wrapper_list)} vertical>
                <Flex
                  className={clsx(style.wrapper_list_header)}
                  align="center"
                >
                  <Space className={clsx(style.wrapper_list_header_text)}>
                    Tất cả bài viết trong danh mục
                  </Space>
                </Flex>
                {policies &&
                  policies.map((policy: any, index: number) => (
                    <Link
                      key={index}
                      className={clsx(
                        style.wrapper_list_content_list,
                        params.search === policy.slug && style.active
                      )}
                      to={policy.link}
                    >
                      <Space className={clsx(style.wrapper_list_content_item)}>
                        {policy.name}
                      </Space>
                    </Link>
                  ))}
              </Flex>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

export default PolicyScreen;
