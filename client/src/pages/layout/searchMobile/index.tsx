import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import style from "./searchMobile.module.css";
import clsx from "clsx";
import HeaderScreenMobile from "../../../components/header/headerMobile";

function SearchMobile() {
  return (
    <Layout>
      <HeaderScreenMobile></HeaderScreenMobile>
      <div className={clsx(style.wrapper)}>
        <Outlet />
      </div>
    </Layout>
  );
}

export default SearchMobile;
