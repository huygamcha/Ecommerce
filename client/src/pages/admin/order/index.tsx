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
  Flex,
  Row,
  Col,
  DatePicker,
} from "antd";
import { useEffect } from "react";
import {
  deleteOrder,
  getAllOrder,
  updateOrder,
} from "../../../slices/orderSlice";
import { useAppSelector, useAppDispatch } from "../../../store";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllCategory } from "../../../slices/categorySlice";
import numeral from "numeral";
import axios from "axios";
import { updateProduct } from "../../../slices/productSlice";

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
    status: boolean;
    nameOrder: string;
    phoneOrder: string;
    email?: string;
    addressDetail: string;
    commune: string;
    district: string;
    province: string;
    typePayment: string;
    listProduct: [];
    address: string;
    _id: string;
  };

  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  useEffect(() => {
    if (!initialRender) {
      if (param.id) {
        onShowMessage("Cập nhật đơn đặt hàng thành công", "success");
        navigate(-1);
        setSelectedOrder(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        // window.location.reload();
      }
      createForm.resetFields();
    }
  }, [isActive]);

  // update order modal
  const onUpdate = async (values: any) => {
    await dispatch(updateOrder({ id: selectedOrder, values: values }));
    setIsActive(!isActive);
  };

  const onDelete = async (values: any, carts: any) => {
    carts &&
      carts.map(async (value: any) => {
        await dispatch(
          updateProduct({
            id: value.id,
            values: { ...value, quantity: value.quantity, autoQuantity: 3 },
          })
        );
      });
    await dispatch(deleteOrder(values));
    // await dispatch(deleteOrder(values));
    dispatch(getAllOrder());
    onShowMessage("Xoá đơn đặt hàng thành công");
  };

  // upload image
  const [picDetail, setPicDetail] = useState<string>();
  const [pic, setPic] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      render: (text: boolean, record: any, index: number) => {
        return <div>{record.status ? "đã giao" : "chưa giao"}</div>;
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
    {
      title: "Hành động",
      dataIndex: "actions",
      key: "actions",
      width: "1%",
      render: (text: any, record: any) => {
        return (
          <Space size="small">
            <Link to={`/admin/orders/${record._id}`}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedOrder(record._id);
                  updateForm.setFieldsValue(record);
                  setPicDetail(record.pic);
                }}
              ></Button>
            </Link>

            <Popconfirm
              title="Xoá đơn đặt hàng"
              description="Bạn có chắc xoá đơn đặt hàng này không?"
              onConfirm={() => {
                onDelete(record._id, record.listProduct);
              }}
            >
              <Button type="primary" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // thong tin
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [commune, setCommune] = useState([]);

  useEffect(() => {
    getProvince();
  }, []);

  const getProvince = async () => {
    const data = await axios.get(
      "https://api.mysupership.vn/v1/partner/areas/province"
    );
    setProvince(data.data.results);
  };

  const handleDistrict = async (id: string) => {
    updateForm.setFieldValue("district", null);
    updateForm.setFieldValue("commune", null);
    const data = await axios.get(
      `https://api.mysupership.vn/v1/partner/areas/district?province=${id}`
    );
    setDistrict(data.data.results);
  };

  const handleCommune = async (id: string) => {
    updateForm.setFieldValue("commune", null);
    const data = await axios.get(
      `https://api.mysupership.vn/v1/partner/areas/commune?district=${id}`
    );
    setCommune(data.data.results);
  };

  const handleAddressDetail = async () => {
    updateForm.setFieldValue("addressDetail", null);
  };

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
        width={"200vh"}
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
            labelCol={{ span: 24 }}
            // wrapperCol={{ span: 12 }}
            initialValues={{ name: "", description: "" }}
            onFinish={onUpdate}
            autoComplete="off"
          >
            <Form.Item<FieldType> label="Mã đơn đặt hàng">
              <Input
                value={
                  updateForm.getFieldValue("_id")
                    ? updateForm.getFieldValue("_id").slice(18)
                    : ""
                }
                disabled
              />
            </Form.Item>

            <Form.Item<FieldType> label="Trạng thái giao hàng" name="status">
              <Select
                options={[
                  { value: false, label: "Chưa giao" },
                  { value: true, label: "Đã giao" },
                ]}
              />
            </Form.Item>

            <Form.Item<FieldType>
              label="Tên khách hàng"
              name="nameOrder"
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
              label="Số điện thoại"
              name="phoneOrder"
              rules={[
                {
                  required: true,
                  message: "Vui lòng điền sô điện thoại khách hàng!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Email khách hàng"
              name="email"
              rules={[
                { required: true, message: "Vui lòng điền email khách hàng!" },
                {
                  min: 2,
                  message: "Email khách hàng phải có ít nhất 2 ký tự!",
                },
                {
                  type: "email",
                  message: "Không đúng định dạng email",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType> label="Tỉnh / thành phố" name="province">
              <Select
                placeholder="Chọn tỉnh / thành phố"
                options={province.map((item: any) => {
                  return {
                    label: item.name,
                    value: item.code,
                  };
                })}
                onChange={(e) => {
                  const data: any = province.filter(
                    (item: any) => item.code === e
                  );

                  if (data) {
                    updateForm.setFieldValue("province", data[0].name);
                  }
                  handleDistrict(e);
                }}
              />
            </Form.Item>

            <Form.Item<FieldType> label="Quận / huyện" name="district">
              <Select
                placeholder="Chọn quận / huyện"
                options={
                  district &&
                  district.map((item: any) => {
                    return {
                      label: item.name,
                      value: item.code,
                    };
                  })
                }
                onChange={(e) => {
                  const data: any = district.filter(
                    (item: any) => item.code === e
                  );

                  if (data) {
                    updateForm.setFieldValue("district", data[0].name);
                  }
                  handleCommune(e);
                }}
              />
            </Form.Item>

            <Form.Item<FieldType> label="Phường / xã" name="commune">
              <Select
                placeholder="Chọn phường / xã"
                options={
                  commune &&
                  commune.map((item: any) => {
                    return {
                      label: item.name,
                      value: item.code,
                    };
                  })
                }
                onChange={(e) => {
                  const data: any = commune.filter(
                    (item: any) => item.code === e
                  );

                  if (data) {
                    updateForm.setFieldValue("commune", data[0].name);
                  }
                  handleAddressDetail();
                }}
              />
            </Form.Item>

            <Form.Item<FieldType> label="Địa chỉ cụ thể" name="addressDetail">
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Hình thức thanh toán"
              name="typePayment"
              rules={[
                {
                  required: true,
                  message: "Vui lòng điền hình thức thanh toán!",
                },
              ]}
            >
              <Select
                options={[
                  { value: "shipCode", label: "shipCode" },
                  { value: "vnPay", label: "vnPay" },
                  { value: "visa", label: "visa" },
                  { value: "zaloPay", label: "zaloPay" },
                  { value: "momo", label: "momo" },
                ]}
              />
            </Form.Item>

            <Form.Item<FieldType>
              label="Sản phẩm"
              // name="listProduct"
              rules={[
                { required: true, message: "Vui lòng điền tên đơn đặt hàng!" },
                {
                  min: 2,
                  message: "Tên đơn đặt hàng phải có ít nhất 2 ký tự!",
                },
              ]}
            >
              <Input.TextArea
                rows={5}
                value={
                  updateForm.getFieldValue("listProduct")
                    ? updateForm
                        .getFieldValue("listProduct")
                        .map((item: any, index: number) => {
                          return `${index + 1}. ${item.name} (x${
                            item.quantity
                          }).`;
                        })
                        .join("\n")
                    : ""
                }
              ></Input.TextArea>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default Order;
