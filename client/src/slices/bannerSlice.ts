import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


interface BannersType {
  pic: string;
  _id: string;
}

interface InitialType {
  success: boolean;
  error: { message: string; errors: { name: string } };
  banner: BannersType;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  banners: BannersType[];
}

const initialState: InitialType = {
  success: false,
  error: {
    message: "",
    errors: { name: "" },
  },
  banner: {
    _id: "",
    pic: "",
  },
  loading: false,
  deleted: false,
  updated: false,
  banners: [],
};

const getAllBanner = createAsyncThunk<BannersType[]>("banner/getAll", async () => {
  // trả về response rồi lấy ra, để tránh lỗi A non-serializable value was detected in an action, in the path: `payload.headers`
  //https://chat.openai.com/c/48f823af-3e96-48aa-8df3-fe6e306aef10
  const response = await axios.get(`${process.env.REACT_APP_BACKEND}/banners`);
  const data: BannersType[] = response.data.payload;
  return data; // Assuming banners are in the `data` property of the response
});

// tham số thứ 2 là tham số truyền vào gửi từ client
const createBanner = createAsyncThunk<BannersType, BannersType>(
  "banner/createBanner",
  async (name, { rejectWithValue }) => {
    const currentUser = localStorage.getItem('userInfor') ? JSON.parse(localStorage.getItem('userInfor')!) : undefined;
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/banners`,
        name, config
      );
      const data: BannersType = response.data;
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

const deleteBanner = createAsyncThunk<BannersType, string>(
  "banner/deleteBanner",
  async (id, { rejectWithValue }) => {
    const currentUser = localStorage.getItem('userInfor') ? JSON.parse(localStorage.getItem('userInfor')!) : undefined;
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND}/banners/${id}`,
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

const updateBanner = createAsyncThunk<BannersType, { id: string; values: BannersType }>(
  "banner/updateBanner",
  async ({ id, values }, { rejectWithValue }) => {
    const currentUser = localStorage.getItem('userInfor') ? JSON.parse(localStorage.getItem('userInfor')!) : undefined;
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND}/banners/${id}`,
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

const bannerSlice = createSlice({
  name: "banner",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllBanner.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAllBanner.fulfilled, (state, action) => {
      state.loading = false;
      state.banners = action.payload;
    });
    builder.addCase(getAllBanner.rejected, (state, action) => {
      state.loading = false;
      state.error = { message: "", errors: { name: '' } };// Ensure a default message or fallback if action.error is undefined
    });

    // create
    builder.addCase(createBanner.pending, (state) => {
      state.loading = true;
      // state.error = "";
    });

    builder.addCase(createBanner.fulfilled, (state, action) => {
      state.loading = false;
      state.banner = action.payload;
      state.error = { message: "", errors: { name: '' } };

    });
    builder.addCase(createBanner.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as { message: string; errors: { name: string } };
      state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
    });

    //delete
    builder.addCase(deleteBanner.pending, (state) => {
      state.loading = true;
      state.error = { message: "", errors: { name: '' } };

    });

    builder.addCase(deleteBanner.fulfilled, (state, action) => {
      state.loading = false;
      state.banner = action.payload;
    });
    builder.addCase(deleteBanner.rejected, (state, action) => {
      const customErrors = action.payload as { message: string; errors: { name: string } };
      state.loading = false;
      state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
    });

    //update
    builder.addCase(updateBanner.pending, (state) => {
      state.loading = true;
      state.error = { message: "", errors: { name: '' } };
    });

    builder.addCase(updateBanner.fulfilled, (state, action) => {
      state.loading = false;
      state.banner = action.payload;
    });

    builder.addCase(updateBanner.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as { message: string; errors: { name: string } };
      state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
    });
  },
});

const { reducer } = bannerSlice;

export default reducer;
export { getAllBanner, createBanner, deleteBanner, updateBanner };
