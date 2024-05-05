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
  createPolicy,
  getAllPolicy,
  deletePolicy,
  updatePolicy,
} from "../../../slices/policySlice";
import { useAppSelector, useAppDispatch } from "../../../store";
import { useForm } from "antd/es/form/Form";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";

type Props = {};

const PolicyAdmin = (props: Props) => {
  const navigate = useNavigate();
  const param = useParams();
  // không hiển thị khi lần đầu load trang
  const [initialRender, setInitialRender] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);
  // get from database
  const dispatch = useAppDispatch();

  const { policies, error } = useAppSelector((state) => state.policies);

  useEffect(() => {
    setInitialRender(false);
    if (policies.length === 0) dispatch(getAllPolicy());
  }, [dispatch]);

  //set active modal
  const [selectedPolicy, setSelectedPolicy] = useState<any>(); // boolean or record._id
  const [value, setValue] = useState("");
  const reactQuillRef = useRef<ReactQuill>(null);
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];
        const url = await uploadToCloudinary(file);
        const quill = reactQuillRef.current;
        if (quill) {
          const range = quill.getEditorSelection();
          range && quill.getEditor().insertEmbed(range.index, "image", url);
        }
      }
    };
  }, []);
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pbl3_chatbot");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/drqphlfn6/image/upload",
      {
        method: "post",
        body: formData,
      }
    );
    const data = await res.json();
    const url = data.url;
    return url;
  };

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
    content?: string;
    link?: string;
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
          onShowMessage("Tạo chính sách thành công", "success");
        } else {
          onShowMessage("Cập nhật chính sách thành công", "success");
          navigate(-1);
          setSelectedPolicy(false);
        }
        createForm.resetFields();
      }
    }
    dispatch(getAllPolicy());
  }, [isActive]);

  const onFinish = async (values: any) => {
    await dispatch(createPolicy(values));
    // setInitialRender(false);
    setIsActive(!isActive);
  };

  // update policy modal

  const onUpdate = async (values: any) => {
    await dispatch(updatePolicy({ id: selectedPolicy, values: values }));
    setIsActive(!isActive);
  };

  const onDelete = async (values: any) => {
    await dispatch(deletePolicy(values));
    dispatch(getAllPolicy());
    onShowMessage("Xoá policy thành công");
  };

  //copy
  const handleCopy = async (values: any) => {
    await dispatch(createPolicy({ ...values, name: `${values.name} (copy)` }));
    setIsActive(!isActive);
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
          initialValues={{ name: "", description: "" }}
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
              {},
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
        width={"200vh"}
        centered
        title="Chỉnh sửa chính sách"
        onCancel={() => {
          navigate(-1);
          setSelectedPolicy(false);
        }}
        open={selectedPolicy}
        okText="Save changes"
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Card style={{ width: "100%" }}>
          <Form
            form={updateForm}
            name="update-form"
            labelCol={{ span: 24 }}
            initialValues={{ name: "", description: "" }}
            onFinish={onUpdate}
            autoComplete="off"
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
                value="abc"
                // onChange={onChange}
              />
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default PolicyAdmin;
