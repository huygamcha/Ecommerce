import React, { Fragment } from "react";
import { Link, Outlet } from "react-router-dom";
import { Col, Flex, Layout, Row, Space } from "antd";
import Header from "../../../components/header";
import HeaderScreen from "../../../components/header";
import { Footer } from "antd/es/layout/layout";
import FooterScreen from "../../../components/footer";
import style from "./mainLayOut.module.css";
import clsx from "clsx";

function MainLayOut() {
  return (
    <Layout>
      <HeaderScreen></HeaderScreen>
      <div className={clsx(style.wrapper)}>
        <Outlet />
      </div>
      <FooterScreen></FooterScreen>
    </Layout>
  );
}

export default MainLayOut;
