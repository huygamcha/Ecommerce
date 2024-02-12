import React, { Fragment } from "react";
import { Link, Outlet } from "react-router-dom";
import { Col, Flex, Layout, Row, Space } from "antd";
import Header from "../../../components/header";
import HeaderScreen from "../../../components/header";

function MainLayOut() {
  return (
    <Layout>
      <HeaderScreen></HeaderScreen>
      <Outlet />
    </Layout>
  );
}

export default MainLayOut;
