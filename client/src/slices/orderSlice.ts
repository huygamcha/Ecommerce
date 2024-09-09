import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import authorizedAxiosInstance from "../utils/axiosCustom";

interface detailProduct {
  name: string;
  discount: number;
  pic: string;
  price: number;
  quantity: number;
  slug: string;
  total: number;
  unit: string;
  categoryId: string;
  id: string;
}

interface OrdersType {
  nameOrder: string;
  phoneOrder: string;
  email: string;
  // name: string;
  // phone: number;
  notice: string;
  addressDetail: string;
  commune: string;
  district: string;
  province: string;
  typePayment: string;
  listProduct: detailProduct[];
}

interface InitialType {
  success: boolean;
  error: string;
  order: OrdersType;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  orders: OrdersType[];
  isSuccessCreate: boolean;
  isErrorCreate: boolean;
  isSuccessUpdate: boolean;
  isErrorUpdate: boolean;
}

const initialState: InitialType = {
  isSuccessCreate: false,
  isSuccessUpdate: false,
  isErrorCreate: false,
  isErrorUpdate: false,
  success: false,
  error: "",
  order: {
    nameOrder: "",
    phoneOrder: "",
    email: "",
    notice: "",
    addressDetail: "",
    commune: "",
    district: "",
    province: "",
    typePayment: "",
    listProduct: [
      {
        id: "",
        name: "",
        discount: 0,
        pic: "",
        price: 0,
        quantity: 0,
        slug: "",
        total: 0,
        unit: "",
        categoryId: "",
      },
    ],
  },
  loading: false,
  deleted: false,
  updated: false,
  orders: [],
};

const getAllOrder = createAsyncThunk<OrdersType[]>("order/getAll", async () => {
  // trả về response rồi lấy ra, để tránh lỗi A non-serializable value was detected in an action, in the path: `payload.headers`
  //https://chat.openai.com/c/48f823af-3e96-48aa-8df3-fe6e306aef10
  const response = await axios.get(`${process.env.REACT_APP_BACKEND}/orders`);
  const data: OrdersType[] = response.data.payload;
  return data; // Assuming orders are in the `data` property of the response
});

// tham số thứ 2 là tham số truyền vào gửi từ client
const createOrder = createAsyncThunk<OrdersType, OrdersType>(
  "order/createOrder",
  async (name, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/orders`,
        name
      );
      const data: OrdersType = response.data;
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

const deleteOrder = createAsyncThunk<OrdersType, string>(
  "order/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await authorizedAxiosInstance.delete(
        `${process.env.REACT_APP_BACKEND}/orders/${id}`
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

const updateOrder = createAsyncThunk<
  OrdersType,
  { id: string; values: OrdersType }
>("order/updateOrder", async ({ id, values }, { rejectWithValue }) => {
  try {
    const response = await authorizedAxiosInstance.patch(
      `${process.env.REACT_APP_BACKEND}/orders/${id}`,
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

const orderSlice = createSlice({
  name: "order",
  initialState: initialState,
  reducers: {
    resetState: (state) => {
      state.isSuccessCreate = false;
      state.isSuccessUpdate = false;
      state.isErrorCreate = false;
      state.isErrorUpdate = false;
      state.success = false;
      state.loading = false;
      state.deleted = false;
      state.updated = false;
    },
  },
  extraReducers(builder) {
    builder.addCase(getAllOrder.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAllOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    });
    builder.addCase(getAllOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    });

    // create
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      // state.error = "";
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.isSuccessCreate = true;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.isErrorCreate = true;
      state.error = action.error.message || "An error occurred";
    });

    //delete
    builder.addCase(deleteOrder.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
    });
    builder.addCase(deleteOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    });

    //update
    builder.addCase(updateOrder.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.isSuccessUpdate = true
    });
    builder.addCase(updateOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
      state.isErrorUpdate = true
    });
  },
});

const { reducer } = orderSlice;
export const {resetState} = orderSlice.actions
export default reducer;
export { getAllOrder, createOrder, deleteOrder, updateOrder };
