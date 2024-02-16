import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface RegisterType {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  password: string;
  avatar: string | undefined;
  email: string;
  birthday: string;
}

interface InitialType {
  success: boolean;
  error: { message: string; errors: { phoneNumber: string; email: string } };
  user: RegisterType;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  users: RegisterType[];
}

// const currentUser : UserType = localStorage.getItem("userInfor") ? JSON.parse(localStorage.getItem("userInfor")!)  : null;

const initialState: InitialType = {
  success: false,
  error: {
    message: "",
    errors: { phoneNumber: "", email: "" },
  },
  user: {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    password: "",
    avatar: "",
    email: "",
    birthday: "",
  },
  loading: false,
  deleted: false,
  updated: false,
  users: [],
};

const registerUser = createAsyncThunk<RegisterType, RegisterType>(
  "auth/registerUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/customers",
        values
      );
      const data: RegisterType = response.data;
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

const customerSlice = createSlice({
  name: "customer",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(registerUser.pending, (state) => {
      state.success = false;
      state.loading = false;
      state.error = { message: "", errors: { phoneNumber: "", email: "" } };
    });

    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.user = action.payload
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as {
        message: string;
        errors: { phoneNumber: string; email: string };
      };
      state.error = customErrors;
    });
  },
});

const { reducer } = customerSlice;

export default reducer;
export { registerUser };
