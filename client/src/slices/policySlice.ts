import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import authorizedAxiosInstance from "../utils/axiosCustom";

interface PoliciesType {
  name: string;
  _id: string;
  content: string;
  link: string;
  slug: string;
}

interface InitialType {
  isSuccessCreate: boolean;
  isErrorCreate: boolean;
  isSuccessUpdate: boolean;
  isErrorUpdate: boolean;
  success: boolean;
  error: { message: string; errors: { name: string } };
  policy: PoliciesType;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  policies: PoliciesType[];
}

const initialState: InitialType = {
  isSuccessCreate: false,
  isSuccessUpdate: false,
  isErrorCreate: false,
  isErrorUpdate: false,
  success: false,
  error: {
    message: "",
    errors: { name: "" },
  },
  policy: {
    slug: "",
    _id: "",
    name: "",
    content: "",
    link: "",
  },
  loading: false,
  deleted: false,
  updated: false,
  policies: [],
};

const getAllPolicy = createAsyncThunk<PoliciesType[]>(
  "policy/getAll",
  async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND}/policies`
    );
    const data: PoliciesType[] = response.data.payload;
    return data;
  }
);

const getPolicyById = createAsyncThunk<PoliciesType, string | undefined>(
  "policy/getPolicyById",
  async (id) => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND}/policies/${id}`
    );
    const data: PoliciesType = response.data.payload;
    return data; // Assuming products are in the `data` property of the response
  }
);

// tham số thứ 2 là tham số truyền vào gửi từ client
const createPolicy = createAsyncThunk<PoliciesType, PoliciesType>(
  "policy/createPolicy",
  async (name, { rejectWithValue }) => {
    try {
      const response = await authorizedAxiosInstance.post(
        `${process.env.REACT_APP_BACKEND}/policies`,
        name
      );
      const data: PoliciesType = response.data;
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

const deletePolicy = createAsyncThunk<PoliciesType, string>(
  "policy/deletePolicy",
  async (id, { rejectWithValue }) => {
    try {
      const response = await authorizedAxiosInstance.delete(
        `${process.env.REACT_APP_BACKEND}/policies/${id}`
      );
      const data = response.data;
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

const updatePolicy = createAsyncThunk<
  PoliciesType,
  { id: string; values: PoliciesType }
>("policy/updatePolicy", async ({ id, values }, { rejectWithValue }) => {
  try {
    const response = await authorizedAxiosInstance.patch(
      `${process.env.REACT_APP_BACKEND}/policies/${id}`,
      values
    );

    const data = response.data;
    return data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      throw error;
    }
  }
});

const policySlice = createSlice({
  name: "policy",
  initialState: initialState,
  reducers: {
    resetState: (state) => {
      state.isSuccessCreate = false;
      state.isSuccessUpdate = false;
      state.isErrorCreate = false;
      state.isErrorUpdate = false;
      state.success = false;
      state.error = {
        message: "",
        errors: { name: "" },
      };
      state.loading = false;
      state.deleted = false;
      state.updated = false;
    },
  },
  extraReducers(builder) {
    builder.addCase(getAllPolicy.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllPolicy.fulfilled, (state, action) => {
      state.loading = false;
      state.policies = action.payload;
    });
    builder.addCase(getAllPolicy.rejected, (state, action) => {
      state.loading = false;
      state.error = { message: "", errors: { name: "" } }; // Ensure a default message or fallback if action.error is undefined
    });

    // create
    builder.addCase(createPolicy.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createPolicy.fulfilled, (state, action) => {
      state.loading = false;
      state.policy = action.payload;
      state.error = { message: "", errors: { name: "" } };
      state.isSuccessCreate = true;
    });
    builder.addCase(createPolicy.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as {
        message: string;
        errors: { name: string };
      };
      state.error = customErrors;
      state.isErrorCreate = true;
    });

    //delete
    builder.addCase(deletePolicy.pending, (state) => {
      state.loading = true;
      state.error = { message: "", errors: { name: "" } };
    });

    builder.addCase(deletePolicy.fulfilled, (state, action) => {
      state.loading = false;
      state.policy = action.payload;
    });
    builder.addCase(deletePolicy.rejected, (state, action) => {
      const customErrors = action.payload as {
        message: string;
        errors: { name: string };
      };
      state.loading = false;
      state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
    });

    //update
    builder.addCase(updatePolicy.pending, (state) => {
      state.loading = true;
      state.error = { message: "", errors: { name: "" } };
    });

    builder.addCase(updatePolicy.fulfilled, (state, action) => {
      state.loading = false;
      state.policy = action.payload;
      state.isSuccessUpdate = true;
    });

    builder.addCase(updatePolicy.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as {
        message: string;
        errors: { name: string };
      };
      state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
      state.isErrorUpdate = true;
    });

    //get by id
    builder.addCase(getPolicyById.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getPolicyById.fulfilled, (state, action) => {
      state.loading = false;
      state.policy = action.payload;
    });

    builder.addCase(getPolicyById.rejected, (state, action) => {
      state.loading = false;
      if (action.payload) {
        // Check if payload exists
        const customErrors = action.payload as {
          message?: string;
          errors?: any;
        };
        state.error = customErrors.errors || undefined;
      } else {
        // Handle the case where there's no payload (optional)
        state.error = { message: "", errors: { name: "" } };
      }
    });
  },
});

const { reducer } = policySlice;
export default reducer;
export const { resetState } = policySlice.actions;
export {
  getAllPolicy,
  createPolicy,
  deletePolicy,
  updatePolicy,
  getPolicyById,
};
