import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import axios from "axios";

// console.log('««««« currentUser.payload.token »»»»»', currentUser.token);
interface BrandsType {
  name: string;
  _id: string;
  pic: string;
  categoryId: string
}


interface InitialType {
  success: boolean;
  error: { message?: string, errors?: {name? : string} } ;
  brand: BrandsType;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  brands: BrandsType[];
}

const initialState: InitialType = {
  success: false,
  error:{ message : '', errors : {name  : ''} } ,
  brand: {
    _id: '',
    name: "",
    pic: "",
  categoryId: ""
  },
  loading: false,
  deleted: false,
  updated: false,
  brands: [],
};

const getAllBrand = createAsyncThunk<BrandsType[]>("brand/getAll",  async () => {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND}/brands`);
  const data: BrandsType[] = response.data.payload;
  return data; 
});

// tham số thứ 2 là tham số truyền vào gửi từ client
const createBrand = createAsyncThunk<BrandsType, BrandsType>("brand/createBrand", async (value, { rejectWithValue }) => {
const currentUser =  localStorage.getItem('userInfor') ? JSON.parse(localStorage.getItem('userInfor')!) : undefined;

  try {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
    };
    const response = await axios.post(`${process.env.REACT_APP_BACKEND}/brands`, value, config);
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
  const currentUser =  localStorage.getItem('userInfor') ? JSON.parse(localStorage.getItem('userInfor')!) : undefined;

  try {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
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
const currentUser =  localStorage.getItem('userInfor') ? JSON.parse(localStorage.getItem('userInfor')!) : undefined;
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
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

const getBrandByName = createAsyncThunk<BrandsType, string | undefined>(
  "category/getCategoryByName",
  async (name) => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND}/brands/name/${name}`
    );
    const data: BrandsType = response.data.payload;
    return data; // Assuming products are in the `data` property of the response
  }
);


const brandSlice = createSlice({
  name: "brand",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllBrand.pending, (state) => {
      state.loading = true;
      state.error = {message: '', errors: {name : ''}};
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
        const customErrors = action.payload as {message: string , errors : {name: string}}
        state.error = customErrors
      }
    );
    

    // get brand by name
    builder.addCase(getBrandByName.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getBrandByName.fulfilled,
      (state, action) => {
        state.loading = false;
        state.brand = action.payload;
      }
    );
    builder.addCase(
      getBrandByName.rejected,
      (state, action) => {
        state.loading = false;
        state.error = {message: '', errors: {name : ''}};
      }
    );

    // create
    builder.addCase(createBrand.pending, (state) => {
      state.loading = true;
      state.error = {message: '', errors: {name : ''}};
    });
    builder.addCase(
      createBrand.fulfilled,
      (state, action) => {
        state.loading = false;
        state.brand = action.payload;
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
        state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
      }
    );

    //delete
    builder.addCase(deleteBrand.pending, (state) => {
      state.loading = true;
      state.error = {message: '', errors: {name : ''}};
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
        state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
      }
    );

    //update
    builder.addCase(updateBrand.pending, (state) => {
      state.loading = true;
      state.error = {message: '', errors: {name : ''}};
    });
    builder.addCase(
      updateBrand.fulfilled,
      (state, action) => {
        state.loading = false;
        state.brand = action.payload;
      }
    );
    builder.addCase(
      updateBrand.rejected,
      (state, action) => {
        console.log('««««« action »»»»»', action);
        const customErrors = action.payload as { message?: string, errors?: {name: string} }
        state.loading = false;
        state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
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
  updateBrand,
  getBrandByName
}

