import React, { useCallback, useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Form, Input, Space, message } from "antd";
import { useAppDispatch, useAppSelector } from "../../store";
import { loginUser } from "../../slices/authSlice";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { getCartFromCustomer } from "../../slices/cartSlice";
import { getInforUser } from "../../slices/customerSlice";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { error, success, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [messageApi, contextHolder] = message.useMessage();

  const MESSAGE_TYPE = {
    SUCCESS: "success",
    INFO: "info",
    WARNING: "warning",
    ERROR: "error",
  };
  const onShowMessage = useCallback(
    (content: any, type: any = MESSAGE_TYPE.SUCCESS) => {
      messageApi.open({
        type: type,
        content: content,
      });
    },
    [messageApi]
  );
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location]);

  useEffect(() => {
    if (error) {
      onShowMessage(`${error}`, "error");
    }
    if (success) {
      onShowMessage(`Đăng nhập thành công`, "success");
      console.log("««««« location.pathname »»»»»", location.pathname);
      dispatch(getCartFromCustomer());
      if (location.pathname === "/notPermit") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    }
  }, [error, success]);

  const onFinish = async (values: any) => {
    await dispatch(loginUser(values));
  };

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Message: {
              zIndexPopup: 99999,
            },
          },
        }}
      >
        {contextHolder}

        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          wrapperCol={{ span: 8 }}
          labelCol={{ span: 8 }}
          style={{ marginTop: "30px" }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
            style={{ marginBottom: "20px" }}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng điền mật khẩu" },
              { min: 6, message: "Mật khẩu lớn hơn 6 kí tự" },
            ]}
            style={{ marginBottom: "10px" }}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{ xs: 8, offset: 8 }}
            style={{ marginBottom: "10px" }}
          >
            <a className="login-form-forgot" href="">
              Quên mật khẩu
            </a>
          </Form.Item>

          <Form.Item
            wrapperCol={{ xs: 8, offset: 8 }}
            style={{ marginBottom: "30px" }}
          >
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Đăng nhập
            </Button>
            <Link style={{ marginLeft: "5px" }} to="/auth/register">
              Đăng kí!
            </Link>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </>
  );
};

export default Login;
