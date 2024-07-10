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
  Image,
  Spin,
  InputNumber,
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
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
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
    // if (categories.length === 0) dispatch(getAllCategory());
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
    no?: number;
    pic?: string;
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
    if (categories.length === 0) dispatch(getAllCategory());
  }, [isActive]);

  const onFinish = async (values: any) => {
    await dispatch(createCategory(values));
    setPic("");
    setIsActive(!isActive);
  };

  //copy
  const handleCopy = async (values: any) => {
    await dispatch(
      createCategory({ ...values, name: `${values.name} (copy)` })
    );
    setIsActive(!isActive);
  };
  // update category modal

  const onUpdate = async (values: any) => {
    // console.log("««««« values »»»»»", picDetail);
    await dispatch(
      updateCategory({
        id: selectedCategory,
        values: { ...values, pic: picDetail },
      })
    );
    setPicDetail("");
    setIsActive(!isActive);
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteCategory(values));
    dispatch(getAllCategory());
    onShowMessage("Xoá danh mục thành công");
  };

  // upload image
  const [picDetail, setPicDetail] = useState<string>();
  const [pic, setPic] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const postDetails = async (pics: any, infor: string) => {
    if (pics === undefined) {
      return;
    }
    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/webp"
    ) {
      setIsLoading(false);
      const data = new FormData();
      data.append("file", pics);
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/upload`, {
        method: "post",
        body: data,
      });
      const result = await response.text();
      setIsLoading(true);
      if (infor === "create") {
        setPic(result);
        createForm.setFieldValue("pic", result);
      } else {
        setPicDetail(result);
      }
    } else {
      return;
    }
  };

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
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số thứ tự",
      dataIndex: "no",
      key: "no",
    },

    {
      title: "Image",
      dataIndex: "pic",
      key: "pic",
      render: (text: string, record: any) => {
        return text && <Image height={60} width={60} src={text}></Image>;
      },
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
              onClick={() => handleCopy(record)}
              icon={<CopyOutlined />}
            ></Button>
            <Link to={`/admin/categories/${record._id}`}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedCategory(record._id);
                  updateForm.setFieldsValue(record);
                  setPicDetail(record.pic);
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
          <Form.Item<FieldType>
            rules={[{ required: true, message: "Vui lòng chọn hình ảnh!" }]}
            name="pic"
            label="Hình ảnh"
          >
            {pic ? <Image height={100} src={pic}></Image> : <Space></Space>}
            {/* <Space>{pic}</Space> */}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.target.files && e.target.files[0];
                if (selectedFile) {
                  postDetails(selectedFile, "create");
                }
              }}
            ></Input>
          </Form.Item>

          <Form.Item<FieldType> label="Số thứ tự" name="no">
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6 }}>
            {isLoading ? (
              <Button type="primary" htmlType="submit">
                Thêm
              </Button>
            ) : (
              <Spin />
            )}
          </Form.Item>
        </Form>
      </Card>
      <Card title="Danh sách các danh mục">
        <Table dataSource={categories} columns={columns} />
      </Card>

      {/* form edit và delete */}
      <Modal
        centered
        confirmLoading={!isLoading}
        title="Chỉnh sửa danh mục"
        onCancel={() => {
          navigate(-1);
          setSelectedCategory(false);
        }}
        open={selectedCategory}
        okText="Lưu"
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
            initialValues={{ name: "", no: "" }}
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
            <Form.Item<FieldType> label="Số thứ tự" name="no">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            <Form.Item<FieldType> name="pic" label="Hình ảnh">
              <Image height={100} src={picDetail}></Image>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selectedFile = e.target.files && e.target.files[0];
                  if (selectedFile) {
                    postDetails(selectedFile, "update");
                  }
                }}
              ></Input>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default Category;
