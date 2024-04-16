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
  InputNumber,
  Select,
  Image,
  ConfigProvider,
  Spin,
} from "antd";
import { useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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

  // quill text editor
  const [value, setValue] = useState("");
  const reactQuillRef = useRef<ReactQuill>(null);
  const imageHandler = useCallback(() => {
    console.log("««««« 3223232 »»»»»", 3223232);
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];
        const url = await uploadToCloudinary(file);
        const quill = reactQuillRef.current;
        if (quill) {
          const range = quill.getEditorSelection();
          range && quill.getEditor().insertEmbed(range.index, "image", url);
        }
      }
    };
  }, []);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "pbl3_chatbot");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/drqphlfn6/image/upload",
      {
        method: "post",
        body: formData,
      }
    );
    const data = await res.json();
    const url = data.url;
    return url;
  };

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
    dispatch(getAllBrand());
  }, []);

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
    fromBrand: string;
    supplierHome: string;
    country: string;
    ingredient: string;
    detail: string;
    specifications: string;
    unit: string;
    album: Array<string>;
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
    await dispatch(createProduct({ ...values, album: albumCreate }));
    setIsActive(!isActive);
  };

  // update product modal
  const onUpdate = async (values: any) => {
    await dispatch(
      updateProduct({
        id: selectedProduct,
        values: { ...values, pic: picDetail },
      })
    );
    setPicDetail("");

    setIsActive(!isActive);
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteProduct(values));
    dispatch(getAllProduct({}));
    onShowMessage("Xoá sản phẩm thành công");
  };

  // change when select category -> select brand
  useEffect(() => {
    createForm.setFieldValue("brandId", "");
  }, [categoryFormCreate]);

  useEffect(() => {
    // kiểm tra xem nếu category bị thay đổi thì brand sẽ set là rỗng
    const matchBrand = brands
      .filter(
        (brand) => brand.categoryId === updateForm.getFieldValue("categoryId")
      )
      .find((brand) => brand._id === updateForm.getFieldValue("brandId"));
    if (!matchBrand) {
      updateForm.setFieldValue("brandId", "");
    }
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
        <div style={{ textAlign: "right" }}>{numeral(text).format("0,0$")}</div>
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
        <div style={{ textAlign: "right" }}>{numeral(text).format("0,0$")}</div>
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
                  setPicDetail(record.pic);
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

  // upload image with create
  const [pic, setPic] = useState<string>();
  // image screen with update
  const [picDetail, setPicDetail] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // image album
  const [albumCreate, setAlbumCreate] = useState<Array<string>>([]);

  // upload screen image
  const postDetails = (pics: any, infor: string) => {
    if (pics === undefined) {
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
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
          if (infor === "create") {
            setPic(data.url.toString());
            createForm.setFieldValue("pic", data.url.toString());
          } else {
            setPicDetail(data.url.toString());
          }
          setIsLoading(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return;
    }
    console.log("««««« pic »»»»»", pic);
  };

  // upload album
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

  //copy
  const handleCopy = async (values: any) => {
    await dispatch(createProduct({ ...values, name: `${values.name} (copy)` }));
    setIsActive(!isActive);
  };
  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Input: {
              controlHeight: 40,
            },
            InputNumber: {
              controlHeight: 40,
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
                options={brands
                  .filter((item) => item.categoryId === categoryFormCreate)
                  .map((item: any) => ({
                    label: item.name,
                    value: item._id,
                  }))}
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
              <InputNumber style={{ width: "100%" }} defaultValue={0} min={0} />
            </Form.Item>

            <Form.Item<FieldType>
              rules={[
                { required: true, message: "Vui lòng nhập giảm giá sản phẩm!" },
              ]}
              label="Giảm giá"
              name="discount"
            >
              <InputNumber
                style={{ width: "100%" }}
                defaultValue={0}
                min={0}
                max={75}
              />
            </Form.Item>

            <Form.Item<FieldType>
              rules={[
                { required: true, message: "Vui lòng nhập số lượng sản phẩm!" },
              ]}
              label="Số lượng sản phẩm"
              name="stock"
            >
              <InputNumber style={{ width: "100%" }} defaultValue={0} min={0} />
            </Form.Item>

            <Form.Item<FieldType> label="Đơn vị" name="unit">
              <Input.TextArea placeholder="Hộp" rows={1} />
            </Form.Item>

            <Form.Item<FieldType> label="Quy cách" name="specifications">
              <Input.TextArea placeholder="1 hộp 500ml bột" rows={1} />
            </Form.Item>

            <Form.Item<FieldType> label="Xuất xứ thương hiệu" name="fromBrand">
              <Input.TextArea placeholder="Việt Nam" rows={1} />
            </Form.Item>

            <Form.Item<FieldType> label="Nhà sản xuất" name="supplierHome">
              <Input.TextArea placeholder="Việt Nam" rows={1} />
            </Form.Item>

            <Form.Item<FieldType> label="Nước sản xuất" name="country">
              <Input.TextArea placeholder="Việt Nam" rows={1} />
            </Form.Item>

            <Form.Item<FieldType> label="Thành phần" name="ingredient">
              <Input.TextArea
                placeholder="sữa bò tươi (97%), đường tinh luyện (2,8)"
                rows={3}
              />
            </Form.Item>

            <Form.Item<FieldType> label="Mô tả ngắn" name="description">
              <Input.TextArea
                placeholder="thơm ngon từ lúa mạch, cung cấp đạm và canxi cho cơ thể. Milo từ lâu luôn là thương hiệu sữa uống lúa mạch được các bé yêu thích."
                rows={3}
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

            <Form.Item<FieldType> label="Chọn ảnh hiển thị" name="pic">
              {pic ? <Image height={100} src={pic}></Image> : <Space></Space>}
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

            <Form.Item<FieldType> label="Album ảnh" name="album">
              {/* {pic ? <Image height={100} src={pic}></Image> : <Space></Space>} */}
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

            <Form.Item<FieldType> label="Mô tả chi tiết" name="detail">
              <ReactQuill
                ref={reactQuillRef}
                theme="snow"
                placeholder="Start writing..."
                modules={{
                  toolbar: {
                    container: [
                      [{ header: "1" }, { header: "2" }, { font: [""] }],
                      [{ size: [] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                      ],
                      [{ align: [] }],

                      [{ color: [] }, { background: [] }],
                      ["link", "image"],
                      ["clean"],
                    ],
                    handlers: {
                      image: imageHandler, // <-
                    },
                  },
                  clipboard: {
                    matchVisual: false,
                  },
                }}
                formats={[
                  "header",
                  "font",
                  "size",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "blockquote",
                  "list",
                  "bullet",
                  "indent",
                  "link",
                  "image",
                  "video",
                  "code-block",
                ]}
                value={value}
                // onChange={onChange}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6 }}>
              {isLoading ? (
                <Button type="primary" htmlType="submit">
                  Thêm sản phẩm
                </Button>
              ) : (
                <Spin />
              )}
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
          okText="Lưu"
          confirmLoading={!isLoading}
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
                  options={brands
                    .filter((item) => item.categoryId === categoryFormUpdate)
                    .map((item) => ({
                      value: item._id,
                      label: item.name,
                    }))}
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
      </ConfigProvider>
    </div>
  );
};

export default Product;
