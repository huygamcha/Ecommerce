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
  customer: RegisterType;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  customers: RegisterType[];
}

const currentUser = localStorage.getItem("userInfor") ? JSON.parse(localStorage.getItem("userInfor")!)  : null;

const initialState: InitialType = {
  success: false,
  error: {
    message: "",
    errors: { phoneNumber: "", email: "" },
  },
  customer: {
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
  customers: [],
};

const registerUser = createAsyncThunk<RegisterType, RegisterType>(
  "auth/registerUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/customers`,
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

const getInforUser = createAsyncThunk<RegisterType, string>(
  "auth/getInforUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND}/customers/${values}`,
        
      );
      const data: RegisterType = response.data.payload;
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

const updateUser = createAsyncThunk<RegisterType, RegisterType>(
  "auth/updateUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND}/customers/${currentUser.id}`,
        values
      );
      const data: RegisterType = response.data.payload;
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
      state.customer = action.payload
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as {
        message: string;
        errors: { phoneNumber: string; email: string };
      };
      state.error = customErrors;
    });

    //get user
    builder.addCase(getInforUser.pending, (state) => {
      state.success = false;
      state.loading = false;
      state.error = { message: "", errors: { phoneNumber: "", email: "" } };
    });

    builder.addCase(getInforUser.fulfilled, (state, action) => {
      state.loading = false;
      // state.success = true;
      state.customer = action.payload
    });
    builder.addCase(getInforUser.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as {
        message: string;
        errors: { phoneNumber: string; email: string };
      };
      state.error = customErrors;
    });

    //update
    builder.addCase(updateUser.pending, (state) => {
      state.success = false;
      state.loading = false;
      state.error = { message: "", errors: { phoneNumber: "", email: "" } };
    });

    builder.addCase(updateUser.fulfilled, (state, action) => {
      // console.log('««««« action »»»»»', action);
      state.loading = false;
      state.success = true;
      state.customer = action.payload
    });
    builder.addCase(updateUser.rejected, (state, action) => {
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
export { registerUser, getInforUser ,updateUser };
