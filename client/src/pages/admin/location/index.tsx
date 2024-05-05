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
    await dispatch(createLocation(values));
    // setInitialRender(false);
    setIsActive(!isActive);
  };

  // update location modal

  const onUpdate = async (values: any) => {
    await dispatch(updateLocation({ id: selectedLocation, values: values }));
    setIsActive(!isActive);
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteLocation(values));
    dispatch(getAllLocation());
    onShowMessage("Xoá location thành công");
  };

  //copy
  const handleCopy = async (values: any) => {
    await dispatch(
      createLocation({ ...values, name: `${values.name} (copy)` })
    );
    setIsActive(!isActive);
  };

  console.log("««««« initialRender »»»»»", initialRender);

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

          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
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
        okText="Save changes"
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
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default LocationAdmin;
