import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import FooterScreen from "../../../components/footer";
import style from "../mainLayout/mainLayOut.module.css";
import clsx from "clsx";
import HeaderScreen from "../../../components/header";

function LoginLayout() {
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

export default LoginLayout;
