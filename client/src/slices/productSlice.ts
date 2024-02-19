import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import axios from "axios";

interface ProductsType {
  _id: string;
  name: string;
  description: string;
  supplierId: string;
  categoryId: string;
  price: number;
  discount: number;
  stock: number;
  total: number;
  pic: string;
}


interface InitialType {
  success: boolean;
  error: { message?: string, errors?: any } | string;
  product: ProductsType | undefined;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  products: ProductsType[];
}

interface ProductSearchType {
  search? :string;
  page?: number;
  pageSize?: number ;
}

const initialState: InitialType = {
  success: false,
  error: '',
  product: {
    _id: '',
    name: '',
    description: '',
    supplierId: '',
    categoryId: '',
    price: 0,
    discount: 0,
    stock: 0,
    total: 0,
    pic: ''
  },
  loading: false,
  deleted: false,
  updated: false,
  products: [],
};

const getAllProduct = createAsyncThunk<ProductsType[], ProductSearchType>("product/getAll", async (arg = {}) => {

  let {search  ,page, pageSize } = arg;
  if (!search) {
    search = ''
  }
  if (!page) {
    page = 1;
  }
  if (!pageSize) {
    pageSize = 6;
  }

  // trả về response rồi lấy ra, để tránh lỗi A non-serializable value was detected in an action, in the path: `payload.headers`
  //https://chat.openai.com/c/48f823af-3e96-48aa-8df3-fe6e306aef10
  const response = await axios.get(`${process.env.REACT_APP_BACKEND}/products?search=${search}&page=${page}&pageSize=${pageSize}`);
  const data: ProductsType[] = response.data.payload;
  return data; // Assuming products are in the `data` property of the response
});

const getProductByCategories = createAsyncThunk<ProductsType[], string | undefined>("product/getProductByCategories", async (id) => {

  // trả về response rồi lấy ra, để tránh lỗi A non-serializable value was detected in an action, in the path: `payload.headers`
  //https://chat.openai.com/c/48f823af-3e96-48aa-8df3-fe6e306aef10
  const response = await axios.get(`${process.env.REACT_APP_BACKEND}/products/byCategories?id=${id}`);
  const data: ProductsType[] = response.data.payload;
  return data; // Assuming products are in the `data` property of the response
});

const getProductBySuppliers = createAsyncThunk<ProductsType[], string | undefined>("product/getProductBySuppliers", async (id) => {

  // trả về response rồi lấy ra, để tránh lỗi A non-serializable value was detected in an action, in the path: `payload.headers`
  //https://chat.openai.com/c/48f823af-3e96-48aa-8df3-fe6e306aef10
  const response = await axios.get(`${process.env.REACT_APP_BACKEND}/products/BySuppliers?id=${id}`);
  const data: ProductsType[] = response.data.payload;
  return data; // Assuming products are in the `data` property of the response
});

const getProductById = createAsyncThunk<ProductsType, string | undefined>("product/getProductById", async (id) => {

  // trả về response rồi lấy ra, để tránh lỗi A non-serializable value was detected in an action, in the path: `payload.headers`
  //https://chat.openai.com/c/48f823af-3e96-48aa-8df3-fe6e306aef10
  const response = await axios.get(`${process.env.REACT_APP_BACKEND}/products/${id}`);
  const data: ProductsType = response.data.payload;
  return data; // Assuming products are in the `data` property of the response
});

// tham số thứ 2 là tham số truyền vào gửi từ client
const createProduct = createAsyncThunk<ProductsType, ProductsType>("product/createProduct", async (name, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND}/products`, name);
    const data: ProductsType = response.data;
    return data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      throw error;
    }
  }
});

const deleteProduct = createAsyncThunk<ProductsType, string>("product/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const response = await axios.delete(`${process.env.REACT_APP_BACKEND}/products/${id}`, config);
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

const updateProduct = createAsyncThunk<ProductsType, { id: string, values: ProductsType }>("product/updateProduct", async ({ id, values }, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const response = await axios.patch(`${process.env.REACT_APP_BACKEND}/products/${id}`, values, config);


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


const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    //get all
    builder.addCase(getAllProduct.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      getAllProduct.fulfilled,
      (state, action) => {
        state.loading = false;
        state.products = action.payload;

      }
    );
    builder.addCase(
      getAllProduct.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred"; // Ensure a default message or fallback if action.error is undefined
      }
    );

    //get by category
    builder.addCase(getProductByCategories.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      getProductByCategories.fulfilled,
      (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = "";
      }
    );
    builder.addCase(
      getProductByCategories.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred"; // Ensure a default message or fallback if action.error is undefined
      }
    );

    //get by supplier
    builder.addCase(getProductBySuppliers.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      getProductBySuppliers.fulfilled,
      (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = "";
      }
    );
    builder.addCase(
      getProductBySuppliers.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred"; // Ensure a default message or fallback if action.error is undefined
      }
    );

    //get by id 
    builder.addCase(getProductById.pending, (state) => {
      state.loading = true;
      state.product = undefined;
    });

    builder.addCase(
      getProductById.fulfilled,
      (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.error = "";
      }
    );
    builder.addCase(
      getProductById.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred"; // Ensure a default message or fallback if action.error is undefined
      }
    );


    // create
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      createProduct.fulfilled,
      (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.error = "";
      }
    );
    builder.addCase(
      createProduct.rejected,
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
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(
      deleteProduct.fulfilled,
      (state, action) => {
        state.loading = false;
        state.product = action.payload;
      }
    );
    builder.addCase(
      deleteProduct.rejected,
      (state, action) => {
        const customErrors = action.payload as { message?: string, errors?: any }
        state.loading = false;
        state.error = customErrors.errors; // Ensure a default message or fallback if action.error is undefined
      }
    );

    //update
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(
      updateProduct.fulfilled,
      (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.error = "";

      }
    );
    builder.addCase(
      updateProduct.rejected,
      (state, action) => {
        const customErrors = action.payload as { message?: string, errors?: any }
        state.loading = false;
        state.error = customErrors.errors; // Ensure a default message or fallback if action.error is undefined
      }
    );

  },
});

const { reducer } = productSlice;

export default reducer;
export {
  getAllProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductByCategories,
  getProductBySuppliers,
  getProductById
}

