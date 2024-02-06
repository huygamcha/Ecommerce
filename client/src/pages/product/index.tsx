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
  InputNumber,
  Select,
} from "antd";
import { useEffect } from "react";
import {
  createProduct,
  getAllProduct,
  deleteProduct,
  updateProduct,
} from "../../slices/productSlice";
import { useAppSelector, useAppDispatch } from "../../store";
import { useForm } from "antd/es/form/Form";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { getAllCategory } from "../../slices/categorySlice";
import { getAllSupplier } from "../../slices/supplierSlice";

type Props = {};

const Product = (props: Props) => {
  // không hiển thị khi lần đầu load trang
  const [initialRender, setInitialRender] = useState<boolean>(true);
  const [nameForm, setNameForm] = useState<string>("");
  // get from database
  const dispatch = useAppDispatch();

  const { products, product, error } = useAppSelector(
    (state) => state.products
  );
  const { categories } = useAppSelector((state) => state.categories);
  const { suppliers } = useAppSelector((state) => state.suppliers);

  useEffect(() => {
    dispatch(getAllProduct());
    dispatch(getAllCategory());
    dispatch(getAllSupplier());
  }, [dispatch]);

  //set active modal
  const [selectedProduct, setSelectedProduct] = useState<any>(); // boolean or record._id

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
    description?: string;
    price: number;
    stock: number;
    discount: number;
    categoryId: string;
    supplierId: string;
  };

  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  useEffect(() => {
    if (!initialRender) {
      if (error) {
        if (nameForm === "create") {
          onShowMessage("Tạo danh mục không thành công", "error");
        } else {
          onShowMessage("Cập nhật danh mục không thành công", "error");
        }
      } else {
        if (nameForm === "create") {
          onShowMessage("Tạo danh mục thành công", "success");
        } else {
          onShowMessage("Cập nhật danh mục thành công", "success");
        }
        createForm.resetFields();
      }
      dispatch(getAllProduct());
    }
  }, [error, createForm, onShowMessage, dispatch, updateForm, nameForm]);

  const onFinish = async (values: any) => {
    await dispatch(createProduct(values));
    setNameForm("create");
    setInitialRender(false);
  };

  // update product modal
  const onUpdate = async (values: any) => {
    await dispatch(updateProduct({ id: selectedProduct, values: values }));
    setSelectedProduct(false);
    setNameForm("update");
  };

  const onDelete = async (values: any) => {
    console.log("««««« values »»»»»", values);
    await dispatch(deleteProduct(values));
    dispatch(getAllProduct());
    onShowMessage("Xoá danh mục thành công");
  };

  // console.log("««««« product »»»»»", product);
  // console.log("««««« products »»»»»", products);
  // console.log("««««« error »»»»»", error);
  // console.log("««««« suppliers »»»»»", suppliers);

  // table
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      width: "1%",
    },
    {
      title: "Danh mục",
      dataIndex: "category", // Access nested property
      key: "category.name",
      render: (text: any, record: any) => record.category.name, // Render nested data
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier", // Access nested property
      key: "supplier.name",
      render: (text: any, record: any) => record.supplier.name, // Render nested data
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: "1%",
    },
    {
      title: "Số lượng",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
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
                setSelectedProduct(record._id);
                updateForm.setFieldsValue(record);
              }}
            />

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
      <Card title="Tạo danh mục mới" style={{ width: "100%" }}>
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
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Danh mục"
            name="categoryId"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
            hasFeedback
            // help={error ? "ok" : "123"}
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
            label="Nhà cung cấp"
            name="supplierId"
            rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp!" }]}
            hasFeedback
          >
            <Select
              options={suppliers.map((item: any) => {
                return {
                  label: item.name,
                  value: item._id,
                };
              })}
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="Giá sản phẩm"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
            hasFeedback
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item<FieldType> label="Giảm giá" name="discount" hasFeedback>
            <InputNumber defaultValue={0} min={0} max={75} />
          </Form.Item>

          <Form.Item<FieldType>
            label="Số lượng sản phẩm"
            name="stock"
            hasFeedback
          >
            <InputNumber defaultValue={0} min={0} />
          </Form.Item>

          <Form.Item<FieldType> label="Mô  tả" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit">
              Thêm sản phẩm
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="Danh sách các danh mục">
        <Table dataSource={products} columns={columns} />
      </Card>

      {/* form edit và delete */}
      <Modal
        centered
        title="Chỉnh sửa danh mục"
        onCancel={() => setSelectedProduct(false)}
        open={selectedProduct}
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
              label="Tên sản phẩm"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm!" },
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
              // help={error ? "ok" : "123"}
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
              label="Nhà cung cấp"
              name="supplierId"
              rules={[
                { required: true, message: "Vui lòng chọn nhà cung cấp!" },
              ]}
              hasFeedback
            >
              <Select
                options={suppliers.map((item: any) => {
                  return {
                    label: item.name,
                    value: item._id,
                  };
                })}
              />
            </Form.Item>

            <Form.Item<FieldType>
              label="Giá sản phẩm"
              name="price"
              rules={[
                { required: true, message: "Vui lòng nhập giá sản phẩm!" },
              ]}
              hasFeedback
            >
              <InputNumber min={0} />
            </Form.Item>

            <Form.Item<FieldType> label="Giảm giá" name="discount" hasFeedback>
              <InputNumber defaultValue={0} min={0} max={75} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Số lượng sản phẩm"
              name="stock"
              hasFeedback
            >
              <InputNumber defaultValue={0} min={0} />
            </Form.Item>

            <Form.Item<FieldType> label="Mô  tả" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default Product;
