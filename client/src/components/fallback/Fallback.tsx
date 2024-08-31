import { ConfigProvider, Spin } from "antd";
import style from "./fallback.module.css";

const Fallback = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          // colorPrimary:
        },
      }}
    >
      <div className={style.wrapper}>
        <Spin size="large" className={style.wrapper_child}></Spin>
      </div>
    </ConfigProvider>
  );
};

export default Fallback;
