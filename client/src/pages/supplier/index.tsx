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
  createSupplier,
  getAllSupplier,
  deleteSupplier,
  updateSupplier,
} from "../../slices/supplierSlice";
import { useAppSelector, useAppDispatch } from "../../store";
import { useForm } from "antd/es/form/Form";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";

type Props = {};

const Supplier = (props: Props) => {
  const navigate = useNavigate();
  const param = useParams();
  // không hiển thị khi lần đầu load trang
  const [initialRender, setInitialRender] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);
  // get from database
  const dispatch = useAppDispatch();

  const { suppliers, error, loading } = useAppSelector(
    (state) => state.suppliers
  );

  useEffect(() => {
    setInitialRender(false);
    dispatch(getAllSupplier());
  }, [dispatch]);

  //set active modal
  const [selectedSupplier, setSelectedSupplier] = useState<any>(); // boolean or record._id

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
    email?: string;
    phoneNumber?: string;
    address?: string;
  };

  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  useEffect(() => {
    if (!initialRender) {
      if (error) {
        if (!param.id) {
          onShowMessage("Tạo nhà cung cấp không thành công", "error");
        } else {
          onShowMessage("Cập nhật nhà cung cấp không thành công", "error");
        }
      } else {
        if (!param.id) {
          onShowMessage("Tạo nhà cung cấp thành công", "success");
        } else {
          onShowMessage("Cập nhật nhà cung cấp thành công", "success");
        }
        createForm.resetFields();
      }
    }
  }, [createForm, onShowMessage, dispatch, updateForm, isActive]);

  const onFinish = async (values: any) => {
    await dispatch(createSupplier(values));
    // setInitialRender(false);
    setIsActive(!isActive);
    dispatch(getAllSupplier());
  };

  // update supplier modal

  // xác định form tạo hoặc update
  const handleClose = () => {
    navigate(-1);
    setSelectedSupplier(false);
  };

  const onUpdate = async (values: any) => {
    console.log("««««« values »»»»»", values, selectedSupplier);
    await dispatch(updateSupplier({ id: selectedSupplier, values: values }));
    dispatch(getAllSupplier());
    // setInitialRender(false);
    setIsActive(!isActive);
    handleClose();
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteSupplier(values));
    dispatch(getAllSupplier());
    onShowMessage("Xoá nhà cung cấp thành công");
  };

  // console.log("««««« supplier »»»»»", supplier);
  // console.log("««««« suppliers »»»»»", suppliers);
  // console.log("««««« error »»»»»", error);
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: "1%",
      render: (text: any, record: any) => {
        return (
          <Space size="small">
            <Link to={`/admin/suppliers/${record._id}`}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedSupplier(record._id);
                  updateForm.setFieldsValue(record);
                }}
              ></Button>
            </Link>

            <Popconfirm
              title="Xoá danh mục"
              description="Bạn có chắc xoá danh mục này không?"
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
      <Card title="Tạo nhà cung cấp mới" style={{ width: "100%" }}>
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
            label="Tên nhà cung cấp"
            name="name"
            rules={[
              { required: true, message: "Vui lòng điền tên nhà cung cấp!" },
              {
                min: 2,
                message: "Tên nhà cung cấp phải lớn hơn 2 kí tự",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng điền email nhà cung cấp!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Vui lòng điền số điện thoại nhà cung cấp!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Địa chỉ"
            name="address"
            rules={[
              {
                required: true,
                message: "Vui lòng điền địa chỉ nhà cung cấp!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit">
              Thêm nhà cung cấp
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="Danh sách các nhà cung cấp">
        <Table dataSource={suppliers} columns={columns} />
      </Card>

      {/* form edit và delete */}
      <Modal
        centered
        title="Chỉnh sửa nhà cung cấp"
        onCancel={() => {
          navigate(-1);
          setSelectedSupplier(false);
        }}
        open={selectedSupplier}
        okText="Save changes"
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form
          form={updateForm}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          initialValues={{ name: "", description: "" }}
          onFinish={onUpdate}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Tên nhà cung cấp"
            name="name"
            rules={[
              { required: true, message: "Vui lòng điền tên nhà cung cấp!" },
              {
                min: 2,
                message: "Tên nhà cung cấp phải lớn hơn 2 kí tự",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng điền email nhà cung cấp!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Vui lòng điền số điện thoại nhà cung cấp!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Địa chỉ"
            name="address"
            rules={[
              {
                required: true,
                message: "Vui lòng điền địa chỉ nhà cung cấp!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Supplier;
