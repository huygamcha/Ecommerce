/* eslint-disable react-hooks/exhaustive-deps */
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
  Image,
  Spin,
} from "antd";
import { useEffect } from "react";
import {
  createBrand,
  getAllBrand,
  deleteBrand,
  updateBrand,
  resetState,
} from "../../../slices/brandSlice";
import { useAppSelector, useAppDispatch } from "../../../store";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllCategory } from "../../../slices/categorySlice";
import { render } from "@testing-library/react";

type Props = {};

const Brand = (props: Props) => {
  const navigate = useNavigate();
  const param = useParams();
  const dispatch = useAppDispatch();

  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  const firstRender = useRef<boolean>(true);
  const [selectedBrand, setSelectedBrand] = useState<any>();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { categories } = useAppSelector((state) => state.categories);
  const {
    brands,
    isSuccessCreate,
    isSuccessUpdate,
    isErrorCreate,
    isErrorUpdate,
  } = useAppSelector((state) => state.brands);

  useEffect(() => {
    firstRender.current = false;
    if (brands.length === 0) dispatch(getAllBrand());
    if (categories.length === 0) dispatch(getAllCategory());
  }, []);

  useEffect(() => {
    if (!firstRender.current) {
      if (isErrorUpdate || isErrorCreate) {
        if (!param.id && isErrorCreate) {
          onShowMessage(`Tạo thương hiêu không thành công`, "error");
        } else {
          onShowMessage(`Cập nhật thương hiêu không thành công`, "error");
          navigate(-1);
          setSelectedBrand(false);
        }
        updateForm.resetFields();
        dispatch(getAllBrand());
        dispatch(resetState());
      }
      if (isSuccessUpdate || isSuccessCreate) {
        if (!param.id && isSuccessCreate) {
          onShowMessage("Tạo thương hiệu thành công", "success");
        } else {
          onShowMessage("Cập nhật thương hiệu thành công", "success");
          navigate(-1);
          setSelectedBrand(false);
        }
        createForm.resetFields();
        dispatch(getAllBrand());
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
    categoryId: string;
    pic?: string;
  };

  const onFinish = async (values: any) => {
    await dispatch(createBrand(values));
  };

  const handleCopy = async (values: any) => {
    await dispatch(createBrand({ ...values, name: `${values.name} (copy)` }));
  };

  const onUpdate = async (values: any) => {
    await dispatch(updateBrand({ id: selectedBrand, values: { ...values } }));
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteBrand(values));
    dispatch(getAllBrand());
    onShowMessage("Xoá thương hiệu thành công");
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
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (text: string, record: any) => {
        return <Space>{record.category.name}</Space>;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Image",
      dataIndex: "pic",
      key: "pic",
      render: (text: string, record: any) => {
        return (
          <Image height={60} width={60} src={text}>
            {record.category.name}
          </Image>
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
            <Link to={`/admin/brands/${record._id}`}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedBrand(record._id);
                  updateForm.setFieldsValue(record);
                }}
              ></Button>
            </Link>

            <Popconfirm
              title="Xoá thương hiệu"
              description="Bạn có chắc xoá thương hiệu này không?"
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
      <Card title="Tạo thương hiệu mới" style={{ width: "100%" }}>
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
            label="Tên thương hiệu"
            name="name"
            rules={[
              { required: true, message: "Vui lòng điền tên thương hiệu!" },
              {
                min: 2,
                message: "Tên thương hiệu phải lớn hơn 2 kí tự",
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Danh mục"
            name="categoryId"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
            hasFeedback
          >
            <Select
              options={categories.map((item: any) => {
                return {
                  label: item.name,
                  value: item._id,
                };
              })}
            />
          </Form.Item>

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
            ></Input>
            {createForm.getFieldValue("pic") && (
              <Image height={100} src={createForm.getFieldValue("pic")}></Image>
            )}
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
      <Card title="Danh sách các thương hiệu">
        <Table dataSource={brands} columns={columns} />
      </Card>

      {/* form edit và delete */}
      <Modal
        centered
        title="Chỉnh sửa thương hiệu"
        onCancel={() => {
          navigate(-1);
          setSelectedBrand(false);
        }}
        open={selectedBrand}
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
            <Form.Item<FieldType>
              label="Sửa thương hiệu"
              name="name"
              rules={[
                { required: true, message: "Vui lòng điền tên thương hiệu!" },
                { min: 2, message: "Tên thương hiệu phải có ít nhất 2 ký tự!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Danh mục"
              name="categoryId"
              rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
              hasFeedback
            >
              <Select
                options={categories.map((item: any) => {
                  return {
                    label: item.name,
                    value: item._id,
                  };
                })}
              />
            </Form.Item>

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
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default Brand;
