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
  resetState,
} from "../../../slices/tagSlice";
import { useAppSelector, useAppDispatch } from "../../../store";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";

type Props = {};

const Tag = (props: Props) => {
  const navigate = useNavigate();
  const param = useParams();
  const dispatch = useAppDispatch();

  const firstRender = useRef<boolean>(true);
  const [selectedTag, setSelectedTag] = useState<any>();

  const [messageApi, contextHolder] = message.useMessage();

  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  const {
    tags,
    isSuccessCreate,
    isSuccessUpdate,
    isErrorCreate,
    isErrorUpdate,
  } = useAppSelector((state) => state.tags);

  useEffect(() => {
    firstRender.current = false;
    if (tags.length === 0) dispatch(getAllTag());
  }, []);

  useEffect(() => {
    if (!firstRender.current) {
      if (isErrorUpdate || isErrorCreate) {
        if (!param.id && isErrorCreate) {
          onShowMessage(`Tạo tag không thành công`, "error");
        } else {
          onShowMessage(`Cập nhật tag không thành công`, "error");
          navigate(-1);
          setSelectedTag(false);
        }
        updateForm.resetFields();
        dispatch(getAllTag());
        dispatch(resetState());
      }
      if (isSuccessUpdate || isSuccessCreate) {
        if (!param.id && isSuccessCreate) {
          onShowMessage("Tạo tag thành công", "success");
        } else {
          onShowMessage("Cập nhật tag thành công", "success");
          navigate(-1);
          setSelectedTag(false);
        }
        createForm.resetFields();
        dispatch(getAllTag());
        dispatch(resetState());
      }
    }
  }, [isSuccessCreate, isSuccessUpdate, isErrorCreate, isErrorUpdate]);

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

  const onFinish = async (values: any) => {
    await dispatch(createTag(values));
    dispatch(resetState());
  };

  //copy
  const handleCopy = async (values: any) => {
    await dispatch(createTag({ ...values, name: `${values.name} (copy)` }));
  };

  // update tag modal

  const onUpdate = async (values: any) => {
    await dispatch(updateTag({ id: selectedTag, values }));
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteTag(values));
    dispatch(getAllTag());
    onShowMessage("Xoá tag thành công");
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
