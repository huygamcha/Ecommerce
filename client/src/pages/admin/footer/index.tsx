import { useCallback, useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  Card,
  Table,
  message,
  Popconfirm,
  Space,
  Modal,
  Select,
} from "antd";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../store";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createFooter,
  deleteFooter,
  getAllFooter,
  resetState,
  updateFooter,
} from "../../../slices/footerSlice";

type Props = {};

const FooterAdmin = (props: Props) => {
  const navigate = useNavigate();
  const param = useParams();
  const dispatch = useAppDispatch();

  const [selectedFooter, setSelectedFooter] = useState<any>(); // boolean or record._id
  const firstRender = useRef<boolean>(true);

  const [messageApi, contextHolder] = message.useMessage();

  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  const {
    footers,
    isSuccessCreate,
    isSuccessUpdate,
    isErrorCreate,
    isErrorUpdate,
  } = useAppSelector((state) => state.footers);

  useEffect(() => {
    firstRender.current = false;
    if (footers.length === 0) dispatch(getAllFooter());
  }, []);

  useEffect(() => {
    if (!firstRender.current) {
      if (isErrorUpdate || isErrorCreate) {
        if (!param.id && isErrorCreate) {
          onShowMessage(`Tạo footer không thành công`, "error");
        } else {
          onShowMessage(`Cập nhật footer không thành công`, "error");
          navigate(-1);
          setSelectedFooter(false);
        }
        updateForm.resetFields();
        dispatch(getAllFooter());
        dispatch(resetState());
      }
      if (isSuccessUpdate || isSuccessCreate) {
        if (!param.id && isSuccessCreate) {
          onShowMessage("Tạo footer thành công", "success");
        } else {
          onShowMessage("Cập nhật footer thành công", "success");
          navigate(-1);
          setSelectedFooter(false);
        }
        createForm.resetFields();
        dispatch(getAllFooter());
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
    url?: string;
    column?: number;
    optional?: string;
  };

  const onFinish = async (values: any) => {
    await dispatch(createFooter(values));
  };

  //copy
  const handleCopy = async (values: any) => {
    await dispatch(createFooter({ ...values, name: `${values.name} (copy)` }));
  };

  // update category modal

  const onUpdate = async (values: any) => {
    await dispatch(updateFooter({ id: selectedFooter, values: values }));
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteFooter(values));
    dispatch(getAllFooter());
    onShowMessage("Xoá footer thành công");
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
      title: "Url",
      dataIndex: "url",
      key: "url",
      width: "45%",
      render: (text: string, record: any, index: number) => {
        if (text) {
          return (
            <a
              target="_blank"
              href={`${text}`}
              style={{ color: "black" }}
              rel="noreferrer"
            >
              {`${text}`}
            </a>
          );
        }
      },
    },
    {
      title: "Optional",
      dataIndex: "optional",
      key: "optional",
      render: (text: string, record: any, index: number) => <div>{text}</div>,
    },

    {
      title: "Column",
      dataIndex: "column",
      key: "column",
      width: "1%",
      render: (text: number, record: any, index: number) => (
        <div style={{ textAlign: "right" }}>{text}</div>
      ),
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
            <Link to={`/admin/footers/${record._id}`}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedFooter(record._id);
                  updateForm.setFieldsValue(record);
                }}
              ></Button>
            </Link>

            <Popconfirm
              title="Xoá footer"
              description="Bạn có chắc xoá footer này không?"
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
      <Card title="Tạo footer mới" style={{ width: "100%" }}>
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
            label="Tên footer"
            name="name"
            rules={[
              { required: true, message: "Vui lòng điền tên footer!" },
              {
                min: 2,
                message: "Tên footer phải lớn hơn 2 kí tự",
              },
              {},
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Cột"
            name="column"
            rules={[{ required: true, message: "Vui lòng chọn cột!" }]}
            hasFeedback
          >
            <Select
              options={[
                { value: 1, label: "CHÍNH SÁCH" },
                { value: 2, label: "DANH MỤC" },
                { value: 3, label: "HỖ TRỢ" },
                { value: 4, label: "TỔNG ĐÀI" },
              ]}
            />
          </Form.Item>

          <Form.Item<FieldType> label="Url" name="url">
            <Input />
          </Form.Item>

          <Form.Item<FieldType> label="Optional" name="optional">
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit">
              Thêm footer
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="Danh sách các footer">
        <Table dataSource={footers} columns={columns} />
      </Card>

      {/* form edit và delete */}
      <Modal
        centered
        title="Chỉnh sửa footer"
        onCancel={() => {
          navigate(-1);
          setSelectedFooter(false);
        }}
        open={selectedFooter}
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
              label="Sửa footer"
              name="name"
              rules={[
                { required: true, message: "Vui lòng điền tên footer!" },
                { min: 2, message: "Tên footer phải có ít nhất 2 ký tự!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              label="Cột"
              name="column"
              rules={[{ required: true, message: "Vui lòng chọn cột!" }]}
              hasFeedback
            >
              <Select
                options={[
                  { value: 1, label: "VỀ CHÚNG TÔI" },
                  { value: 2, label: "DANH MỤC" },
                  { value: 3, label: "HƯỚNG DẪN" },
                  { value: 4, label: "TỔNG ĐÀI" },
                ]}
              />
            </Form.Item>

            <Form.Item<FieldType> label="Url" name="url">
              <Input />
            </Form.Item>

            <Form.Item<FieldType> label="Optional" name="optional">
              <Input />
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default FooterAdmin;
