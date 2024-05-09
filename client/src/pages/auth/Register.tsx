import React, { useCallback, useEffect, useState } from "react";
import {
  HomeOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  ConfigProvider,
  Form,
  Input,
  Space,
  message,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../store";
import { loginUser } from "../../slices/authSlice";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { registerUser } from "../../slices/customerSlice";

dayjs.extend(customParseFormat);

const Register: React.FC = () => {
  type FieldType = {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phoneNumber: string;
    password: string;
    birthday: string;
    avatar: string;
  };

  const dispatch = useAppDispatch();
  const { error, success } = useAppSelector((state) => state.customers);
  const location = useLocation();
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
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location]);

  useEffect(() => {
    if (error) {
      if (error.message !== "") {
        onShowMessage(`Tạo tài khoản không thành công`, "error");
      }
    }
    if (success) {
      onShowMessage("Đăng kí thành công", "success");
      setTimeout(() => {
        navigate("/auth/login");
      }, 3000);
    }
  }, [error, success]);

  const onFinish = async (values: FieldType) => {
    values.birthday = dayjs(`${values.birthday}`).format("YYYY-MM-DD");
    await dispatch(registerUser({ ...values, avatar: pic }));
  };

  // upload avatar
  const [pic, setPic] = useState<string>();
  const postDetails = (pics: any) => {
    if (pics === undefined) {
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "pbl3_chatbot");
      data.append("cloud_name", "drqphlfn6");
      fetch("https://api.cloudinary.com/v1_1/drqphlfn6/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return;
    }
    console.log("««««« pic »»»»»", pic);
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
          name="register"
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          style={{ marginTop: "30px" }}
        >
          <Form.Item<FieldType>
            name="firstName"
            label="Tên"
            rules={[
              { required: true, message: "Vui lòng nhập tên" },
              { min: 2, message: "Tên phải lớn hơn 2 kí tự" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Tên"
            />
          </Form.Item>

          <Form.Item<FieldType>
            name="lastName"
            label="Họ"
            rules={[
              { required: true, message: "Vui lòng nhập họ" },
              { min: 2, message: "Họ phải lớn hơn 2 kí tự" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Họ"
            />
          </Form.Item>

          <Form.Item<FieldType>
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input prefix={<HomeOutlined />} placeholder="Địa chỉ" />
          </Form.Item>

          <Form.Item<FieldType>
            name="phoneNumber"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
            validateStatus={
              error && error.errors.phoneNumber ? "error" : undefined
            }
            help={error ? error.errors.phoneNumber : ""}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
            validateStatus={
              error && error.errors && error.errors.email ? "error" : undefined
            }
            help={error && error.errors ? error.errors.email : ""}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item<FieldType>
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng điền mật khẩu" },
              { min: 6, message: "Mật khẩu lớn hơn 6 kí tự" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Xác nhận mật khẩu"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận mật khẩu!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu không trùng khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Xác nhận mật khẩu"
            />
          </Form.Item>

          <Form.Item<FieldType>
            rules={[
              { required: true, message: "Vui lòng điền ngày sinh nhật" },
            ]}
            name="birthday"
            label="Sinh nhật"
          >
            <DatePicker />
          </Form.Item>

          <Form.Item<FieldType> label="Chọn ảnh" name="avatar">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.target.files && e.target.files[0];
                if (selectedFile) {
                  postDetails(selectedFile);
                }
              }}
            ></Input>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, xs: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Đăng kí
            </Button>
            <Link style={{ marginLeft: "5px" }} to="/auth/login">
              Đăng nhập!
            </Link>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </>
  );
};

export default Register;
