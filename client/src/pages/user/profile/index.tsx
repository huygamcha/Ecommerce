import { Col, Row } from "antd";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProfileScreen() {
  const navigate = useNavigate();
  const user = localStorage.getItem("userInfor");
  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user]);
  return (
    <div>
      <Row>
        <Col span={6}></Col>
        <Col span={6}></Col>
        <Col span={6}></Col>
        <Col span={6}>Logout</Col>
      </Row>
    </div>
  );
}

export default ProfileScreen;
