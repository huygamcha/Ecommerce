import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import authorizedAxiosInstance from "../utils/axiosCustom";

interface BannersType {
  pic: string;
  link: string;
  _id: string;
  subBanner: boolean;
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
    subBanner: false,
    _id: "",
    pic: "",
    link: "",
  },
  loading: false,
  deleted: false,
  updated: false,
  banners: [],
};

const getAllBanner = createAsyncThunk<BannersType[]>(
  "banner/getAll",
  async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND}/banners`
    );
    // const response = await authorizedAxiosInstance.get(
    //   `${process.env.REACT_APP_BACKEND}/banners`
    // );
    const data: BannersType[] = response.data.payload;
    return data;
  }
);

// tham số thứ 2 là tham số truyền vào gửi từ client
const createBanner = createAsyncThunk<BannersType, BannersType>(
  "banner/createBanner",
  async (name, { rejectWithValue }) => {
    
    try {
      const response = await authorizedAxiosInstance.post(
        `${process.env.REACT_APP_BACKEND}/banners`,
        name
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
    
    try {
      const response = await authorizedAxiosInstance.delete(
        `${process.env.REACT_APP_BACKEND}/banners/${id}`
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

const updateBanner = createAsyncThunk<
  BannersType,
  { id: string; values: BannersType }
>("banner/updateBanner", async ({ id, values }, { rejectWithValue }) => {
  
  try {
 
    const response = await authorizedAxiosInstance.patch(
      `${process.env.REACT_APP_BACKEND}/banners/${id}`,
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
      state.error = { message: "", errors: { name: "" } }; // Ensure a default message or fallback if action.error is undefined
    });

    // create
    builder.addCase(createBanner.pending, (state) => {
      state.loading = true;
      // state.error = "";
    });

    builder.addCase(createBanner.fulfilled, (state, action) => {
      state.loading = false;
      state.banner = action.payload;
      state.error = { message: "", errors: { name: "" } };
    });
    builder.addCase(createBanner.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as {
        message: string;
        errors: { name: string };
      };
      state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
    });

    //delete
    builder.addCase(deleteBanner.pending, (state) => {
      state.loading = true;
      state.error = { message: "", errors: { name: "" } };
    });

    builder.addCase(deleteBanner.fulfilled, (state, action) => {
      state.loading = false;
      state.banner = action.payload;
    });
    builder.addCase(deleteBanner.rejected, (state, action) => {
      const customErrors = action.payload as {
        message: string;
        errors: { name: string };
      };
      state.loading = false;
      state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
    });

    //update
    builder.addCase(updateBanner.pending, (state) => {
      state.loading = true;
      state.error = { message: "", errors: { name: "" } };
    });

    builder.addCase(updateBanner.fulfilled, (state, action) => {
      state.loading = false;
      state.banner = action.payload;
    });

    builder.addCase(updateBanner.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as {
        message: string;
        errors: { name: string };
      };
      state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
    });
  },
});

const { reducer } = bannerSlice;

export default reducer;
export { getAllBanner, createBanner, deleteBanner, updateBanner };
