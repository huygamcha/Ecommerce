/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { ProductsType } from "../../slices/productSlice";
import { Button, ConfigProvider, Flex, Space, message } from "antd";
import clsx from "clsx";
import style from "./buyMobile.module.css";
import numeral from "numeral";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BsX } from "react-icons/bs";
import { useAppDispatch } from "../../store";
import { addToCart } from "../../slices/cartSlice";
import { useNavigate } from "react-router-dom";

function BuyMobile({
  product,
  active,
  SetIsActive,
}: {
  product: ProductsType | undefined;
  active: boolean;
  SetIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  // SetIsActive: (;
}) {
  const [quantity, setQuantity] = useState<number>(1);
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  //  buy quickly
  const handleAddToCartNow = (e: any) => {
    //  tránh hiện tượng load trang, ngăn chặn mặc định của link
    e.preventDefault();
    // ngăn chán hành động dispatch search product
    e.stopPropagation();
    messageApi.open({
      type: "success",
      content: "Thêm vào giỏ hàng thành công",
    });
    dispatch(
      addToCart({
        id: product?._id,
        name: product?.name,
        quantity: quantity,
        pic: product?.pic,
        price: product?.price,
        stock: product?.stock,
        total: product?.total,
        discount: product?.discount,
        unit: product?.unit,
        slug: product?.slug,
        check: true,
        sold: product?.sold,
      })
    );
    navigate("/cart");
  };
  // add to cart
  const handleAddToCart = () => {
    SetIsActive(false);
    messageApi.open({
      type: "success",
      content: "Thêm vào giỏ hàng thành công",
    });
    dispatch(
      addToCart({
        id: product?._id,
        name: product?.name,
        quantity: quantity,
        pic: product?.pic,
        price: product?.price,
        stock: product?.stock,
        total: product?.total,
        discount: product?.discount,
        unit: product?.unit,
        slug: product?.slug,
        check: true,
        categoryId: product?.categoryId,
        sold: product?.sold,
      })
    );
  };
  console.log("«««««  hereee»»»»»");
  return (
    <ConfigProvider
      theme={{
        components: {
          Message: {
            zIndexPopup: 9999,
          },
        },
      }}
    >
      {contextHolder}
      <div className={clsx(style.wrapper_global)}>
        <div
          style={{ display: active ? "block" : "none" }}
          className={clsx(style.wrapper)}
        >
          <div>
            <div className={clsx(style.header)}>
              Chọn số lượng, đơn vị
              <div
                onClick={() => SetIsActive(false)}
                className={clsx(style.header_icon)}
              >
                <BsX />
              </div>
            </div>
          </div>
          <div className={clsx(style.wrapper_content)}>
            <div>
              <Flex vertical>
                <Flex gap={8}>
                  <Space className={clsx(style.wrapper_img)}>
                    <img
                      className={clsx(style.content_img)}
                      src={product && product.pic}
                    />
                  </Space>
                  <Flex vertical>
                    <Space className={clsx(style.header_name)}>
                      {product && product.name}
                    </Space>
                    <Space>
                      <Flex vertical>
                        {product && product?.discount > 0 ? (
                          <>
                            <Space className={clsx(style.price_detail)}>
                              <div>
                                {numeral(product?.total).format("0,0$")}
                              </div>
                            </Space>
                            <Space className={clsx(style.price_total)}>
                              <del>
                                {numeral(product?.price).format("0,0$")}
                              </del>
                            </Space>
                          </>
                        ) : (
                          <Space className={clsx(style.price_detail)}>
                            <div>{numeral(product?.price).format("0,0$")}</div>
                          </Space>
                        )}
                      </Flex>
                    </Space>
                  </Flex>
                </Flex>
                <Flex vertical>
                  <Space className={clsx(style.brief_detail)}>
                    Chọn đơn vị
                  </Space>
                  <Space>
                    <div className={clsx(style.filter_select_tag_item)}>
                      <Button
                        style={{
                          borderColor: " #1250dc",
                          color: "#1250dc",
                        }}
                        className={clsx(style.filter_select_tag)}
                      >
                        {product && product.unit}
                        <Space className={clsx(style.filter_label_tag)}>
                          <div style={{ display: "none" }}>1</div>
                        </Space>
                      </Button>
                    </div>
                  </Space>
                </Flex>
                <Flex>
                  {/* buy now */}
                  <Space className={clsx(style.brief_detail_wrapper)}>
                    <Space className={clsx(style.brief_detail)}>
                      Chọn số lượng
                    </Space>
                    <Space className={clsx(style.quantity_detail_wrapper)}>
                      <Space
                        onClick={() => setQuantity(quantity - 1)}
                        className={clsx(
                          quantity === 1
                            ? style.quantity_icon_detail_disabled
                            : style.quantity_icon_detail
                        )}
                      >
                        <MinusOutlined disabled />
                      </Space>
                      <Space className={clsx(style.quantity_detail)}>
                        {quantity}
                      </Space>

                      <Space
                        onClick={() => setQuantity(quantity + 1)}
                        className={clsx(
                          quantity === product?.stock
                            ? style.quantity_icon_detail_disabled
                            : style.quantity_icon_detail
                        )}
                      >
                        <PlusOutlined />
                      </Space>
                    </Space>
                  </Space>
                </Flex>
                <Flex justify="space-between">
                  <Space className={clsx(style.brief_detail)}>Tạm tính</Space>
                  <Space className={clsx(style.price)}>
                    {product &&
                      product.total &&
                      numeral(product.total * quantity).format("0,0$")}
                  </Space>
                </Flex>
                <Flex justify="space-between">
                  <Space className={clsx(style.brief_detail)}>Tiết kiệm</Space>
                  <Space className={clsx(style.price)}>
                    {product &&
                      product.total &&
                      numeral(
                        product.price * quantity - product.total * quantity
                      ).format("0,0$")}
                  </Space>
                </Flex>
              </Flex>
            </div>
          </div>
          <div className={clsx(style.wrapper_content_button)}>
            {/* buy */}
            <Flex className={clsx(style.buy_wrapper)} justify="space-between">
              <Space
                onClick={handleAddToCartNow}
                className={clsx(
                  style.add_to_cart,
                  product && !product.stock ? style.soldOut_disabled : ""
                )}
              >
                Mua ngay
              </Space>
              <Space
                onClick={handleAddToCart}
                className={clsx(
                  style.buy_now,
                  product && !product.stock ? style.soldOut_disabled : ""
                )}
              >
                Thêm vào giỏ
              </Space>
            </Flex>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default BuyMobile;
