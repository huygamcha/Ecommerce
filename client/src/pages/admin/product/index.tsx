/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
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
  resetState,
} from "../../../slices/productSlice";
import { useAppSelector, useAppDispatch } from "../../../store";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllCategory } from "../../../slices/categorySlice";
import numeral from "numeral";
import { getAllTag } from "../../../slices/tagSlice";
import { getAllBrand } from "../../../slices/brandSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";

type Props = {};

const Product = (props: Props) => {
  const navigate = useNavigate();
  const param = useParams();
  const dispatch = useAppDispatch();

  const firstRender = useRef<boolean>(true);
  const [value, setValue] = useState("");
  const reactQuillRef = useRef<ReactQuill>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(); // boolean or record._id
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [albumCreate, setAlbumCreate] = useState<Array<string>>([]);

  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();
  const categoryFormCreate = Form.useWatch("categoryId", createForm);
  const categoryFormUpdate = Form.useWatch("categoryId", updateForm);

  const [messageApi, contextHolder] = message.useMessage();

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];

        const url = await uploadToCloudflare(file);

        const quill = reactQuillRef.current;
        if (quill) {
          const range = quill.getEditorSelection();
          range && quill.getEditor().insertEmbed(range.index, "image", url);
        }
      }
    };
  }, []);

  const uploadToCloudflare = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/upload`, {
      method: "POST",
      body: formData,
    });
    const result = await response.text();
    return result;
    // formData.append("upload_preset", "pbl3_chatbot");
    // const res = await fetch(
    //   "https://api.cloudinary.com/v1_1/drqphlfn6/image/upload",
    //   {
    //     method: "post",
    //     body: formData,
    //   }
    // );
    // const data = await res.json();
    // const url = data.url;
    // console.log("««««« url »»»»»", url);
    // return url;
  };

  const {
    products,
    isSuccessCreate,
    isSuccessUpdate,
    isErrorCreate,
    isErrorUpdate,
  } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);
  const { brands } = useAppSelector((state) => state.brands);
  const { tags } = useAppSelector((state) => state.tags);

  useEffect(() => {
    firstRender.current = false;
    if (products.length === 0) dispatch(getAllProduct({}));
    if (categories.length === 0) dispatch(getAllCategory());
    if (tags.length === 0) dispatch(getAllTag());
    if (brands.length === 0) dispatch(getAllBrand());
  }, []);

  useEffect(() => {
    if (!firstRender.current) {
      if (isErrorUpdate || isErrorCreate) {
        if (!param.id && isErrorCreate) {
          onShowMessage(`Tạo sản phẩm không thành công`, "error");
        } else {
          onShowMessage(`Cập nhật sản phẩm không thành công`, "error");
          navigate(-1);
          setSelectedProduct(false);
        }
        updateForm.resetFields();
        dispatch(getAllProduct({}));
        dispatch(resetState());
      }
      if (isSuccessUpdate || isSuccessCreate) {
        if (!param.id && isSuccessCreate) {
          onShowMessage("Tạo sản phẩm thành công", "success");
        } else {
          onShowMessage("Cập nhật sản phẩm thành công", "success");
          navigate(-1);
          setSelectedProduct(false);
        }
        createForm.resetFields();
        dispatch(getAllProduct({}));
        dispatch(resetState());
      }
    }
  }, [isSuccessCreate, isSuccessUpdate, isErrorCreate, isErrorUpdate]);

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
    age: number;
    fakeNumber: number;
  };

  const onFinish = async (values: any) => {
    await dispatch(createProduct({ ...values, album: albumCreate }));
  };

  // update product modal
  const onUpdate = async (values: any) => {
    await dispatch(
      updateProduct({
        id: selectedProduct,
        values: { ...values, album: albumCreate },
      })
    );
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteProduct(values));
    dispatch(getAllProduct({}));
    onShowMessage("Xoá sản phẩm thành công");
  };

  // xoa anh ra khoi album
  const handleImageRemove = (index: number) => {
    const updatedImages = albumCreate.filter((_, id) => id !== index);
    setAlbumCreate(updatedImages);
  };

  // upload hình ảnh đại diện cho sản phẩm
  const postDetails = async (pics: any, infor: string) => {
    if (pics === undefined) {
      return;
    }
    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/jpg" ||
      pics.type === "image/svg+xml" ||
      pics.type === "image/png" ||
      pics.type === "image/webp"
    ) {
      setIsLoading(false);
      const data = new FormData();
      data.append("file", pics);
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/upload`, {
        method: "post",
        body: data,
      });
      const result = await response.text();
      setIsLoading(true);
      if (infor === "create") {
        createForm.setFieldValue("pic", result);
      } else {
        updateForm.setFieldValue("pic", result);
      }
    } else {
      return;
    }
  };

  // upload nhiều ảnh vào album
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

  //copy
  const handleCopy = async (values: any) => {
    await dispatch(createProduct({ ...values, name: `${values.name} (copy)` }));
  };

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
        <Image style={{ width: "100px", height: "100px" }} src={text} />
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
                  setAlbumCreate(record.album ? record.album : []);
                  // setValue(record.detail);
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

            <Form.Item<FieldType>
              label="Giá sản phẩm"
              name="price"
              rules={[
                { required: true, message: "Vui lòng nhập giá sản phẩm!" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} defaultValue={0} min={0} />
            </Form.Item>

            <Form.Item<FieldType> label="Giảm giá" name="discount">
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

            <Form.Item<FieldType>
              rules={[{ required: true, message: "Vui lòng nhập độ tuổi!" }]}
              label="Độ tuổi"
              name="age"
            >
              <Select
                options={[
                  { value: 0, label: "Sơ sinh - 1 tuổi" },
                  { value: 1, label: "1 tuổi" },
                  { value: 2, label: "2 tuổi" },
                  { value: 3, label: "3 tuổi" },
                  { value: 4, label: "4 tuổi" },
                  { value: 5, label: "5 tuổi" },
                  { value: 6, label: "Trên 5 tuổi" },
                ]}
              />
            </Form.Item>

            <Form.Item<FieldType> label="Đơn vị" name="unit">
              <Input.TextArea placeholder="Hộp" rows={1} />
            </Form.Item>

            <Form.Item<FieldType> label="Số lượng bán ảo" name="fakeNumber">
              <Input.TextArea placeholder="1000" rows={1} />
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
              {createForm.getFieldValue("pic") && (
                <Image
                  height={100}
                  src={createForm.getFieldValue("pic")}
                ></Image>
              )}
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
                      alt="albumCreate"
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
          width={"150vh"}
          centered
          title="Chỉnh sửa sản phẩm"
          onCancel={() => {
            navigate(-1);
            setSelectedProduct(false);
            setAlbumCreate([]);
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
              labelCol={{ span: 24 }}
              form={updateForm}
              name="basic"
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

              <Form.Item<FieldType>
                rules={[{ required: true, message: "Vui lòng nhập độ tuổi!" }]}
                label="Độ tuổi"
                name="age"
              >
                <Select
                  options={[
                    { value: 0, label: "Sơ sinh - 1 tuổi" },
                    { value: 1, label: "1 tuổi" },
                    { value: 2, label: "2 tuổi" },
                    { value: 3, label: "3 tuổi" },
                    { value: 4, label: "4 tuổi" },
                    { value: 5, label: "5 tuổi" },
                    { value: 6, label: "Trên 5 tuổi" },
                  ]}
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
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>

              <Form.Item<FieldType>
                label="Giảm giá"
                name="discount"
                hasFeedback
              >
                <InputNumber
                  style={{ width: "100%" }}
                  defaultValue={0}
                  min={0}
                  max={75}
                />
              </Form.Item>

              <Form.Item<FieldType>
                label="Số lượng sản phẩm"
                name="stock"
                hasFeedback
              >
                <InputNumber
                  style={{ width: "100%" }}
                  defaultValue={0}
                  min={0}
                />
              </Form.Item>

              <Form.Item<FieldType> label="Đơn vị" name="unit">
                <Input.TextArea placeholder="Hộp" rows={1} />
              </Form.Item>

              <Form.Item<FieldType> label="Quy cách" name="specifications">
                <Input.TextArea placeholder="1 hộp 500ml bột" rows={1} />
              </Form.Item>

              <Form.Item<FieldType>
                label="Xuất xứ thương hiệu"
                name="fromBrand"
              >
                <Input.TextArea placeholder="Việt Nam" rows={1} />
              </Form.Item>

              <Form.Item<FieldType> label="Nhà sản xuất" name="supplierHome">
                <Input.TextArea placeholder="Việt Nam" rows={1} />
              </Form.Item>

              <Form.Item<FieldType> label="Nước sản xuất" name="country">
                <Input.TextArea placeholder="Việt Nam" rows={1} />
              </Form.Item>

              <Form.Item<FieldType> label="Số lượng bán ảo" name="fakeNumber">
                <Input.TextArea placeholder="1000" rows={1} />
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

              <Form.Item<FieldType> label="Chọn ảnh hiển thị" name="pic">
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
                {updateForm.getFieldValue("pic") && (
                  <Image
                    height={100}
                    src={updateForm.getFieldValue("pic")}
                  ></Image>
                )}
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
                        alt="albumCreate"
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
                  value="abc"
                  // onChange={onChange}
                />
              </Form.Item>
            </Form>
          </Card>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default Product;
