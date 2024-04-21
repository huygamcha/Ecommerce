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
  Select,
  Image,
  Spin,
  Flex,
  Row,
  Col,
  DatePicker,
} from "antd";
import { useEffect } from "react";
import {
  createOrder,
  getAllOrder,
  deleteOrder,
  updateOrder,
} from "../../../slices/orderSlice";
import { useAppSelector, useAppDispatch } from "../../../store";
import { DeleteOutlined, EditOutlined, FilterFilled } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllCategory } from "../../../slices/categorySlice";
import { render } from "@testing-library/react";
import numeral from "numeral";

type Props = {};

const Order = (props: Props) => {
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();
  const param = useParams();
  // không hiển thị khi lần đầu load trang
  const [initialRender, setInitialRender] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(false);

  const [search, setSearch] = useState<string>("");
  const [dates, setDates] = useState<any[]>([]);
  const [isDateSearch, setIsDateSearch] = useState<boolean>(false);

  // get from database
  const dispatch = useAppDispatch();

  const { orders, error } = useAppSelector((state) => state.orders);
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    setInitialRender(false);
    dispatch(getAllOrder());
    dispatch(getAllCategory());
  }, [dispatch]);

  //set active modal
  const [selectedOrder, setSelectedOrder] = useState<any>(); // boolean or record._id

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
    categoryId: string;
    pic?: string;
  };

  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  // useEffect(() => {
  //   if (!initialRender) {
  //     if (error.message !== "") {
  //       if (!param.id) {
  //         onShowMessage(`${error.errors?.name}`, "error");
  //       } else {
  //         onShowMessage(`${error.errors?.name}`, "error");
  //       }
  //     } else {
  //       if (!param.id) {
  //         onShowMessage("Tạo đơn đặt hàng thành công", "success");
  //       } else {
  //         onShowMessage("Cập nhật đơn đặt hàng thành công", "success");
  //         navigate(-1);
  //         setSelectedOrder(false);
  //       }
  //       createForm.resetFields();
  //     }
  //   }
  //   dispatch(getAllOrder());
  // }, [isActive]);

  const onFinish = async (values: any) => {
    // console.log("««««« values »»»»»", values);
    await dispatch(createOrder({ ...values, pic: pic }));
    setPic("");
    // setInitialRender(false);
    setIsActive(!isActive);
  };

  // update order modal
  const onUpdate = async (values: any) => {
    await dispatch(
      updateOrder({ id: selectedOrder, values: { ...values, pic: picDetail } })
    );
    setPicDetail("");
    setIsActive(!isActive);
  };

  const onDelete = async (values: any) => {
    await dispatch(deleteOrder(values));
    dispatch(getAllOrder());
    onShowMessage("Xoá đơn đặt hàng thành công");
  };

  // upload image
  const [picDetail, setPicDetail] = useState<string>();
  const [pic, setPic] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
          setIsLoading(true);
          if (infor === "create") {
            setPic(data.url.toString());
            createForm.setFieldValue("pic", data.url.toString());
          } else {
            setPicDetail(data.url.toString());
          }
          console.log(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return;
    }
    console.log("««««« pic »»»»»", pic);
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
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
      render: (text: any, record: any, index: number) => {
        return <div>{text.slice(18)}</div>;
      },
    },
    {
      title: "Người nhận",
      dataIndex: "nameOrder",
      key: "nameOrder",
      filteredValue: [search],
      // filterSearch: true,
      onFilter: (value: any, record: any) => {
        return (
          String(record.nameOrder)
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          String(record.phoneOrder)
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          String(record.email)
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          String(record.notice)
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          String(record.addressDetail)
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          String(record.commune)
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          String(record.district)
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          String(record.province)
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          String(record.typePayment)
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
        );
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneOrder",
      key: "phoneOrder",
      render: (text: any, record: any, index: number) => {
        return <div>{text}</div>;
      },
    },
    // {
    //   title: "Sản phẩm",
    //   dataIndex: "product",
    //   key: "product",
    //   render: (text: any, record: any, index: number) => {
    //     return record.listProduct.map((item: any, index: number) => {
    //       return (
    //         <div>
    //           {index + 1}. {item.name}
    //         </div>
    //       );
    //     });
    //   },
    // },
    {
      title: (
        <Flex align="center" justify="space-between">
          <div>Ngày đặt</div>
          <div style={{ width: "75%" }}>
            <RangePicker
              onChange={(value) => {
                setDates(value || []);
                setIsDateSearch(!isDateSearch);
                // console.log("««««« value »»»»»", value);
                // console.log("««««« value  time»»»»»", value, typeof value);
              }}
            />
          </div>
        </Flex>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      filteredValue: dates,
      onFilter: (value: any, record: any) => {
        // so sánh thời gian nhập vào và thời gian được tạo đơn
        const timeRecord = new Date(record.createdAt);
        const beforeTime = new Date(dates[0]);
        beforeTime.setHours(0, 0, 0, 0);

        const afterTime = new Date(dates[1]);
        afterTime.setHours(0, 0, 0, 0);
        afterTime.setDate(afterTime.getDate() + 1);

        return timeRecord >= beforeTime && timeRecord < afterTime;
      },

      render: (text: any, record: any, index: number) => {
        // console.log("««««« text, typeof text »»»»»", text, typeof text);
        const newDate = new Date(text);
        newDate.setHours(newDate.getHours() + 7);
        // return <div>{newDate.toUTCString()}</div>;
        return <div>{newDate.toUTCString()}</div>;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text: any, record: any, index: number) => {
        let result = 0;
        record.listProduct.map((item: any) => (result += item.total));
        return (
          <div style={{ textAlign: "right" }}>
            {numeral(result).format("0,0$")}
          </div>
        );
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text: any, record: any, index: number) => {
        return <div>{text ? `giao thành công` : "chưa giao"}</div>;
      },
    },
    // {
    //   title: "Địa chỉ",
    //   dataIndex: "addressDetail",
    //   key: "addressDetail",
    //   render: (text: any, record: any, index: number) => {
    //     return (
    //       <div style={{ textAlign: "left" }}>
    //         {`${record.province}, ${record.district}, ${record.commune}, ${text}`}
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Thanh toán",
      dataIndex: "typePayment",
      key: "typePayment",
      render: (text: any, record: any, index: number) => {
        return <div>{text}</div>;
      },
    },
    // {
    //   title: "Actions",
    //   dataIndex: "actions",
    //   key: "actions",
    //   width: "1%",
    //   render: (text: any, record: any) => {
    //     return (
    //       <Space size="small">
    //         <Link to={`/admin/orders/${record._id}`}>
    //           <Button
    //             type="primary"
    //             icon={<EditOutlined />}
    //             onClick={() => {
    //               setSelectedOrder(record._id);
    //               updateForm.setFieldsValue(record);
    //               setPicDetail(record.pic);
    //             }}
    //           ></Button>
    //         </Link>

    //         <Popconfirm
    //           title="Xoá đơn đặt hàng"
    //           description="Bạn có chắc xoá đơn đặt hàng này không?"
    //           onConfirm={() => {
    //             onDelete(record._id);
    //           }}
    //         >
    //           <Button type="primary" danger icon={<DeleteOutlined />} />
    //         </Popconfirm>
    //       </Space>
    //     );
    //   },
    // },
  ];
  return (
    <div>
      {contextHolder}

      <Card>
        <Row
          style={{
            marginBottom: "20px",
          }}
        >
          <Col span={20}>
            <Space style={{ fontSize: "16px", fontWeight: "600" }}>
              Danh sách đặt hàng
            </Space>
          </Col>
          <Col span={4}>
            <Input.Search
              placeholder="tìm kiếm"
              onSearch={(value) => setSearch(value)}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </Col>
        </Row>
        <Table
          pagination={{ defaultPageSize: 10 }}
          dataSource={orders}
          columns={columns}
        />
      </Card>
      {/* form edit và delete */}
      <Modal
        centered
        title="Chỉnh sửa đơn đặt hàng"
        onCancel={() => {
          navigate(-1);
          setSelectedOrder(false);
        }}
        open={selectedOrder}
        confirmLoading={!isLoading}
        okText="Lưu"
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
              label="Sửa đơn đặt hàng"
              name="name"
              rules={[
                { required: true, message: "Vui lòng điền tên đơn đặt hàng!" },
                {
                  min: 2,
                  message: "Tên đơn đặt hàng phải có ít nhất 2 ký tự!",
                },
              ]}
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

            <Form.Item<FieldType> name="pic" label="Hình ảnh">
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
    </div>
  );
};

export default Order;
// <Card title="Tạo đơn đặt hàng mới" style={{ width: "100%" }}>
//       <Form
//         form={createForm}
//         name="basic"
//         labelCol={{ span: 6 }}
//         wrapperCol={{ span: 12 }}
//         initialValues={{ name: "", description: "" }}
//         onFinish={onFinish}
//         autoComplete="off"
//       >
//         <Form.Item<FieldType>
//           label="Tên đơn đặt hàng"
//           name="name"
//           rules={[
//             { required: true, message: "Vui lòng điền tên đơn đặt hàng!" },
//             {
//               min: 2,
//               message: "Tên đơn đặt hàng phải lớn hơn 2 kí tự",
//             },
//           ]}
//           hasFeedback
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item<FieldType>
//           label="Danh mục"
//           name="categoryId"
//           rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
//           hasFeedback
//         >
//           <Select
//             options={categories.map((item: any) => {
//               return {
//                 label: item.name,
//                 value: item._id,
//               };
//             })}
//           />
//         </Form.Item>

//         <Form.Item<FieldType>
//           rules={[{ required: true, message: "Vui lòng chọn hình ảnh!" }]}
//           name="pic"
//           label="Hình ảnh"
//         >
//           {pic ? <Image height={100} src={pic}></Image> : <Space></Space>}

//           <Input
//             type="file"
//             accept="image/*"
//             onChange={(e) => {
//               const selectedFile = e.target.files && e.target.files[0];
//               if (selectedFile) {
//                 postDetails(selectedFile, "create");
//               }
//             }}
//           ></Input>
//         </Form.Item>

//         <Form.Item wrapperCol={{ offset: 6 }}>
//           {isLoading ? (
//             <Button type="primary" htmlType="submit">
//               Thêm đơn đặt hàng
//             </Button>
//           ) : (
//             <Spin />
//           )}
//         </Form.Item>
//       </Form>
//     </Card>
