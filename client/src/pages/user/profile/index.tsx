import { Col, Row, Image, Form, Input, DatePicker, Button } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getInforUser } from "../../../slices/customerSlice";
import {
  HomeOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

function ProfileScreen() {
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

  const { customer } = useAppSelector((state) => state.customers);
  const { user } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const currentUser = localStorage.getItem("userInfor")
    ? JSON.parse(localStorage.getItem("userInfor")!)
    : undefined;

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth/login");
    }
  }, [currentUser]);

  useEffect(() => {
    if (user) {
      dispatch(getInforUser(user.id));
    }
  }, []);

  useEffect(() => {
    setPic(customer.avatar);
  }, [customer]);

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

  console.log("««««« customer »»»»»", customer);

  return (
    <div style={{ padding: "15px", background: "#fff" }}>
      <Row>
        <Col style={{ textAlign: "center" }} span={24}>
          Hồ sơ của tôi
        </Col>
        <Col span={20} offset={0}>
          {customer.firstName ? (
            <Form
              name="register"
              // onFinish={onFinish}
              labelCol={{ span: 10 }}
              // wrapperCol={{ span: 8 }}
              initialValues={{
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                address: customer.address,
                phoneNumber: customer.phoneNumber,
              }}
            >
              <Row>
                <Col span={16}>
                  <Form.Item<FieldType>
                    name="firstName"
                    label="Tên"
                    rules={[
                      { required: true, message: "Vui lòng nhập tên" },
                      { min: 2, message: "Tên phải lớn hơn 2 kí tự" },
                    ]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Tên" />
                  </Form.Item>
                  <Form.Item<FieldType>
                    name="address"
                    label="Địa chỉ"
                    rules={[
                      { required: true, message: "Vui lòng nhập địa chỉ" },
                    ]}
                  >
                    <Input prefix={<HomeOutlined />} placeholder="Địa chỉ" />
                  </Form.Item>

                  <Form.Item<FieldType>
                    name="phoneNumber"
                    label="Số điện thoại"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại",
                      },
                    ]}
                    // validateStatus={
                    //   error && error.errors.phoneNumber ? "error" : undefined
                    // }
                    // help={error ? error.errors.phoneNumber : ""}
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      placeholder="Số điện thoại"
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                    // validateStatus={
                    //   error && error.errors && error.errors.email
                    //     ? "error"
                    //     : undefined
                    // }
                    // help={error && error.errors ? error.errors.email : ""}
                  >
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                  </Form.Item>

                  <Form.Item<FieldType>
                    name="password"
                    label="Thay đổi mật khẩu"
                    rules={[{ min: 6, message: "Mật khẩu lớn hơn 6 kí tự" }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Thay đổi mật khẩu"
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirm"
                    label="Xác nhận mật khẩu"
                    dependencies={["password"]}
                    rules={[
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
                      {
                        required: true,
                        message: "Vui lòng điền ngày sinh nhật",
                      },
                    ]}
                    name="birthday"
                    label="Sinh nhật"
                  >
                    <DatePicker defaultValue={dayjs(customer.birthday)} />
                  </Form.Item>
                </Col>
                <Col span={6} offset={2}>
                  <Form.Item<FieldType> name="avatar">
                    <Image src={pic}></Image>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const selectedFile =
                          e.target.files && e.target.files[0];
                        if (selectedFile) {
                          postDetails(selectedFile);
                        }
                      }}
                    ></Input>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                    >
                      Thay đổi
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default ProfileScreen;
