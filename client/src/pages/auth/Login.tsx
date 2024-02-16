import React, { useCallback, useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space, message } from "antd";
import { useAppDispatch, useAppSelector } from "../../store";
import { loginUser } from "../../slices/authSlice";
import { Link, useNavigate, Navigate } from "react-router-dom";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { error, success } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

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
    if (error) {
      onShowMessage(`${error}`, "error");
    }
    if (success) {
      onShowMessage(`Đăng nhập thành công`, "success");
      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    }
  }, [error, success]);

  const onFinish = async (values: any) => {
    await dispatch(loginUser(values));
  };

  return (
    <>
      {contextHolder}

      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        wrapperCol={{ span: 8 }}
        labelCol={{ span: 8 }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
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
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 8, offset: 8 }}>
          <a className="login-form-forgot" href="">
            Quên mật khẩu
          </a>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 8, offset: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Đăng nhập
          </Button>
          <Link style={{ marginLeft: "4px" }} to="/auth/register">
            Đăng kí!{" "}
          </Link>
        </Form.Item>
      </Form>
    </>
  );
};

export default Login;
