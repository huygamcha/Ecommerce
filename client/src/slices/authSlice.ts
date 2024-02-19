import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


interface LoginType {
  name: string;
  password: string;
}

interface UserType {
  id: string;
  fullName: string;
  token: string;
  refreshToken: string;
}

interface InitialType {
  success: boolean;
  error: string | { message?: string; errors?: any };
  user: UserType;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  users: UserType[];
}

const currentUser: UserType = localStorage.getItem("userInfor")
  ? JSON.parse(localStorage.getItem("userInfor")!)
  : null;

const initialState: InitialType = {
  success: false,
  error: "",
  user: currentUser,
  loading: false,
  deleted: false,
  updated: false,
  users: [],
};

// tham số thứ 2 là tham số truyền vào gửi từ client
const loginUser = createAsyncThunk<UserType, LoginType>(
  "auth/loginUser",
  async (values, { rejectWithValue }) => {
    try {
      console.log('«««««  »»»»»',  );
      // const response = await axios.post("http://localhost:4000/login", values);
      const response = await axios.post(`${process.env.REACT_APP_BACKEND}/login`, values);
      const data: UserType = response.data.payload;
      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        throw error;
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {

    logout: (state) => {
      state.user = {
        id: '',
        fullName: '',
        token: '',
        refreshToken: '',
      }
      state.success = false;
      localStorage.clear()
    }
  },
  extraReducers(builder) {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = "";
      state.success = false;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.success = true;
      state.loading = false;
      state.user = action.payload;
      localStorage.setItem("userInfor", JSON.stringify(state.user));
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as { message?: string; errors?: any };
      state.error = customErrors.message || "An unknown error occurred"; // Ensure a default message or fallback if action.error is undefined
    });
  },
});

const { reducer, actions } = authSlice;

export default reducer;
export { loginUser };
export const {logout} = actions
