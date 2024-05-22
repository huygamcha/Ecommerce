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
  createBanner,
  getAllBanner,
  deleteBanner,
  updateBanner,
} from "../../../slices/bannerSlice";
import { useAppSelector, useAppDispatch } from "../../../store";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllCategory } from "../../../slices/categorySlice";
import { render } from "@testing-library/react";
import { IoCheckmarkCircle } from "react-icons/io5";

type Props = {};

const BannerAdmin = (props: Props) => {
  const navigate = useNavigate();
  const param = useParams();
  // không hiển thị khi lần đầu load trang
  const [initialRender, setInitialRender] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);

  // get from database
  const dispatch = useAppDispatch();

  const { banners, error } = useAppSelector((state) => state.banners);
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    setInitialRender(false);
    dispatch(getAllBanner());
    dispatch(getAllCategory());
  }, [dispatch]);

  //set active modal
  const [selectedBanner, setSelectedBanner] = useState<any>(); // boolean or record._id

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
    pic?: string;
    subBanner: boolean;
  };

  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  useEffect(() => {
    if (!initialRender) {
      if (error.message !== "") {
        if (!param.id) {
          onShowMessage(`Tạo banner không thành công`, "error");
        } else {
          onShowMessage(`Tạo banner thành công`, "error");
        }
      } else {
        if (!param.id) {
          onShowMessage("Tạo banner thành công", "success");
        } else {
          onShowMessage("Cập nhật banner thành công", "success");
          navigate(-1);
          setSelectedBanner(false);
        }
        createForm.resetFields();
      }
    }
    dispatch(getAllBanner());
  }, [isActive]);

  const onFinish = async (values: any) => {
    console.log("««««« values »»»»»", values);
    await dispatch(createBanner({ ...values, pic: pic }));
    setPic("");
    setPicDetail("");
    // setInitialRender(false);
    setIsActive(!isActive);
  };

  //copy
  const handleCopy = async (values: any) => {
    await dispatch(createBanner({ ...values, name: `${values.name} (copy)` }));
    setIsActive(!isActive);
    setPicDetail("");
    setPic("");
  };

  // update banner modal
  const onUpdate = async (values: any) => {
    console.log("««««« values »»»»»", values);
    await dispatch(
      updateBanner({
        id: selectedBanner,
        values: { ...values, pic: picDetail },
      })
    );
    setPicDetail("");
    setPic("");
    setIsActive(!isActive);
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteBanner(values));
    dispatch(getAllBanner());
    onShowMessage("Xoá banner thành công");
  };

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
      title: "Banner",
      dataIndex: "pic",
      key: "pic",
      render: (text: string, record: any) => {
        return <Image height={100} width={100} src={text}></Image>;
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
                  setPicDetail(record.pic);
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
            {pic && <Image height={100} src={pic}></Image>}
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
