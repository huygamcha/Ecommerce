import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import axios from "axios";

const currentUser =  localStorage.getItem('userInfor') ? JSON.parse(localStorage.getItem('userInfor')!) : undefined;

interface BrandsType {
  name: string;
  description: string;
  _id: string;
}


interface InitialType {
  success: boolean;
  error: { message?: string, errors?: any } | string;
  brand: BrandsType;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  brands: BrandsType[];
}

const initialState: InitialType = {
  success: false,
  error: '',
  brand: {
    _id: '',
    name: "",
    description: ""
  },
  loading: false,
  deleted: false,
  updated: false,
  brands: [],
};

const getAllBrand = createAsyncThunk<BrandsType[]>("brand/getAll", async () => {

  // trả về response rồi lấy ra, để tránh lỗi A non-serializable value was detected in an action, in the path: `payload.headers`
  //https://chat.openai.com/c/48f823af-3e96-48aa-8df3-fe6e306aef10
  const response = await axios.get(`${process.env.REACT_APP_BACKEND}/brands`);
  const data: BrandsType[] = response.data.payload;
  return data; // Assuming brands are in the `data` property of the response
});

// tham số thứ 2 là tham số truyền vào gửi từ client
const createBrand = createAsyncThunk<BrandsType, BrandsType>("brand/createBrand", async (name, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND}/brands`, name);
    const data: BrandsType = response.data;
    return data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      throw error;
    }
  }
});

const deleteBrand = createAsyncThunk<BrandsType, string>("brand/deleteBrand", async (id, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const response = await axios.delete(`${process.env.REACT_APP_BACKEND}/brands/${id}`, config);
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

const updateBrand = createAsyncThunk<BrandsType, { id: string, values: BrandsType }>("brand/updateBrand", async ({ id, values }, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
        // Authorization: `Bearer ${currentUser.payload.token}`,
      },
    };
    const response = await axios.patch(`${process.env.REACT_APP_BACKEND}/brands/${id}`, values, config);


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


const brandSlice = createSlice({
  name: "brand",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllBrand.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      getAllBrand.fulfilled,
      (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      }
    );
    builder.addCase(
      getAllBrand.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred"; // Ensure a default message or fallback if action.error is undefined
      }
    );

    // create
    builder.addCase(createBrand.pending, (state) => {
      state.loading = true;
      // state.error = "";
    });

    builder.addCase(
      createBrand.fulfilled,
      (state, action) => {
        state.loading = false;
        state.brand = action.payload;
        state.error = "";
      }
    );
    builder.addCase(
      createBrand.rejected,
      (state, action) => {
        console.log('««««« action »»»»»', action);
        // custom lại lỗi error trả về như postman
        // redux chỉ hỗ trợ gọi tới action.payload
        // nếu gọi thêm action.payload.errors để trả rả như postman thì 
        // redux không chắc rằng errors có phải là một object không nên nó không lưu => lỗi
        const customErrors = action.payload as { message?: string, errors?: any }
        state.loading = false;
        state.error = customErrors.errors; // Ensure a default message or fallback if action.error is undefined
      }
    );

    //delete
    builder.addCase(deleteBrand.pending, (state) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(
      deleteBrand.fulfilled,
      (state, action) => {
        state.loading = false;
        state.brand = action.payload;
      }
    );
    builder.addCase(
      deleteBrand.rejected,
      (state, action) => {
        const customErrors = action.payload as { message?: string, errors?: any }
        state.loading = false;
        state.error = customErrors.errors; // Ensure a default message or fallback if action.error is undefined
      }
    );

    //update
    builder.addCase(updateBrand.pending, (state) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(
      updateBrand.fulfilled,
      (state, action) => {
        state.loading = false;
        state.brand = action.payload;
        state.error = "";
      }
    );

    builder.addCase(
      updateBrand.rejected,
      (state, action) => {
        console.log('««««« action »»»»»', action);
        const customErrors = action.payload as { message?: string, errors?: any }
        state.loading = false;
        state.error = customErrors.errors; // Ensure a default message or fallback if action.error is undefined
      }
    );

  },
});

const { reducer } = brandSlice;

export default reducer;
export {
  getAllBrand,
  createBrand,
  deleteBrand,
  updateBrand
}

