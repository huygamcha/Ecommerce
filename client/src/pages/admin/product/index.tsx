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
  InputNumber,
  Select,
  Image,
  ConfigProvider,
  Tag,
  SelectProps,
} from "antd";
import { useEffect } from "react";
import {
  createProduct,
  getAllProduct,
  deleteProduct,
  updateProduct,
} from "../../../slices/productSlice";
import { useAppSelector, useAppDispatch } from "../../../store";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllSupplier } from "../../../slices/supplierSlice";
import { getAllCategory } from "../../../slices/categorySlice";
import numeral from "numeral";
import { getAllTag } from "../../../slices/tagSlice";
import { getAllBrand } from "../../../slices/brandSlice";

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
  const { brands } = useAppSelector((state) => state.brands);
  const { tags } = useAppSelector((state) => state.tags);

  useEffect(() => {
    setInitialRender(false);
    dispatch(getAllProduct({}));
    dispatch(getAllSupplier());
    dispatch(getAllCategory());
    dispatch(getAllTag());
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
    name: string;
    description?: string;
    price: number;
    stock: number;
    discount: number;
    categoryId: string;
    supplierId: string;
    brandId: string;
    pic: string;
    tagList: Array<string>;
  };

  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();
  const categoryFormCreate = Form.useWatch("categoryId", createForm);
  const categoryFormUpdate = Form.useWatch("categoryId", updateForm);

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
          onShowMessage("Tạo sản phẩm thành công", "success");
        } else {
          onShowMessage("Cập nhật sản phẩm thành công", "success");
          navigate(-1);
          setSelectedProduct(false);
        }
        createForm.resetFields();
      }
    }
    dispatch(getAllProduct({}));
  }, [isActive]);

  const onFinish = async (values: any) => {
    await dispatch(createProduct({ ...values, pic: pic }));
    setIsActive(!isActive);
  };

  // update product modal
  const onUpdate = async (values: any) => {
    await dispatch(
      updateProduct({ id: selectedProduct, values: { ...values, pic: pic } })
    );
    setIsActive(!isActive);
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteProduct(values));
    dispatch(getAllProduct({}));
    onShowMessage("Xoá sản phẩm thành công");
  };

  // change when select category -> select brand
  useEffect(() => {
    dispatch(getAllBrand(categoryFormCreate));
  }, [categoryFormCreate]);

  useEffect(() => {
    dispatch(getAllBrand(categoryFormUpdate));
  }, [categoryFormUpdate]);

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
      title: "Hình ảnh",
      dataIndex: "pic",
      key: "pic",
      render: (text: any, record: any) => (
        // <img style={{ height: "30px" }} src={text} alt="" />
        <Image width={100} src={text} />
      ),
    },
    {
      title: "Giá gốc",
      dataIndex: "price",
      key: "price",
      width: "1%",
      render: (text: string, record: any, index: number) => (
        <div style={{ textAlign: "right" }}>{numeral(text).format("$0,0")}</div>
      ),
    },

    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      width: "1%",
      render: (text: any, record: any, index: number) => {
        let color = "#4096ff";

        if (record.discount >= 50) {
          color = "#ff4d4f";
        }

        return (
          <div style={{ textAlign: "right", color: color }}>
            {numeral(text).format("0,0")}%
          </div>
        );
      },
    },
    {
      title: "Giá cuối",
      dataIndex: "total",
      key: "total",
      width: "1%",
      render: (text: string, record: any, index: number) => (
        <div style={{ textAlign: "right" }}>{numeral(text).format("$0,0")}</div>
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

  // upload image
  const [pic, setPic] = useState<string>();
  const postDetails = (pics: any) => {
    if (pics === undefined) {
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
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
          setPic(data.url.toString());
          console.log(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // toast({
      //   title: "Please Select an Image!",
      //   status: "warning",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom",
      // });
      // setPicLoading(false);
      return;
    }
    console.log("««««« pic »»»»»", pic);
  };

  //copy
  const handleCopy = async (values: any) => {
    console.log("««««« values copy »»»»»", values);
    await dispatch(createProduct({ ...values, name: `${values.name} (copy)` }));
    setIsActive(!isActive);
  };

  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            InputNumber: {
              controlWidth: 300,
            },
          },
        }}
      >
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
              label="Thương hiệu"
              name="brandId"
              rules={[
                { required: true, message: "Vui lòng chọn thương hiệu!" },
              ]}
              hasFeedback
            >
              <Select
                options={brands.map((item: any) => {
                  return {
                    label: item.name,
                    value: item._id,
                  };
                })}
              />
            </Form.Item>

            <Form.Item<FieldType> label="Tag" name="tagList">
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                options={tags.map((tag) => {
                  return {
                    label: tag.name,
                    value: tag._id,
                  };
                })}
              />
            </Form.Item>

            {/* <Form.Item<FieldType>
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
            </Form.Item> */}

            <Form.Item<FieldType>
              label="Giá sản phẩm"
              name="price"
              rules={[
                { required: true, message: "Vui lòng nhập giá sản phẩm!" },
              ]}
            >
              <InputNumber defaultValue={0} min={0} />
            </Form.Item>

            <Form.Item<FieldType>
              rules={[
                { required: true, message: "Vui lòng nhập giảm giá sản phẩm!" },
              ]}
              label="Giảm giá"
              name="discount"
            >
              <InputNumber defaultValue={0} min={0} max={75} />
            </Form.Item>

            <Form.Item<FieldType>
              rules={[
                { required: true, message: "Vui lòng nhập số lượng sản phẩm!" },
              ]}
              label="Số lượng sản phẩm"
              name="stock"
            >
              <InputNumber defaultValue={0} min={0} />
            </Form.Item>

            <Form.Item<FieldType> label="Mô tả" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item<FieldType> label="Chọn ảnh" name="pic">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selectedFile = e.target.files && e.target.files[0];
                  if (selectedFile) {
                    postDetails(selectedFile);
                  }
                }}
              ></Input>
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
                label="Danh mục"
                name="categoryId"
                rules={[{ required: true, message: "Vui lòng chọn Danh mục!" }]}
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
                label="Thương hiệu"
                name="brandId"
                rules={[
                  { required: true, message: "Vui lòng chọn thương hiệu!" },
                ]}
                hasFeedback
              >
                <Select
                  options={brands.map((item: any) => {
                    return {
                      label: item.name,
                      value: item._id,
                    };
                  })}
                />
              </Form.Item>

              <Form.Item<FieldType> label="Tag" name="tagList">
                <Select
                  mode="multiple"
                  // tagRender={tagRender}
                  style={{ width: "100%" }}
                  options={tags.map((tag) => {
                    return {
                      label: tag.name,
                      value: tag._id,
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

              <Form.Item<FieldType>
                label="Giảm giá"
                name="discount"
                hasFeedback
              >
                <InputNumber defaultValue={0} min={0} max={75} />
              </Form.Item>

              <Form.Item<FieldType>
                label="Số lượng sản phẩm"
                name="stock"
                hasFeedback
              >
                <InputNumber defaultValue={0} min={0} />
              </Form.Item>

              <Form.Item<FieldType> label="Mô tả" name="description">
                <Input.TextArea rows={3} />
              </Form.Item>

              <Form.Item<FieldType> label="Chọn ảnh" name="pic">
                <Input
                  // type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const selectedFile = e.target.files && e.target.files[0];
                    if (selectedFile) {
                      postDetails(selectedFile);
                    }
                  }}
                ></Input>
              </Form.Item>
            </Form>
          </Card>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default Product;
