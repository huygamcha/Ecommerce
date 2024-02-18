import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { zeroFormat } from "numeral";

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
  //   user: CartType;
  //   users: CartType[];
}

const initialState: InitialType = {
  success: false,
  error: "",
  carts: [],
  loading: false,
  deleted: false,
  updated: false,
  totalPrice: 0,
  //   users: [],
};

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
      state.carts = state.carts.filter(
        (cart) => cart.id !== action.payload.id
      );
      // if (specificItem) {
      //   specificItem.quantity++;
      // } else {
      //   state.carts.push(action.payload);
      // }
      localStorage.setItem("carts", JSON.stringify(state.carts));
    },
  },
});

const { reducer, actions } = cartSlice;

export default reducer;
export const { addToCart, getAllCart, changeQuantityCart, deleteCart } = actions;
