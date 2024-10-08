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
  Image,
  Spin,
} from "antd";
import { useEffect } from "react";
import {
  createLocation,
  getAllLocation,
  deleteLocation,
  updateLocation,
  resetState,
} from "../../../slices/locationSlice";
import { useAppSelector, useAppDispatch } from "../../../store";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

type Props = {};

const LocationAdmin = (props: Props) => {
  const navigate = useNavigate();
  const param = useParams();
  const dispatch = useAppDispatch();

  const [albumCreate, setAlbumCreate] = useState<(string | undefined)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const firstRender = useRef<boolean>(true);
  const [selectedLocation, setSelectedLocation] = useState<any>(); // boolean or record._id

  const [messageApi, contextHolder] = message.useMessage();

  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  const {
    locations,
    isSuccessCreate,
    isSuccessUpdate,
    isErrorCreate,
    isErrorUpdate,
  } = useAppSelector((state) => state.locations);

  useEffect(() => {
    firstRender.current = false;
    if (locations.length === 0) {
      dispatch(getAllLocation());
    }
  }, []);

  useEffect(() => {
    if (!firstRender.current) {
      if (isErrorUpdate || isErrorCreate) {
        if (!param.id && isErrorCreate) {
          onShowMessage(`Tạo địa chỉ cửa hàng không thành công`, "error");
        } else {
          onShowMessage(`Cập nhật địa chỉ cửa hàng không thành công`, "error");
          navigate(-1);
          setSelectedLocation(false);
        }
        updateForm.resetFields();
        dispatch(getAllLocation());
        dispatch(resetState());
      }
      if (isSuccessUpdate || isSuccessCreate) {
        if (!param.id && isSuccessCreate) {
          onShowMessage("Tạo địa chỉ cửa hàng thành công", "success");
        } else {
          onShowMessage("Cập nhật địa chỉ cửa hàng thành công", "success");
          navigate(-1);
          setSelectedLocation(false);
        }
        createForm.resetFields();
        dispatch(getAllLocation());
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
    address?: string;
    map?: string;
    time?: string;
    description?: string;
    album?: Array<string>;
    iframe?: string;
  };

  const onFinish = async (values: any) => {
    await dispatch(createLocation({ ...values, album: albumCreate }));
    setAlbumCreate([]);
  };

  // update location modal
  const onUpdate = async (values: any) => {
    await dispatch(
      updateLocation({
        id: selectedLocation,
        values: { ...values, album: albumCreate },
      })
    );
    setAlbumCreate([]);
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteLocation(values));
    dispatch(getAllLocation());
    onShowMessage("Xoá location thành công");
    setAlbumCreate([]);
  };

  //copy
  const handleCopy = async (values: any) => {
    await dispatch(
      createLocation({ ...values, name: `${values.name} (copy)` })
    );
    setAlbumCreate([]);
  };

  const handleUploadAlbum = async (albums: any, infor: string) => {
    if (albums === undefined) {
      return;
    }
    // chuyển object sang array
    const asArrayAlbum = Object.entries(albums);
    const resultAlbum: string[] = [];
    await Promise.all(
      asArrayAlbum.map(async (album: any, index: number) => {
        setIsLoading(false);
        //  khi chuyển sang array thì phần tử thứ 2 mới là đường link
        if (
          album[1].type === "image/jpeg" ||
          album[1].type === "image/jpg" ||
          album[1].type === "image/svg+xml" ||
          album[1].type === "image/png" ||
          album[1].type === "image/webp"
        ) {
          setIsLoading(false);
          const data = new FormData();
          data.append("file", album[1]);
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND}/upload`,
            {
              method: "post",
              body: data,
            }
          );
          const result = await response.text();
          if (infor === "create") {
            resultAlbum.push(result);
            if (index === asArrayAlbum.length - 1) {
              setAlbumCreate((prev) => [...prev, ...resultAlbum]);
              setIsLoading(true);
            }
          }
        } else {
          return;
        }
      })
    );
  };

  // xoa anh ra khoi album
  const handleImageRemove = (index: number) => {
    const updatedImages = albumCreate.filter((_, id) => id !== index);
    setAlbumCreate(updatedImages);
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
                  setAlbumCreate(record.album ? record.album : []);
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
      <Card title="Tạo địa chỉ mới" style={{ width: "100%" }}>
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
          setAlbumCreate([]);
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
              {albumCreate &&
                albumCreate.map((item: any, index: number) => (
                  <div
                    key={index}
                    style={{ display: "inline-block", marginRight: 8 }}
                  >
                    <LazyLoadImage
                      effect="blur"
                      style={{ width: "100px", height: "100px" }}
                      src={item}
                      alt="setAlbumCreate"
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
