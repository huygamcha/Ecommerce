/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo, useRef, useState } from "react";
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
  Image,
  Spin,
} from "antd";
import { useEffect } from "react";
import {
  createBanner,
  getAllBanner,
  deleteBanner,
  updateBanner,
  resetState,
} from "../../../slices/bannerSlice";
import { useAppSelector, useAppDispatch } from "../../../store";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllCategory } from "../../../slices/categorySlice";
import { IoCheckmarkCircle } from "react-icons/io5";

type Props = {};

const BannerAdmin = (props: Props) => {
  const navigate = useNavigate();
  const param = useParams();
  const dispatch = useAppDispatch();

  // không hiển thị khi lần đầu load trang
  const firstRender = useRef<boolean>(true);
  const [selectedBanner, setSelectedBanner] = useState<any>(); // boolean or record._id
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  const [messageApi, contextHolder] = message.useMessage();

  const {
    banners,
    isSuccessCreate,
    isSuccessUpdate,
    isErrorCreate,
    isErrorUpdate,
  } = useAppSelector((state) => state.banners);
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    firstRender.current = false;
    if (banners.length === 0) dispatch(getAllBanner());
    if (categories.length === 0) dispatch(getAllCategory());
  }, []);

  useEffect(() => {
    if (!firstRender.current) {
      if (isErrorUpdate || isErrorCreate) {
        if (!param.id && isErrorCreate) {
          onShowMessage(`Tạo banner không thành công`, "error");
        } else {
          onShowMessage(`Cập nhật banner không thành công`, "error");
          navigate(-1);
          setSelectedBanner(false);
        }
        updateForm.resetFields();
        dispatch(getAllBanner());
        dispatch(resetState());
      }
      if (isSuccessUpdate || isSuccessCreate) {
        if (!param.id && isSuccessCreate) {
          onShowMessage("Tạo banner thành công", "success");
        } else {
          onShowMessage("Cập nhật banner thành công", "success");
          navigate(-1);
          setSelectedBanner(false);
        }
        createForm.resetFields();
        dispatch(getAllBanner());
        dispatch(resetState());
      }
    }
  }, [isSuccessCreate, isSuccessUpdate, isErrorCreate, isErrorUpdate]);

  const MESSAGE_TYPE = useMemo(
    () => ({
      SUCCESS: "success",
      INFO: "info",
      WARNING: "warning",
      ERROR: "error",
    }),
    []
  );

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
      title: "Banner",
      dataIndex: "pic",
      key: "pic",
      render: (text: string, record: any) => {
        return <Image height={100} width={100} src={text}></Image>;
      },
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (text: string, record: any) => {
        return (
          <a href={text} target="_blank" rel="noreferrer">
            {text}
          </a>
        );
      },
    },
    {
      title: "SubBanner",
      dataIndex: "subBanner",
      key: "subBanner",
      render: (text: string, record: any) => {
        return (
          <div>
            {text && (
              <IoCheckmarkCircle
                style={{ fontSize: "20px", color: "#266ce0" }}
              />
            )}
          </div>
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
            <Link to={`/admin/banners/${record._id}`}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedBanner(record._id);
                  updateForm.setFieldsValue(record);
                }}
              ></Button>
            </Link>

            <Popconfirm
              title="Xoá banner"
              description="Bạn có chắc xoá banner này không?"
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

  // type form
  type FieldType = {
    pic?: string;
    subBanner: boolean;
    link: boolean;
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

  const onFinish = async (values: any) => {
    dispatch(createBanner({ ...values }));
  };

  const handleCopy = async (values: any) => {
    await dispatch(createBanner({ ...values, name: `${values.name} (copy)` }));
  };

  const onUpdate = async (values: any) => {
    await dispatch(
      updateBanner({
        id: selectedBanner,
        values,
      })
    );
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteBanner(values));
    dispatch(getAllBanner());
    onShowMessage("Xoá banner thành công");
  };

  const postDetails = async (pics: any, infor: string) => {
    if (pics === undefined) {
      return;
    }
    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/jpg" ||
      pics.type === "image/svg+xml" ||
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
        createForm.setFieldValue("pic", result);
      } else {
        updateForm.setFieldValue("pic", result);
      }
    } else {
      return;
    }
  };
  return (
    <div>
      {contextHolder}
      <Card title="Tạo banner mới" style={{ width: "100%" }}>
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
            rules={[{ required: true, message: "Vui lòng chọn hình ảnh!" }]}
            name="pic"
            label="Hình ảnh"
          >
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.target.files && e.target.files[0];
                if (selectedFile) {
                  postDetails(selectedFile, "create");
                }
              }}
            ></Input>{" "}
            {createForm.getFieldValue("pic") && (
              <Image height={100} src={createForm.getFieldValue("pic")}></Image>
            )}
          </Form.Item>

          <Form.Item<FieldType> name="link" label="Link">
            <Input></Input>
          </Form.Item>

          <Form.Item<FieldType> name="subBanner" label="Sub Banner">
            <Select
              options={[
                { value: true, label: "Chọn làm sub banner" },
                { value: false, label: "Chọn làm banner chính" },
              ]}
            ></Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6 }}>
            {isLoading ? (
              <Button type="primary" htmlType="submit">
                Thêm banner
              </Button>
            ) : (
              <Spin />
            )}
          </Form.Item>
        </Form>
      </Card>
      <Card title="Danh sách các banner">
        <Table dataSource={banners} columns={columns} />
      </Card>

      {/* form edit và delete */}
      <Modal
        centered
        title="Chỉnh sửa banner"
        onCancel={() => {
          navigate(-1);
          setSelectedBanner(false);
        }}
        open={selectedBanner}
        confirmLoading={!isLoading}
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
            <Form.Item<FieldType> name="pic" label="Hình ảnh">
              <Image height={100} src={updateForm.getFieldValue("pic")}></Image>
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
            <Form.Item<FieldType> name="link" label="Link">
              <Input></Input>
            </Form.Item>
            <Form.Item<FieldType> name="subBanner" label="Sub Banner">
              <Select
                options={[
                  { value: true, label: "Chọn làm sub banner" },
                  { value: false, label: "Chọn làm banner chính" },
                ]}
              ></Select>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default BannerAdmin;
