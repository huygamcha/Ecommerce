import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import axios from "axios";

interface ProductsType {
  name: string;
  description: string;
  supplierId: string;
  categoryId: string;
  price: number;
  discount: number;
  stock: number;
  total: number;
}


interface InitialType {
  success: boolean;
  error: { message?: string, errors?: any } | string;
  product: ProductsType;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  products: ProductsType[];
}

const initialState: InitialType = {
  success: false,
  error: '',
  product: {
    name: '',
    description: '',
    supplierId: '',
    categoryId: '',
    price: 0,
    discount: 0,
    stock: 0,
    total: 0,
  },
  loading: false,
  deleted: false,
  updated: false,
  products: [],
};

const getAllProduct = createAsyncThunk<ProductsType[]>("product/getAll", async () => {

  // trả về response rồi lấy ra, để tránh lỗi A non-serializable value was detected in an action, in the path: `payload.headers`
  //https://chat.openai.com/c/48f823af-3e96-48aa-8df3-fe6e306aef10
  const response = await axios.get("http://localhost:4000/products");
  const data: ProductsType[] = response.data.payload;
  return data; // Assuming products are in the `data` property of the response
});

// tham số thứ 2 là tham số truyền vào gửi từ client
const createProduct = createAsyncThunk<ProductsType, ProductsType>("product/createProduct", async (name, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://localhost:4000/products", name);
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
    const response = await axios.delete(`http://localhost:4000/products/${id}`, config);
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
    const response = await axios.patch(`http://localhost:4000/products/${id}`, values, config);


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

    // create
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;

      // state.error = "";
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
  updateProduct
}

