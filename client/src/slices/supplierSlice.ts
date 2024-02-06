import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import axios from "axios";

interface SuppliersType {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

interface InitialType {
  success: boolean;
  error: { message?: string, errors?: any } | string;
  supplier: SuppliersType;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  suppliers: SuppliersType[];
}

const initialState: InitialType = {
  success: false,
  error: '',
  supplier: {
    name: '',
    email: '',
    phoneNumber: '',
    address: ''
  },
  loading: false,
  deleted: false,
  updated: false,
  suppliers: [],
};

const getAllSupplier = createAsyncThunk<SuppliersType[]>("supplier/getAll", async () => {

  // trả về response rồi lấy ra, để tránh lỗi A non-serializable value was detected in an action, in the path: `payload.headers`
  //https://chat.openai.com/c/48f823af-3e96-48aa-8df3-fe6e306aef10
  const response = await axios.get("http://localhost:4000/suppliers");
  const data: SuppliersType[] = response.data.payload;
  return data; // Assuming suppliers are in the `data` property of the response
});

// tham số thứ 2 là tham số truyền vào gửi từ client
const createSupplier = createAsyncThunk<SuppliersType, SuppliersType>("supplier/createSupplier", async (name, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://localhost:4000/suppliers", name);
    const data: SuppliersType = response.data;
    return data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      throw error;
    }
  }
});

const deleteSupplier = createAsyncThunk<SuppliersType, string>("supplier/deleteSupplier", async (id, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const response = await axios.delete(`http://localhost:4000/suppliers/${id}`, config);
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

const updateSupplier = createAsyncThunk<SuppliersType, { id: string, values: SuppliersType }>("supplier/updateSupplier", async ({ id, values }, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const response = await axios.patch(`http://localhost:4000/suppliers/${id}`, values, config);
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


const supplierSlice = createSlice({
  name: "supplier",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllSupplier.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      getAllSupplier.fulfilled,
      (state, action) => {
        state.loading = false;
        state.suppliers = action.payload;

      }
    );
    builder.addCase(
      getAllSupplier.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred"; // Ensure a default message or fallback if action.error is undefined
      }
    );

    // create
    builder.addCase(createSupplier.pending, (state) => {
      state.loading = true;

      // state.error = "";
    });

    builder.addCase(
      createSupplier.fulfilled,
      (state, action) => {
        state.loading = false;
        state.supplier = action.payload;
        state.error = "";
      }
    );
    builder.addCase(
      createSupplier.rejected,
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
    builder.addCase(deleteSupplier.pending, (state) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(
      deleteSupplier.fulfilled,
      (state, action) => {
        state.loading = false;
        state.supplier = action.payload;
      }
    );
    builder.addCase(
      deleteSupplier.rejected,
      (state, action) => {
        const customErrors = action.payload as { message?: string, errors?: any }
        state.loading = false;
        state.error = customErrors.errors; // Ensure a default message or fallback if action.error is undefined
      }
    );

    //update
    builder.addCase(updateSupplier.pending, (state) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(
      updateSupplier.fulfilled,
      (state, action) => {
        state.loading = false;
        state.supplier = action.payload;
        state.error = "";

      }
    );
    builder.addCase(
      updateSupplier.rejected,
      (state, action) => {
        const customErrors = action.payload as { message?: string, errors?: any }
        state.loading = false;
        state.error = customErrors.errors; // Ensure a default message or fallback if action.error is undefined
      }
    );

  },
});

const { reducer } = supplierSlice;

export default reducer;
export {
  getAllSupplier,
  createSupplier,
  deleteSupplier,
  updateSupplier
}

