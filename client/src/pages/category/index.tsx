import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllCategory } from "../../slices/categorySlice";
import { useAppSelector, useAppDispatch } from "../../store";
import { Dispatch } from "@reduxjs/toolkit";

type Props = {};

const Category = (props: Props) => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  const onFinish = (value: any) => {};
  const onFinishFailed = (error: any) => {};
  type FieldType = {
    name?: string;
    description?: string;
  };
  console.log("««««« categories »»»»»", categories);
  return (
    <div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        initialValues={{ name: "", description: "" }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Name"
          name="name"
          rules={[{ required: true, message: "Vui lòng điền tên!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="Description" name="description">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Category;
