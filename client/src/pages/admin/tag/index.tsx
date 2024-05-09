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
  createTag,
  getAllTag,
  deleteTag,
  updateTag,
} from "../../../slices/tagSlice";
import { useAppSelector, useAppDispatch } from "../../../store";
import { useForm } from "antd/es/form/Form";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";

type Props = {};

const Tag = (props: Props) => {
  const navigate = useNavigate();
  const param = useParams();
  // không hiển thị khi lần đầu load trang
  const [initialRender, setInitialRender] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);
  // get from database
  const dispatch = useAppDispatch();

  const { tags, error } = useAppSelector((state) => state.tags);

  useEffect(() => {
    setInitialRender(false);
    dispatch(getAllTag());
  }, [dispatch]);

  //set active modal
  const [selectedTag, setSelectedTag] = useState<any>(); // boolean or record._id

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
  };

  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  useEffect(() => {
    if (!initialRender) {
      if (error.message !== "") {
        if (!param.id) {
          onShowMessage(`${error.errors.name}`, "error");
        } else {
          onShowMessage(`${error.errors.name}`, "error");
        }
      } else {
        if (!param.id) {
          onShowMessage("Tạo tag thành công", "success");
        } else {
          onShowMessage("Cập nhật tag thành công", "success");
          navigate(-1);
          setSelectedTag(false);
        }
        createForm.resetFields();
      }
    }
    dispatch(getAllTag());
  }, [isActive]);

  const onFinish = async (values: any) => {
    await dispatch(createTag(values));
    // setInitialRender(false);
    setIsActive(!isActive);
  };

  //copy
  const handleCopy = async (values: any) => {
    await dispatch(createTag({ ...values, name: `${values.name} (copy)` }));
    setIsActive(!isActive);
  };

  // update tag modal

  const onUpdate = async (values: any) => {
    await dispatch(updateTag({ id: selectedTag, values: values }));
    setIsActive(!isActive);
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteTag(values));
    dispatch(getAllTag());
    onShowMessage("Xoá tag thành công");
  };

  // console.log("««««« tag »»»»»", tag);
  // console.log("««««« tags »»»»»", tags);
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
            <Button
              onClick={() => handleCopy(record)}
              icon={<CopyOutlined />}
            ></Button>
            <Link to={`/admin/tags/${record._id}`}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedTag(record._id);
                  updateForm.setFieldsValue(record);
                }}
              ></Button>
            </Link>

            <Popconfirm
              title="Xoá tag"
              description="Bạn có chắc xoá tag này không?"
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
      <Card title="Tạo tag mới" style={{ width: "100%" }}>
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
            label="Tên tag"
            name="name"
            rules={[
              { required: true, message: "Vui lòng điền tên tag!" },
              {
                min: 2,
                message: "Tên tag phải lớn hơn 2 kí tự",
              },
              {},
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit">
              Thêm tag
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="Danh sách các tag">
        <Table dataSource={tags} columns={columns} />
      </Card>

      {/* form edit và delete */}
      <Modal
        centered
        title="Chỉnh sửa tag"
        onCancel={() => {
          navigate(-1);
          setSelectedTag(false);
        }}
        open={selectedTag}
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
              label="Sửa tag"
              name="name"
              rules={[
                { required: true, message: "Vui lòng điền tên tag!" },
                { min: 2, message: "Tên tag phải có ít nhất 2 ký tự!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default Tag;
