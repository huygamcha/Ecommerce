import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface FooterType {
  name: string;
  column: number;
  url?: string;
  optional?: string;
}

interface InitialType {
  success: boolean;
  error: { message: string; errors: { name: string } };
  footer: FooterType;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  footers: FooterType[];
}


const initialState: InitialType = {
  success: false,
  error: {
    message: "",
    errors: { name: "" },
  },
  footer: {
    name: "",
    column: 1,
    url: "",
    optional: "",
  },
  loading: false,
  deleted: false,
  updated: false,
  footers: [],
};

const createFooter = createAsyncThunk<FooterType, FooterType>(
  "footer/createFooter",
  async (values, { rejectWithValue }) => {
    const currentUser = localStorage.getItem("userInfor")
    ? JSON.parse(localStorage.getItem("userInfor")!)
    : null;
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
    };
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/footers`,
        values, config
      );
      const data: FooterType = response.data;
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

const getAllFooter = createAsyncThunk<FooterType[]>(
  "footer/getAll",
  async () => {
    // trả về response rồi lấy ra, để tránh lỗi A non-serializable value was detected in an action, in the path: `payload.headers`
    //https://chat.openai.com/c/48f823af-3e96-48aa-8df3-fe6e306aef10
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND}/footers`
    );
    const data: FooterType[] = response.data.payload;
    return data; // Assuming categories are in the `data` property of the response
  }
);

const getDetailFooter = createAsyncThunk<FooterType, string>(
  "footer/getDetailFooter",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND}/footers/${values}`
      );
      const data: FooterType = response.data.payload;
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

const deleteFooter = createAsyncThunk<FooterType, string>(
  "footer/deleteFooter",
  async (id, { rejectWithValue }) => {
    const currentUser = localStorage.getItem("userInfor")
    ? JSON.parse(localStorage.getItem("userInfor")!)
    : null;
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND}/footers/${id}`,
        config
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

const updateFooter = createAsyncThunk<
  FooterType,
  { id: string; values: FooterType }
>("footer/updateFooter", async ({ id, values }, { rejectWithValue }) => {

  const currentUser = localStorage.getItem("userInfor")
    ? JSON.parse(localStorage.getItem("userInfor")!)
    : null;
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
    };
    const response = await axios.patch(
      `${process.env.REACT_APP_BACKEND}/footers/${id}`,
      values,
      config
    );

    const data: FooterType = response.data.payload;
    return data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      throw error;
    }
  }
});

const footerSlice = createSlice({
  name: "footer",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(createFooter.pending, (state) => {
      state.success = false;
      state.loading = false;
      state.error = { message: "", errors: { name: "" } };
    });

    builder.addCase(createFooter.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.footer = action.payload;
    });
    builder.addCase(createFooter.rejected, (state, action) => {
      state.loading = false;
      state.success = false;

      const customErrors = action.payload as {
        message: string;
        errors: { name: "" };
      };
      state.error = customErrors;
    });

    //get all Footer
    builder.addCase(getAllFooter.pending, (state) => {
      state.success = false;
      state.loading = false;
      state.error = { message: "", errors: { name: "" } };
    });

    builder.addCase(getAllFooter.fulfilled, (state, action) => {
      state.loading = false;
      // state.success = true;
      state.footers = action.payload;
    });
    builder.addCase(getAllFooter.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as {
        message: string;
        errors: { name: "" };
      };
      state.error = customErrors;
    });

    //get detail Footer
    builder.addCase(getDetailFooter.pending, (state) => {
      state.success = false;
      state.loading = false;
      state.error = { message: "", errors: { name: "" } };
    });

    builder.addCase(getDetailFooter.fulfilled, (state, action) => {
      state.loading = false;
      // state.success = true;
      state.footer = action.payload;
    });
    builder.addCase(getDetailFooter.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as {
        message: string;
        errors: { name: "" };
      };
      state.error = customErrors;
    });

    //update
    builder.addCase(updateFooter.pending, (state) => {
      state.success = false;
      state.loading = false;
      state.error = { message: "", errors: { name: "" } };
    });

    builder.addCase(updateFooter.fulfilled, (state, action) => {
      console.log("««««« action »»»»»", action);
      state.loading = false;
      state.success = true;
      state.footer = action.payload;
    });
    builder.addCase(updateFooter.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as {
        message: string;
        errors: { name: "" };
      };
      state.error = customErrors;
    });

    //delete
    //delete
    builder.addCase(deleteFooter.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteFooter.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(deleteFooter.rejected, (state, action) => {
      console.log('««««« action »»»»»', action);
      state.loading = false;
      const customErrors = action.payload as {
        message: string;
        errors: { name: "" };
      };
      state.error = customErrors;
    });
  },
});

const { reducer } = footerSlice;
export default reducer;
export { createFooter, getDetailFooter, updateFooter, getAllFooter, deleteFooter };
