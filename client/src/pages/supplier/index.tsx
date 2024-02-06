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

type Props = {};

const Supplier = (props: Props) => {
  // không hiển thị khi lần đầu load trang
  const [initialRender, setInitialRender] = useState<boolean>(true);
  const [nameForm, setNameForm] = useState<string>("");
  // get from database
  const dispatch = useAppDispatch();

  const { suppliers, supplier, error } = useAppSelector(
    (state) => state.suppliers
  );

  useEffect(() => {
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
        if (nameForm === "create") {
          onShowMessage("Tạo nhà cung cấp không thành công", "error");
        } else {
          onShowMessage("Cập nhật nhà cung cấp không thành công", "error");
        }
      } else {
        if (nameForm === "create") {
          onShowMessage("Tạo nhà cung cấp thành công", "success");
        } else {
          onShowMessage("Cập nhật nhà cung cấp thành công", "success");
        }
        dispatch(getAllSupplier());
        createForm.resetFields();
      }
    }
  }, [error, createForm, onShowMessage, dispatch, updateForm, nameForm]);

  const onFinish = async (values: any) => {
    await dispatch(createSupplier(values));
    setNameForm("create");
    setInitialRender(false);
  };

  // update supplier modal
  const onUpdate = async (values: any) => {
    await dispatch(updateSupplier({ id: selectedSupplier, values: values }));
    setSelectedSupplier(false);
    setNameForm("update");
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteSupplier(values));
    dispatch(getAllSupplier());
    onShowMessage("Xoá nhà cung cấp thành công");
  };

  // console.log("««««« supplier »»»»»", supplier);
  // console.log("««««« suppliers »»»»»", suppliers);
  // console.log("««««« error »»»»»", error);

  // table
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      width: "1%",
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
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedSupplier(record._id);
                updateForm.setFieldsValue(record);
              }}
            />

            <Popconfirm
              title="Xoá nhà cung cấp"
              description="Bạn có chắc xoá nhà cung cấp này không?"
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
          <Form.Item<FieldType> label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label="Số điện thoại" name="phoneNumber">
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label="Địa chỉ" name="address">
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
        onCancel={() => setSelectedSupplier(false)}
        open={selectedSupplier}
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
            <Form.Item<FieldType> label="Tên nhà cung cấp" name="name">
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="Email" name="email">
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="Số điện thoại" name="phoneNumber">
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="Địa chỉ" name="address">
              <Input />
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default Supplier;
