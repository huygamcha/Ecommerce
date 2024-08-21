import axios from "axios";

export const handleLogoutApi = async () => {
  // TH1s
  //   localStorage.removeItem("accessToken");
  //   localStorage.removeItem("refreshToken");
  //   localStorage.removeItem("userInfor");
  localStorage.clear();
};

export const handleRefreshToken = async (refreshToken: string) => {
  return await axios.post(`${process.env.REACT_APP_BACKEND}/refreshToken`, {
    refreshToken,
  });
};
