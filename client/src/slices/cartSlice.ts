import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { zeroFormat } from "numeral";

interface UserType {
  id: string;
  name: string;
}

interface InitialType {
  success: boolean;
  error: string | { message?: string; errors?: any };
  carts: UserType[];
  loading: boolean;
  deleted: boolean;
  updated: boolean;
//   user: UserType;
//   users: UserType[];
}

const currentCart = localStorage.getItem("carts")
    ? JSON.parse(localStorage.getItem("carts")!)
    : [];

const initialState: InitialType = {
  success: false,
  error: "",
  carts: currentCart,
  loading: false,
  deleted: false,
  updated: false,
//   users: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {

    logout: (state) => {
    //   state.user = {
    //     id: '',
    //     fullName: '',
    //     token: '',
    //     refreshToken: '',
    //   }
    //   localStorage.removeItem('userInfor')
    },

    addToCart: (state, action) => {
        console.log('««««« action »»»»»', action);
        // eslint-disable-next-line array-callback-return
        state.carts.map((cart) => {
            if (cart.name  === action.payload.name) {
                return cart.quantity +
            }
        })
        state.carts.push(action.payload)
        localStorage.setItem("carts", JSON.stringify(state.carts));
    }
  },

});

const { reducer, actions } = cartSlice;

export default reducer;
export const {addToCart} = actions
