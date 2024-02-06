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
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllSupplier } from "../../slices/supplierSlice";
import { getAllCategory } from "../../slices/categorySlice";
import { render } from "@testing-library/react";

type Props = {};

const Product = (props: Props) => {
  const navigate = useNavigate();
  const param = useParams();
  // không hiển thị khi lần đầu load trang
  const [initialRender, setInitialRender] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);
  // get from database
  const dispatch = useAppDispatch();

  const { products, error } = useAppSelector((state) => state.products);
  const { suppliers } = useAppSelector((state) => state.suppliers);
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    setInitialRender(false);
    dispatch(getAllProduct());
    dispatch(getAllSupplier());
    dispatch(getAllCategory());
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
        if (!param.id) {
          onShowMessage("Tạo sản phẩm không thành công", "error");
        } else {
          onShowMessage("Cập nhật sản phẩm không thành công", "error");
        }
      } else {
        if (!param.id) {
          onShowMessage("Tạo sản phẩm thành công", "success");
        } else {
          onShowMessage("Cập nhật sản phẩm thành công", "success");
        }
        createForm.resetFields();
      }
    }
  }, [createForm, onShowMessage, dispatch, updateForm, isActive]);

  const onFinish = async (values: any) => {
    await dispatch(createProduct(values));
    // setInitialRender(false);
    setIsActive(!isActive);
    dispatch(getAllProduct());
  };

  // update product modal

  // xác định form tạo hoặc update
  const handleClose = () => {
    navigate(-1);
    setSelectedProduct(false);
  };

  const onUpdate = async (values: any) => {
    await dispatch(updateProduct({ id: selectedProduct, values: values }));
    dispatch(getAllProduct());
    // setInitialRender(false);
    if (error) {
      onShowMessage("Cập nhật sản phẩm không thành công", "error");
    }
    setIsActive(!isActive);
    handleClose();
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteProduct(values));
    dispatch(getAllProduct());
    onShowMessage("Xoá sản phẩm thành công");
  };

  console.log("««««« initialRender »»»»»", initialRender);

  // table
  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      width: "1%",
      render: (text: any, record: any, index: number) => (
        <div style={{ textAlign: "right" }}>{index + 1}</div>
      ),
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
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: "1%",
      render: (text: any, record: any, index: number) => (
        <div style={{ textAlign: "right" }}>{record.price}</div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "stock",
      key: "stock",
      width: "1%",
      render: (text: any, record: any, index: number) => (
        <div style={{ textAlign: "right" }}>{record.stock}</div>
      ),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      width: "1%",
      render: (text: any, record: any, index: number) => (
        <div style={{ textAlign: "right" }}>{record.discount}</div>
      ),
    },

    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: "1%",
      render: (text: any, record: any) => {
        return (
          <Space size="small">
            <Link to={`/admin/products/${record._id}`}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedProduct(record._id);
                  updateForm.setFieldsValue(record);
                }}
              ></Button>
            </Link>

            <Popconfirm
              title="Xoá sản phẩm"
              description="Bạn có chắc xoá sản phẩm này không?"
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
      <Card title="Tạo sản phẩm mới" style={{ width: "100%" }}>
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
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item<FieldType> label="Giảm giá" name="discount">
            <InputNumber defaultValue={0} min={0} max={75} />
          </Form.Item>

          <Form.Item<FieldType> label="Số lượng sản phẩm" name="stock">
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
      <Card title="Danh sách các sản phẩm">
        <Table dataSource={products} columns={columns} />
      </Card>

      {/* form edit và delete */}
      <Modal
        centered
        title="Chỉnh sửa sản phẩm"
        onCancel={() => {
          navigate(-1);
          setSelectedProduct(false);
        }}
        open={selectedProduct}
        okText="Save changes"
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Card style={{ width: "100%" }}>
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
              label="sản phẩm"
              name="categoryId"
              rules={[{ required: true, message: "Vui lòng chọn sản phẩm!" }]}
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
