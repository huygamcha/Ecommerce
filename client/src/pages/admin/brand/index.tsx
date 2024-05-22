import { useCallback, useState } from "react";
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
  // không hiển thị khi lần đầu load trang
  const [initialRender, setInitialRender] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);

  // get from database
  const dispatch = useAppDispatch();

  const { brands, error } = useAppSelector((state) => state.brands);
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    setInitialRender(false);
    dispatch(getAllBrand());
    dispatch(getAllCategory());
  }, [dispatch]);

  //set active modal
  const [selectedBrand, setSelectedBrand] = useState<any>(); // boolean or record._id

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
    categoryId: string;
    pic?: string;
  };

  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  useEffect(() => {
    if (!initialRender) {
      if (error.message !== "") {
        if (!param.id) {
          onShowMessage(`${error.errors?.name}`, "error");
        } else {
          onShowMessage(`${error.errors?.name}`, "error");
        }
      } else {
        if (!param.id) {
          onShowMessage("Tạo thương hiệu thành công", "success");
        } else {
          onShowMessage("Cập nhật thương hiệu thành công", "success");
          navigate(-1);
          setSelectedBrand(false);
        }
        createForm.resetFields();
      }
    }
    dispatch(getAllBrand());
  }, [isActive]);

  const onFinish = async (values: any) => {
    console.log("««««« values »»»»»", values);
    await dispatch(createBrand({ ...values, pic: pic }));
    setPic("");
    // setInitialRender(false);
    setIsActive(!isActive);
  };
  //copy
  const handleCopy = async (values: any) => {
    await dispatch(createBrand({ ...values, name: `${values.name} (copy)` }));
    setIsActive(!isActive);
  };

  // update brand modal
  const onUpdate = async (values: any) => {
    await dispatch(
      updateBrand({ id: selectedBrand, values: { ...values, pic: picDetail } })
    );
    setPicDetail("");
    setIsActive(!isActive);
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteBrand(values));
    dispatch(getAllBrand());
    onShowMessage("Xoá thương hiệu thành công");
  };

  console.log("««««« initialRender »»»»»", initialRender);

  // upload image
  const [picDetail, setPicDetail] = useState<string>();
  const [pic, setPic] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const postDetails = (pics: any, infor: string) => {
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
      data.append("upload_preset", "pbl3_chatbot");
      data.append("cloud_name", "drqphlfn6");
      fetch("https://api.cloudinary.com/v1_1/drqphlfn6/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(true);
          if (infor === "create") {
            setPic(data.url.toString());
            createForm.setFieldValue("pic", data.url.toString());
          } else {
            setPicDetail(data.url.toString());
          }
          console.log(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return;
    }
    console.log("««««« pic »»»»»", pic);
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
                  setPicDetail(record.pic);
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

          <Form.Item wrapperCol={{ offset: 6 }}>
            {isLoading ? (
              <Button type="primary" htmlType="submit">
                Thêm thương hiệu
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

export default Brand;
