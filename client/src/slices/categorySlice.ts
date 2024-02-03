import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface CategoriesType {
  name: string;
  description: string;

}

interface InitialType {
  success: boolean;
  error: string;
  category: string;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  categories: CategoriesType[];
}

const initialState: InitialType = {
  success: false,
  error: "",
  category: "",
  loading: false,
  deleted: false,
  updated: false,
  categories: [],
};

const getAllCategory = createAsyncThunk<CategoriesType[]>("category/getAll", async () => {

  // trả về response rồi lấy ra, để tránh lỗi A non-serializable value was detected in an action, in the path: `payload.headers`
  //https://chat.openai.com/c/48f823af-3e96-48aa-8df3-fe6e306aef10
  const response = await axios.get("http://localhost:4000/categories");
  const data: CategoriesType[] = response.data; 
   return data; // Assuming categories are in the `data` property of the response
});

const categorySlice = createSlice({
  name: "category",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllCategory.pending, (state) => {
      state.loading = true;
      state.error = "";
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
  },
});

const { reducer } = categorySlice;

export default reducer;
export {
  getAllCategory
}
