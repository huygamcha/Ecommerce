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
} from "../../../slices/categorySlice";
import { useAppSelector, useAppDispatch } from "../../../store";
import { useForm } from "antd/es/form/Form";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";

type Props = {};

const Category = (props: Props) => {
  const navigate = useNavigate();
  const param = useParams();
  // không hiển thị khi lần đầu load trang
  const [initialRender, setInitialRender] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);
  // get from database
  const dispatch = useAppDispatch();

  const { categories, error } = useAppSelector((state) => state.categories);

  useEffect(() => {
    setInitialRender(false);
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
        if (!param.id) {
          onShowMessage("Tạo danh mục không thành công", "error");
        } else {
          onShowMessage("Cập nhật danh mục không thành công", "error");
        }
      } else {
        if (!param.id) {
          onShowMessage("Tạo danh mục thành công", "success");
        } else {
          onShowMessage("Cập nhật danh mục thành công", "success");
          navigate(-1);
          setSelectedCategory(false);
        }
        createForm.resetFields();
      }
    }
    dispatch(getAllCategory());
  }, [isActive]);

  const onFinish = async (values: any) => {
    await dispatch(createCategory(values));
    // setInitialRender(false);
    setIsActive(!isActive);
  };

  // update category modal

  const onUpdate = async (values: any) => {
    await dispatch(updateCategory({ id: selectedCategory, values: values }));
    setIsActive(!isActive);
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteCategory(values));
    dispatch(getAllCategory());
    onShowMessage("Xoá danh mục thành công");
  };

  // console.log("««««« category »»»»»", category);
  // console.log("««««« categories »»»»»", categories);
  // console.log("««««« error »»»»»", error);
  console.log("««««« initialRender »»»»»", initialRender);

  // table
  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      width: "1%",
      render: (text: any, record: any, index: number) => {
        return <div style={{ textAlign: "right" }}>{index + 1}</div>;
      },
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
            <Link to={`/admin/categories/${record._id}`}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedCategory(record._id);
                  updateForm.setFieldsValue(record);
                }}
              ></Button>
            </Link>

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
              {},
            ]}
            hasFeedback
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
        onCancel={() => {
          navigate(-1);
          setSelectedCategory(false);
        }}
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
