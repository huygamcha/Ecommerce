import { Flex } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getAllCart } from "../../../slices/cartSlice";

function Payment() {
  const navigate = useNavigate();
  const locate = useLocation();
  const [success, setSuccess] = useState<boolean>(false);
  const [isCountinue, setIsCountinue] = useState<boolean>(true); // Biến state để kiểm tra và điều khiển vòng lặp

  const { carts, totalPrice } = useAppSelector((state) => state.carts);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllCart());
  }, []);
  useEffect(() => {
    if (!success) {
      const intervalId = setInterval(() => {
        console.log("««««« success »»»»»", success);
        apiPayment();
      }, 5000);

      return () => {
        clearInterval(intervalId);
      };
    } else {
      setTimeout(() => {
        navigate("/cart");

        // tránh lòng lặp
        window.location.reload();
      }, 2000);
    }
  }, [isCountinue, success]); // Đảm bảo useEffect được gọi lại khi success, isLooping hoặc locate thay đổi

  const apiPayment = async () => {
    try {
      const response = await fetch(
        "https://script.googleusercontent.com/macros/echo?user_content_key=8TcUmE0LF6ekmELl9dh1sXRO3-UEtbX4ZvE08Ak1sFEunJ3H5jkTFoBCPDib5MgaXmuJejzDFHdDIQ_NgrLARiQmS2GPkspUm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnIpT4Niv7qXQj-pmxpjreFeUfIWP1jAUPg4VApuRmGhGJ5g5VhTkfbf7_b-eVUy51MMor6tSTHw-OdMWcZ8Dj5rR-3JMYO665dz9Jw9Md8uu&lib=MK9gWGH6-Achh8x1ku6FNXm5pZ_GKHrqc"
      );
      const data = await response.json();
      const successPay = data.data[data.data.length - 1];

      console.log("««««« successPay »»»»»", successPay);

      if (
        successPay["Giá trị"] >= totalPrice &&
        successPay["Mô tả"].includes("chuyenkhoan")
      ) {
        alert("thanh toán thành công");
        setSuccess(true);
        setIsCountinue(!isCountinue);
      } else {
        console.log("««««« chưa thanh toán  »»»»»");
        setIsCountinue(!isCountinue);
      }
    } catch (error) {
      console.log("««««« error »»»»»", error);
    }
  };

  return (
    <Flex justify="center">
      <img
        style={{ width: "500px" }}
        src={`https://img.vietqr.io/image/970422-0703414500-print.png?amount=${totalPrice}&addInfo=chuyenkhoan&accountName=LE HUYNH HUY`}
        alt="payment"
      />
    </Flex>
  );
}

export default Payment;
