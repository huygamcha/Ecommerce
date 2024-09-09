/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
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
} from "antd";
import { useEffect } from "react";
import {
  createPolicy,
  getAllPolicy,
  deletePolicy,
  updatePolicy,
  resetState,
} from "../../../slices/policySlice";
import { useAppSelector, useAppDispatch } from "../../../store";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";

type Props = {};

const PolicyAdmin = (props: Props) => {
  const navigate = useNavigate();
  const param = useParams();
  const dispatch = useAppDispatch();

  const firstRender = useRef<boolean>(true);
  const reactQuillRef = useRef<ReactQuill>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(); // boolean or record._id
  const [value, setValue] = useState("");

  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  const [messageApi, contextHolder] = message.useMessage();

  const {
    policies,
    isSuccessCreate,
    isSuccessUpdate,
    isErrorCreate,
    isErrorUpdate,
  } = useAppSelector((state) => state.policies);

  useEffect(() => {
    firstRender.current = false;
    if (policies.length === 0) dispatch(getAllPolicy());
  }, []);

  useEffect(() => {
    if (!firstRender.current) {
      if (isErrorUpdate || isErrorCreate) {
        if (!param.id && isErrorCreate) {
          onShowMessage(`Tạo chính sách không thành công`, "error");
        } else {
          onShowMessage(`Cập nhật chính sách không thành công`, "error");
          navigate(-1);
          setSelectedPolicy(false);
        }
        updateForm.resetFields();
        dispatch(getAllPolicy());
        dispatch(resetState());
      }
      if (isSuccessUpdate || isSuccessCreate) {
        if (!param.id && isSuccessCreate) {
          onShowMessage("Tạo chính sách thành công", "success");
        } else {
          onShowMessage("Cập nhật chính sách thành công", "success");
          navigate(-1);
          setSelectedPolicy(false);
        }
        createForm.resetFields();
        dispatch(getAllPolicy());
        dispatch(resetState());
      }
    }
  }, [isSuccessCreate, isSuccessUpdate, isErrorCreate, isErrorUpdate]);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];
        const url = await uploadToCloudflare(file);
        const quill = reactQuillRef.current;
        if (quill) {
          const range = quill.getEditorSelection();
          range && quill.getEditor().insertEmbed(range.index, "image", url);
        }
      }
    };
  }, []);

  const uploadToCloudflare = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/upload`, {
      method: "POST",
      body: formData,
    });
    const result = await response.text();
    return result;
  };

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

  type FieldType = {
    name?: string;
    content?: string;
    link?: string;
  };

  const onFinish = async (values: any) => {
    await dispatch(createPolicy(values));
  };

  const onUpdate = async (values: any) => {
    await dispatch(updatePolicy({ id: selectedPolicy, values }));
  };

  const onDelete = async (values: any) => {
    await dispatch(deletePolicy(values));
    dispatch(getAllPolicy());
    onShowMessage("Xoá policy thành công");
  };

  //copy
  const handleCopy = async (values: any) => {
    await dispatch(createPolicy({ ...values, name: `${values.name} (copy)` }));
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
      title: "Tiêu đề",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (text: any, record: any, index: number) => {
        return (
          <a target="_blank" href={text} rel="noreferrer">
            {text}
          </a>
        );
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
            <Link to={`/admin/policies/${record._id}`}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedPolicy(record._id);
                  updateForm.setFieldsValue(record);
                  setValue(record.content);
                }}
              ></Button>
            </Link>

            <Popconfirm
              title="Xoá policy"
              description="Bạn có chắc xoá policy này không?"
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
      <Card title="Tạo chính sách mới" style={{ width: "100%" }}>
        <Form
          form={createForm}
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Tiêu đề chính sách"
            name="name"
            rules={[
              { required: true, message: "Vui lòng điền tiêu đề chính sách!" },
              {
                min: 2,
                message: "Tên policy phải lớn hơn 2 kí tự",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType> label="Mô tả chi tiết" name="content">
            <ReactQuill
              ref={reactQuillRef}
              theme="snow"
              placeholder="Start writing..."
              modules={{
                toolbar: {
                  container: [
                    [{ header: "1" }, { header: "2" }, { font: [""] }],
                    [{ size: [] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [
                      { list: "ordered" },
                      { list: "bullet" },
                      { indent: "-1" },
                      { indent: "+1" },
                    ],
                    [{ align: [] }],

                    [{ color: [] }, { background: [] }],
                    ["link", "image"],
                    ["clean"],
                  ],
                  handlers: {
                    image: imageHandler, // <-
                  },
                },
                clipboard: {
                  matchVisual: false,
                },
              }}
              formats={[
                "header",
                "font",
                "size",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "list",
                "bullet",
                "indent",
                "link",
                "image",
                "video",
                "code-block",
              ]}
              value={value}
              // onChange={onChange}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="Danh sách các policy">
        <Table dataSource={policies} columns={columns} />
      </Card>

      {/* form edit và delete */}
      <Modal
        width={"150vh"}
        centered
        title="Chỉnh sửa chính sách"
        onCancel={() => {
          navigate(-1);
          setSelectedPolicy(false);
        }}
        open={selectedPolicy}
        okText="Lưu"
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Card style={{ width: "100%" }}>
          <Form
            form={updateForm}
            name="update-form"
            labelCol={{ span: 24 }}
            onFinish={onUpdate}
            autoComplete="off"
            initialValues={{
              content: value,
            }}
          >
            <Form.Item<FieldType>
              label="Sửa tiêu đề"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Vui lòng điền tiêu đề chính sách!",
                },
                { min: 2, message: "Tên policy phải có ít nhất 2 ký tự!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="Mô tả chi tiết" name="content">
              <ReactQuill
                ref={reactQuillRef}
                theme="snow"
                placeholder="Start writing..."
                modules={{
                  toolbar: {
                    container: [
                      [{ header: "1" }, { header: "2" }, { font: [""] }],
                      [{ size: [] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                      ],
                      [{ align: [] }],

                      [{ color: [] }, { background: [] }],
                      ["link", "image"],
                      ["clean"],
                    ],
                    handlers: {
                      image: imageHandler, // <-
                    },
                  },
                  clipboard: {
                    matchVisual: true,
                  },
                }}
                formats={[
                  "header",
                  "font",
                  "size",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "blockquote",
                  "list",
                  "bullet",
                  "indent",
                  "link",
                  "image",
                  "video",
                  "code-block",
                ]}
                key={value}
                value={value}
              />
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default PolicyAdmin;
