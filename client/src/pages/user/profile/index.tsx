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
  return <div>ProfileScreen</div>;
}

export default ProfileScreen;
