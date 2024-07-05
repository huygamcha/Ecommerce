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
  Image,
  Spin,
} from "antd";
import { useEffect } from "react";
import {
  createLocation,
  getAllLocation,
  deleteLocation,
  updateLocation,
} from "../../../slices/locationSlice";
import { useAppSelector, useAppDispatch } from "../../../store";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";

type Props = {};

const LocationAdmin = (props: Props) => {
  const navigate = useNavigate();
  const param = useParams();
  // không hiển thị khi lần đầu load trang
  const [initialRender, setInitialRender] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);
  // get from database
  const dispatch = useAppDispatch();

  const { locations, error } = useAppSelector((state) => state.locations);

  useEffect(() => {
    setInitialRender(false);
    if (locations.length === 0) {
      dispatch(getAllLocation());
    }
  }, [dispatch]);

  //set active modal
  const [selectedLocation, setSelectedLocation] = useState<any>(); // boolean or record._id

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
    address?: string;
    map?: string;
    time?: string;
    description?: string;
    album?: Array<string>;
    iframe?: string;
  };

  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  useEffect(() => {
    if (!initialRender) {
      if (!param.id) {
        onShowMessage("Tạo địa chỉ thành công", "success");
      } else {
        onShowMessage("Cập nhật địa chỉ thành công", "success");
        navigate(-1);
        setSelectedLocation(false);
      }
      createForm.resetFields();
    }
    dispatch(getAllLocation());
  }, [isActive]);

  const onFinish = async (values: any) => {
    console.log("««««« values »»»»»", values, albumCreate);
    await dispatch(createLocation({ ...values, album: albumCreate }));
    // setInitialRender(false);
    setIsActive(!isActive);
    setAlbumCreate([]);
    setAlbumUpdate([]);
    setPic("");
    setPicDetail("");
    setPicAdd("");
  };

  // update location modal
  const onUpdate = async (values: any) => {
    await dispatch(
      updateLocation({
        id: selectedLocation,
        values: { ...values, album: albumUpdate },
      })
    );
    setIsActive(!isActive);
    setAlbumCreate([]);
    setAlbumUpdate([]);
    setPic("");
    setPicDetail("");
    setPicAdd("");
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteLocation(values));
    dispatch(getAllLocation());
    onShowMessage("Xoá location thành công");
    setAlbumCreate([]);
    setAlbumUpdate([]);
    setPic("");
    setPicDetail("");
    setPicAdd("");
  };

  //copy
  const handleCopy = async (values: any) => {
    await dispatch(
      createLocation({ ...values, name: `${values.name} (copy)` })
    );
    setIsActive(!isActive);
    setAlbumCreate([]);
    setAlbumUpdate([]);
    setPic("");
    setPicDetail("");
    setPicAdd("");
  };

  // album
  const [albumUpdate, setAlbumUpdate] = useState<(string | undefined)[]>([]);
  const [albumCreate, setAlbumCreate] = useState<(string | undefined)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [picDetail, setPicDetail] = useState<string>();
  const [picAdd, setPicAdd] = useState<string>();
  const [pic, setPic] = useState<string>();

  // image screen with add
  const handleImageAdd = (pics: any) => {
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
          setPicAdd(data.url.toString());
          setIsLoading(true);
          setAlbumUpdate([...albumUpdate, data.url.toString()]);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return;
    }
    console.log("««««« pic »»»»»", pic);
  };
  const handleUploadAlbum = async (albums: any, infor: string) => {
    if (albums === undefined) {
      return;
    }
    // chuyển object sang array
    const asArrayAlbum = Object.entries(albums);
    const resultAlbum: string[] = [];
    await Promise.all(
      asArrayAlbum.map((album: any, index: number) => {
        setIsLoading(false);
        //  khi chuyển sang array thì phần tử thứ 2 mới là đường link
        if (album[1].type === "image/jpeg" || album[1].type === "image/png") {
          setIsLoading(false);
          const data = new FormData();
          data.append("file", album[1]);
          data.append("upload_preset", "pbl3_chatbot");
          data.append("cloud_name", "drqphlfn6");
          fetch("https://api.cloudinary.com/v1_1/drqphlfn6/image/upload", {
            method: "post",
            body: data,
          })
            .then((res) => res.json())
            .then((data) => {
              if (infor === "create") {
                console.log("««««« resultAlbum »»»»»", resultAlbum);
                resultAlbum.push(data.url.toString());
                if (index === asArrayAlbum.length - 1) {
                  setAlbumCreate(resultAlbum);
                  setIsLoading(true);
                }
              } else {
                setPicDetail(data.url.toString());
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          return;
        }
      })
    );
  };
  // xoa anh ra khoi album
  const handleImageRemove = (index: number) => {
    const updatedImages = [...albumUpdate];
    updatedImages.splice(index, 1);
    setAlbumUpdate(updatedImages);
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
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Chỉ đường",
      dataIndex: "map",
      key: "map",
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
            <Link to={`/admin/locations/${record._id}`}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedLocation(record._id);
                  updateForm.setFieldsValue(record);
                  setAlbumUpdate(record.album ? record.album : []);
                  setPicDetail(record.pic);
                }}
              ></Button>
            </Link>

            <Popconfirm
              title="Xoá location"
              description="Bạn có chắc xoá location này không?"
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
      <Card title="Tạo location mới" style={{ width: "100%" }}>
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
            label="Tên cửa hàng"
            name="name"
            rules={[
              { required: true, message: "Vui lòng điền tên cửa hàng!" },
              {
                min: 2,
                message: "Tên cửa hàng phải lớn hơn 2 kí tự",
              },
              {},
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Địa chỉ cửa hàng"
            name="address"
            rules={[
              { required: true, message: "Vui lòng điền địa chỉ cửa hàng!" },
              {
                min: 2,
                message: "Địa chỉ cửa hàng phải lớn hơn 2 kí tự",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Thời gian hoạt động"
            name="time"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập thời gian hoạt động!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Chỉ đường"
            name="map"
            rules={[{ required: true, message: "Vui lòng nhập chỉ đường!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            rules={[
              { required: true, message: "Vui lòng nhập hình ảnh bản đồ!" },
            ]}
            label="Hình ảnh bản đồ"
            name="iframe"
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mô tả thời gian hoạt động"
            name="description"
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label="Album ảnh" name="album">
            <Input
              type="file"
              multiple={true}
              accept="image/*"
              onChange={(e) => {
                const albumProduct = e.target.files;
                if (albumProduct) {
                  handleUploadAlbum(albumProduct, "create");
                }
              }}
            ></Input>
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
      <Card title="Danh sách các cửa hàng">
        <Table dataSource={locations} columns={columns} />
      </Card>

      {/* form edit và delete */}
      <Modal
        centered
        title="Chỉnh sửa cửa hàng"
        onCancel={() => {
          navigate(-1);
          setSelectedLocation(false);
        }}
        open={selectedLocation}
        okText="Lưu"
        onOk={() => {
          updateForm.submit();
        }}
        confirmLoading={!isLoading}
        width={"150vh"}
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
              label="Tên cửa hàng"
              name="name"
              rules={[
                { required: true, message: "Vui lòng điền tên cửa hàng!" },
                { min: 2, message: "tên cửa hàng phải có ít nhất 2 ký tự!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              label="Thời gian"
              name="time"
              rules={[
                { required: true, message: "Vui lòng điền tên cửa hàng!" },
                { min: 2, message: "tên cửa hàng phải có ít nhất 2 ký tự!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              label="Địa chỉ"
              name="address"
              rules={[
                { required: true, message: "Vui lòng điền tên cửa hàng!" },
                { min: 2, message: "tên cửa hàng phải có ít nhất 2 ký tự!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              label="Chỉ đường "
              name="map"
              rules={[
                { required: true, message: "Vui lòng điền tên cửa hàng!" },
                { min: 2, message: "tên cửa hàng phải có ít nhất 2 ký tự!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              rules={[
                { required: true, message: "Vui lòng nhập hình ảnh bản đồ!" },
              ]}
              label="Hình ảnh bản đồ"
              name="iframe"
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Mô tả thời gian hoạt động"
              name="description"
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType> label="Album ảnh" name="album">
              {picAdd && (
                <Image title="Thêm ảnh" height={100} src={picAdd}></Image>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selectedFile = e.target.files && e.target.files[0];
                  if (selectedFile) {
                    handleImageAdd(selectedFile);
                  }
                }}
              ></Input>
              {albumUpdate &&
                albumUpdate.map((item: any, index: number) => (
                  <div
                    key={index}
                    style={{ display: "inline-block", marginRight: 8 }}
                  >
                    <img
                      style={{ width: "100px", height: "100px" }}
                      src={item}
                      alt=""
                    />
                    <Button
                      onClick={() => handleImageRemove(index)}
                      type="link"
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default LocationAdmin;
