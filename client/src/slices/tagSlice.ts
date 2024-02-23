import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const currentUser = localStorage.getItem("userInfor")
  ? JSON.parse(localStorage.getItem("userInfor")!)
  : undefined;

interface TagsType {
  name: string;
  _id: string;
}

interface InitialType {
  success: boolean;
  error: { message: string; errors: { name : string}  } ;
  tag: TagsType;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  tags: TagsType[];
}

const initialState: InitialType = {
  success: false,
  error: {
    message: "",
    errors: { name: ""},
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
  // trả về response rồi lấy ra, để tránh lỗi A non-serializable value was detected in an action, in the path: `payload.headers`
  //https://chat.openai.com/c/48f823af-3e96-48aa-8df3-fe6e306aef10
  const response = await axios.get(`${process.env.REACT_APP_BACKEND}/tags`);
  const data: TagsType[] = response.data.payload;
  return data; // Assuming tags are in the `data` property of the response
});

// tham số thứ 2 là tham số truyền vào gửi từ client
const createTag = createAsyncThunk<TagsType, TagsType>(
  "tag/createTag",
  async (name, { rejectWithValue }) => {
    try {
      const response = await axios.post(
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
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND}/tags/${id}`,
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

const updateTag = createAsyncThunk<TagsType, { id: string; values: TagsType }>(
  "tag/updateTag",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          // Authorization: `Bearer ${currentUser.payload.token}`,
        },
      };
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND}/tags/${id}`,
        values,
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

const tagSlice = createSlice({
  name: "tag",
  initialState: initialState,
  reducers: {},
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
      state.error = { message: "", errors: { name : ''} };// Ensure a default message or fallback if action.error is undefined
    });

    // create
    builder.addCase(createTag.pending, (state) => {
      state.loading = true;
      // state.error = "";
    });

    builder.addCase(createTag.fulfilled, (state, action) => {
      state.loading = false;
      state.tag = action.payload;
      state.error = { message: "", errors: { name : ''}  };

    });
    builder.addCase(createTag.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as { message: string; errors: { name : string} };
      state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
    });

    //delete
    builder.addCase(deleteTag.pending, (state) => {
      state.loading = true;
      state.error = { message: "", errors: { name : ''}};

    });

    builder.addCase(deleteTag.fulfilled, (state, action) => {
      state.loading = false;
      state.tag = action.payload;
    });
    builder.addCase(deleteTag.rejected, (state, action) => {
      const customErrors = action.payload as { message: string; errors: { name : string} };
      state.loading = false;
      state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
    });

    //update
    builder.addCase(updateTag.pending, (state) => {
      state.loading = true;
      state.error = { message: "", errors: { name : ''}};
    });

    builder.addCase(updateTag.fulfilled, (state, action) => {
      state.loading = false;
      state.tag = action.payload;
    });

    builder.addCase(updateTag.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as { message: string; errors: { name : string} };
      state.error = customErrors ; // Ensure a default message or fallback if action.error is undefined
    });
  },
});

const { reducer } = tagSlice;

export default reducer;
export { getAllTag, createTag, deleteTag, updateTag };
