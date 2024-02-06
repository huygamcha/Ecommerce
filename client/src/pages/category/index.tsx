import React, { useCallback, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Card,
  Table,
  message,
  Popconfirm,
  Space,
  Modal,
} from "antd";
import { useEffect } from "react";
import {
  createCategory,
  getAllCategory,
  deleteCategory,
  updateCategory,
} from "../../slices/categorySlice";
import { useAppSelector, useAppDispatch } from "../../store";
import { useForm } from "antd/es/form/Form";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

type Props = {};

const Category = (props: Props) => {
  // không hiển thị khi lần đầu load trang
  const [initialRender, setInitialRender] = useState<boolean>(true);
  const [nameForm, setNameForm] = useState<string>("");
  // get from database
  const dispatch = useAppDispatch();

  const { categories, category, error } = useAppSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  //set active modal
  const [selectedCategory, setSelectedCategory] = useState<any>(); // boolean or record._id

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

  // form
  type FieldType = {
    name?: string;
    description?: string;
  };

  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  useEffect(() => {
    if (!initialRender) {
      if (error) {
        if (nameForm === "create") {
          onShowMessage("Tạo danh mục không thành công", "error");
        } else {
          onShowMessage("Cập nhật danh mục không thành công", "error");
        }
      } else {
        if (nameForm === "create") {
          onShowMessage("Tạo danh mục thành công", "success");
        } else {
          onShowMessage("Cập nhật danh mục thành công", "success");
        }
        dispatch(getAllCategory());
        createForm.resetFields();
      }
    }
  }, [error, createForm, onShowMessage, dispatch, updateForm, nameForm]);

  const onFinish = async (values: any) => {
    await dispatch(createCategory(values));
    setNameForm("create");
    setInitialRender(false);
  };

  // update category modal
  const onUpdate = async (values: any) => {
    await dispatch(updateCategory({ id: selectedCategory, values: values }));
    setSelectedCategory(false);
    setNameForm("update");
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteCategory(values));
    dispatch(getAllCategory());
    onShowMessage("Xoá danh mục thành công");
  };

  // console.log("««««« category »»»»»", category);
  // console.log("««««« categories »»»»»", categories);
  // console.log("««««« error »»»»»", error);

  // table
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      width: "1%",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: "1%",
      render: (text: any, record: any) => {
        return (
          <Space size="small">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedCategory(record._id);
                updateForm.setFieldsValue(record);
              }}
            />

            <Popconfirm
              title="Xoá danh mục"
              description="Bạn có chắc xoá danh mục này không?"
              onConfirm={() => {
                onDelete(record._id);
              }}
            >
              <Button type="primary" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      {contextHolder}
      <Card title="Tạo danh mục mới" style={{ width: "100%" }}>
        <Form
          form={createForm}
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          initialValues={{ name: "", description: "" }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Tên danh mục"
            name="name"
            rules={[
              { required: true, message: "Vui lòng điền tên danh mục!" },
              {
                min: 2,
                message: "Tên danh mục phải lớn hơn 2 kí tự",
              },
              {
                validator(rule, value, callback) {
                  if (error) {
                    console.log("««««« 123 »»»»»", 123);
                    if (!error) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!"
                      )
                    );
                  }
                },
              },
            ]}
            hasFeedback
            // help={error ? "ok" : "123"}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label="Mô  tả" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit">
              Thêm danh mục
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="Danh sách các danh mục">
        <Table dataSource={categories} columns={columns} />
      </Card>

      {/* form edit và delete */}
      <Modal
        centered
        title="Chỉnh sửa danh mục"
        onCancel={() => setSelectedCategory(false)}
        open={selectedCategory}
        okText="Save changes"
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Card style={{ width: "100%" }}>
          <Form
            form={updateForm}
            name="update-form"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 12 }}
            initialValues={{ name: "", description: "" }}
            onFinish={onUpdate}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Sửa danh mục"
              name="name"
              rules={[
                { required: true, message: "Vui lòng điền tên danh mục!" },
                { min: 2, message: "Tên danh mục phải có ít nhất 2 ký tự!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="Mô tả" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default Category;
