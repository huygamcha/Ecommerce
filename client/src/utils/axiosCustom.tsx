/* eslint-disable no-restricted-globals */
// Author: TrungQuanDev: https://youtube.com/@trungquandev
import axios from "axios";
import { handleLogoutApi, handleRefreshToken } from "./apis";
// import { handleLogoutApi, handleRefreshToken } from "~/apis";

let authorizedAxiosInstance = axios.create();
// tối đa gọi là 10ph, nếu không được thì huy
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;

// nếu dùng token với cookie thì mở cmt dòng code này
// authorizedAxiosInstance.defaults.withCredentials = true;

// Add a request interceptor
authorizedAxiosInstance.interceptors.request.use(
  function (config) {
    // Lấy access token để đỉnh vào header khi gửi req
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${JSON.parse(accessToken)}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Khởi tạo một promise cho việc gọi api refresh token
// Mục đích là để khi nhận được yêu cầu refresh token đầu tiên thì hold lại
// việc gọi api refresh token cho tới khi xong hết thì mới retry lại những
// api bị lỗi trước đó thay vì cứ liên tục gọi refresh token liên tục

let refreshTokenPromise: any = null;

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Khu vực refreshToken
    // đổi với mã lỗi 401 được trả về ('không có token hoặc là chưa đăng nhập)
    if (error.response?.status === 401) {
      handleLogoutApi().then(() => {
        // eslint-disable-next-line no-restricted-globals
        location.href = "/auth/login";
      });
      // toast.error(error.response?.data?.message || error?.message)
    }

    // 410 là mã gone tức là token đã hết hạn, yêu cầu refreshToken
    const originalRequest = error.config;
    if (error.response?.status === 410 && originalRequest) {
      //  Gán ngay lâp tức retry = true trong thời gian chờ, để việc refreshToken luôn chỉ gọi 1 lần
      // Trường hợp localStorage
      if (!refreshTokenPromise) {
        const refreshToken = localStorage.getItem("refreshToken");
        // giải thích về phần gán này
        // Bước 1: Khi yêu cầu API đầu tiên gặp lỗi 410,
        // nó sẽ kiểm tra refreshTokenPromise. Vì đây là lần đầu tiên,
        // refreshTokenPromise chưa được gán giá trị nên một yêu cầu refresh token
        // sẽ được tạo và lưu trữ trong refreshTokenPromise.
        // Bước 2: Lúc này nếu có các api khác gặp lỗi 410 thì refreshTokenPromise đã
        // được api đầu tiên set rồi nên không thể thực hiện được
        // Bước 3: Khi thực hiện xong refreshTokenPromise đối với api đầu tiên
        // thì nó sẽ set vào local hoặc cookies, sau khi hoàn thành thì trả về null
        // để chuẩn bị cho các lần sau
        // Bước 4: return về authorizedAxiosInstance các originalRequest
        // tức là gọi về các api 410 đầu tiền và các api phía sau
        if (refreshToken)
          refreshTokenPromise = handleRefreshToken(JSON.parse(refreshToken))
            .then((res: any) => {
              // lấy giá trị của accessToken khi được refresh lại
              const { accessToken } = res.data;
              // lưu accessToken vào trong localStorage
              localStorage.setItem("accessToken", JSON.stringify(accessToken));

              // accessToken đã được lưu vào trong cookies rồi

              // gán lại headers cho các request sau này, (không cần thiêt)
              // authorizedAxiosInstance.defaults.headers.Authorization = `Bearer 12312${accessToken}`

              // return lại authorizedAxiosInstance để gọi lại các api trước đỏ bị lỗi
              // cụ thể như là api access
            })
            .catch((_error: any) => {
              // khi refreshToken hết hạn
              // console.log('««««« 3333 »»»»»', 3333)
              handleLogoutApi().then(() => {
                location.href = "/auth/login";
              });
              return Promise.reject(_error);
            })
            .finally(() => {
              refreshTokenPromise = null;
            });
      }

      return refreshTokenPromise.then(() => {
        return authorizedAxiosInstance(originalRequest);
      });
    }

    // nếu request trả về lỗi thì quy về hết trong này, mã 410 là mỗi khi token hết hạn -> cần gọi lại api refresh
    // cái này giúp giảm tải try catch khi gọi api
    if (error.response?.status !== 410) {
      //   toast.error(error.response?.data?.message || error?.message);
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
