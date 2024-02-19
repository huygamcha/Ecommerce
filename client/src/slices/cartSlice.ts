import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import axios from "axios";

interface CartType {
  id: string;
  name: string;
  pic: string;
  quantity: number;
  price: number;
  stock: number;
  total: number;
  discount: number;
}

interface InitialType {
  success: boolean;
  error: string | { message?: string; errors?: any };
  carts: CartType[];
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  totalPrice: number;
}

const initialState: InitialType = {
  success: false,
  error: "",
  carts: [],
  loading: false,
  deleted: false,
  updated: false,
  totalPrice: 0,
};

const getCartFromCustomer = createAsyncThunk<CartType[]>(
  "cart/getCartFromCustomer",
  async ( _ ,{ rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const currentUser = localStorage.getItem("userInfor")
        ? JSON.parse(localStorage.getItem("userInfor")!)
        : undefined;

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND}/carts/${currentUser.id}`,
        config
      );
      const data: CartType[] = response.data;
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

const createCartFromCustomer = createAsyncThunk<CartType[]>(
  "cart/createCartFromCustomer",
  async ( _ ,{ rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const currentUser = localStorage.getItem("userInfor")
        ? JSON.parse(localStorage.getItem("userInfor")!)
        : undefined;

      const allCarts = localStorage.getItem("carts")
      ? JSON.parse(localStorage.getItem("carts")!)
      : [];

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/carts`,{userId: currentUser.id, cartList: allCarts},
        config
      );
      const data: CartType[] = response.data;
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

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    getAllCart: (state) => {
      const allCarts = localStorage.getItem("carts")
        ? JSON.parse(localStorage.getItem("carts")!)
        : [];
      state.carts = allCarts;
      state.totalPrice = state.carts.reduce((total, cart) => {
        return total + cart.total * cart.quantity;
      }, 0);

    },

    changeQuantityCart: (state, action) => {
      const specificItem = state.carts.find(
        (item) => item.id === action.payload.id
      );
      if (specificItem) {
        specificItem.quantity = action.payload.quantity;
      }
      localStorage.setItem("carts", JSON.stringify(state.carts));
    },

    addToCart: (state, action) => {
      console.log("««««« action »»»»»", action);
      // kiểm tra nếu sản phẩm giống nhau thì tăng số lượng
      const specificItem = state.carts.find(
        (cart) => cart.id === action.payload.id
      );
      if (specificItem) {
        specificItem.quantity++;
      } else {
        state.carts.push(action.payload);
      }
      localStorage.setItem("carts", JSON.stringify(state.carts));
    },

    deleteCart: (state, action) => {
      // kiểm tra nếu sản phẩm giống nhau thì tăng số lượng
      state.carts = state.carts.filter((cart) => cart.id !== action.payload.id);
      localStorage.setItem("carts", JSON.stringify(state.carts));
    },
  },
  
  extraReducers(builder) {
     //get all
     builder.addCase(getCartFromCustomer.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      getCartFromCustomer.fulfilled,
      (state, action) => {
        state.loading = false;
        state.carts = action.payload;
        localStorage.setItem('carts', JSON.stringify(state.carts))
      }
    );
    builder.addCase(
      getCartFromCustomer.rejected,
      (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred"; // Ensure a default message or fallback if action.error is undefined
      }
    );

    // create
    builder.addCase(createCartFromCustomer.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      createCartFromCustomer.fulfilled,
      (state, action) => {
        console.log('««««« action »»»»»', action);
        state.loading = false;
        state.error = "";
      }
    );
    builder.addCase(
      createCartFromCustomer.rejected,
      (state, action) => {
      
        const customErrors = action.payload as { message?: string, errors?: any }
        state.loading = false;
        state.error = customErrors.message || 'Có lỗi xảy ra ở cartSlice'; // Ensure a default message or fallback if action.error is undefined
      }
    );

  },

  //create
  
});

const { reducer, actions } = cartSlice;

export default reducer;
export   {
  getCartFromCustomer,
  createCartFromCustomer
}
export const { addToCart, getAllCart, changeQuantityCart, deleteCart } =
  actions;
