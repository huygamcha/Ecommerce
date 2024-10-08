import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import authorizedAxiosInstance from "../utils/axiosCustom";

interface TagsType {
  name: string;
  _id: string;
}

interface InitialType {
  success: boolean;
  isSuccessCreate: boolean;
  isErrorCreate: boolean;
  isSuccessUpdate: boolean;
  isErrorUpdate: boolean;
  error: { message: string; errors: { name: string } };
  tag: TagsType;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  tags: TagsType[];
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
  tag: {
    _id: "",
    name: "",
  },
  loading: false,
  deleted: false,
  updated: false,
  tags: [],
};

const getAllTag = createAsyncThunk<TagsType[]>("tag/getAll", async () => {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND}/tags`);
  const data: TagsType[] = response.data.payload;
  return data;
});

// tham số thứ 2 là tham số truyền vào gửi từ client
const createTag = createAsyncThunk<TagsType, TagsType>(
  "tag/createTag",
  async (name, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${process.env.REACT_APP_BACKEND}/tags`,
      //   name,
      //   config
      // );
      const response = await authorizedAxiosInstance.post(
        `${process.env.REACT_APP_BACKEND}/tags`,
        name
      );
      const data: TagsType = response.data;
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

const deleteTag = createAsyncThunk<TagsType, string>(
  "tag/deleteTag",
  async (id, { rejectWithValue }) => {
    try {
      // const response = await axios.delete(
      //   `${process.env.REACT_APP_BACKEND}/tags/${id}`,
      //   config
      // );
      const response = await authorizedAxiosInstance.delete(
        `${process.env.REACT_APP_BACKEND}/tags/${id}`
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

const updateTag = createAsyncThunk<TagsType, { id: string; values: TagsType }>(
  "tag/updateTag",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const response = await authorizedAxiosInstance.patch(
        `${process.env.REACT_APP_BACKEND}/tags/${id}`,
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
  }
);

const getTagByName = createAsyncThunk<TagsType, string | undefined>(
  "tag/getTagByName",
  async (id) => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND}/tags/name/${id}`
    );
    const data: TagsType = response.data.payload;
    return data; // Assuming products are in the `data` property of the response
  }
);

const tagSlice = createSlice({
  name: "tag",
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
    builder.addCase(getAllTag.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllTag.fulfilled, (state, action) => {
      state.loading = false;
      state.tags = action.payload;
    });
    builder.addCase(getAllTag.rejected, (state, action) => {
      state.loading = false;
      state.error = { message: "", errors: { name: "" } };
    });

    //search by name
    builder.addCase(getTagByName.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTagByName.fulfilled, (state, action) => {
      state.loading = false;
      state.tag = action.payload;
    });
    builder.addCase(getTagByName.rejected, (state, action) => {
      state.loading = false;
      state.error = { message: "", errors: { name: "" } };
    });

    // create
    builder.addCase(createTag.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createTag.fulfilled, (state, action) => {
      state.loading = false;
      state.isSuccessCreate = true;
      state.tag = action.payload;
      state.error = { message: "", errors: { name: "" } };
    });
    builder.addCase(createTag.rejected, (state, action) => {
      state.isErrorCreate = true;
      state.loading = false;
      const customErrors = action.payload as {
        message: string;
        errors: { name: string };
      };
      state.error = customErrors;
    });

    //delete
    builder.addCase(deleteTag.pending, (state) => {
      state.loading = true;
      state.error = { message: "", errors: { name: "" } };
    });
    builder.addCase(deleteTag.fulfilled, (state, action) => {
      state.loading = false;
      state.tag = action.payload;
    });
    builder.addCase(deleteTag.rejected, (state, action) => {
      const customErrors = action.payload as {
        message: string;
        errors: { name: string };
      };
      state.loading = false;
      state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
    });

    //update
    builder.addCase(updateTag.pending, (state) => {
      state.loading = true;
      state.error = { message: "", errors: { name: "" } };
    });

    builder.addCase(updateTag.fulfilled, (state, action) => {
      state.isSuccessUpdate = true;
      state.loading = false;
      state.tag = action.payload;
    });

    builder.addCase(updateTag.rejected, (state, action) => {
      state.isErrorUpdate = true;
      state.loading = false;
      const customErrors = action.payload as {
        message: string;
        errors: { name: string };
      };
      state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
    });
  },
});

const { reducer } = tagSlice;

export default reducer;
export { getAllTag, createTag, deleteTag, updateTag, getTagByName };
export const { resetState } = tagSlice.actions;
