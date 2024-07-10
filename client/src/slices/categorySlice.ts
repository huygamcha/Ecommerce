import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import axios from "axios";


interface CategoriesType {
  name: string;
  no: number;
  _id: string;
  productCount: number;
  slug: string;
  pic: string;

}


interface InitialType {
  success: boolean;
  error: { message?: string, errors?: any } | string;
  category: CategoriesType;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  categories: CategoriesType[];
}

const initialState: InitialType = {
  success: false,
  error: '',
  category: {
  pic: '',
    slug: '',
    _id: '',
    name: "",
    no: 0,
    productCount: 0
  },
  loading: false,
  deleted: false,
  updated: false,
  categories: [],
};

const getAllCategory = createAsyncThunk<CategoriesType[]>("category/getAll", async () => {

  // trả về response rồi lấy ra, để tránh lỗi A non-serializable value was detected in an action, in the path: `payload.headers`
  //https://chat.openai.com/c/48f823af-3e96-48aa-8df3-fe6e306aef10
  const response = await axios.get(`${process.env.REACT_APP_BACKEND}/categories`);
  const data: CategoriesType[] = response.data.payload;
  return data; // Assuming categories are in the `data` property of the response
});

// tham số thứ 2 là tham số truyền vào gửi từ client
const createCategory = createAsyncThunk<CategoriesType, CategoriesType>("category/createCategory", async (name, { rejectWithValue }) => {
  const currentUser = localStorage.getItem('userInfor') ? JSON.parse(localStorage.getItem('userInfor')!) : undefined;
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
    };
    const response = await axios.post(`${process.env.REACT_APP_BACKEND}/categories`, name, config);
    const data: CategoriesType = response.data;
    return data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      throw error;
    }
  }
});

const getCategoryByName = createAsyncThunk<CategoriesType, string | undefined>(
  "category/getCategoryByName",
  async (name) => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND}/categories/name/${name}`
    );
    const data: CategoriesType = response.data.payload;
    return data; // Assuming products are in the `data` property of the response
  }
);

const deleteCategory = createAsyncThunk<CategoriesType, string>("category/deleteCategory", async (id, { rejectWithValue }) => {
  const currentUser = localStorage.getItem('userInfor') ? JSON.parse(localStorage.getItem('userInfor')!) : undefined;
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
    };
    const response = await axios.delete(`${process.env.REACT_APP_BACKEND}/categories/${id}`, config);
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

const updateCategory = createAsyncThunk<CategoriesType, { id: string, values: CategoriesType }>("category/updateCategory", async ({ id, values }, { rejectWithValue }) => {
  const currentUser = localStorage.getItem('userInfor') ? JSON.parse(localStorage.getItem('userInfor')!) : undefined;
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
    };
    const response = await axios.patch(`${process.env.REACT_APP_BACKEND}/categories/${id}`, values, config);


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


const categorySlice = createSlice({
  name: "category",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllCategory.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      getAllCategory.fulfilled,
      (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      }
    );
    builder.addCase(
      getAllCategory.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred"; // Ensure a default message or fallback if action.error is undefined
      }
    );

    // create
    builder.addCase(createCategory.pending, (state) => {
      state.loading = true;
      // state.error = "";
    });

    builder.addCase(
      createCategory.fulfilled,
      (state, action) => {
        state.loading = false;
        state.category = action.payload;
        state.error = "";
      }
    );
    builder.addCase(
      createCategory.rejected,
      (state, action) => {
        // console.log('««««« action »»»»»', action);
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
    builder.addCase(deleteCategory.pending, (state) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(
      deleteCategory.fulfilled,
      (state, action) => {
        state.loading = false;
        state.category = action.payload;
      }
    );
    builder.addCase(
      deleteCategory.rejected,
      (state, action) => {
        const customErrors = action.payload as { message?: string, errors?: any }
        state.loading = false;
        state.error = customErrors.errors; // Ensure a default message or fallback if action.error is undefined
      }
    );

    // get by name
     builder.addCase(getCategoryByName.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      getCategoryByName.fulfilled,
      (state, action) => {
        state.loading = false;
        state.category = action.payload;
      }
    );
    builder.addCase(
      getCategoryByName.rejected,
      (state, action) => {
        state.loading = false;
        state.error =    state.error = { message: "", errors: { name : ''} };; // Ensure a default message or fallback if action.error is undefined
      }
    );

    //update
    builder.addCase(updateCategory.pending, (state) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(
      updateCategory.fulfilled,
      (state, action) => {
        state.loading = false;
        state.category = action.payload;
        state.error = "";
      }
    );

    builder.addCase(
      updateCategory.rejected,
      (state, action) => {
        // console.log('««««« action »»»»»', action);
        const customErrors = action.payload as { message?: string, errors?: any }
        state.loading = false;
        state.error = customErrors.errors; // Ensure a default message or fallback if action.error is undefined
      }
    );

  },
});

const { reducer } = categorySlice;

export default reducer;
export {
  getAllCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  getCategoryByName
}

