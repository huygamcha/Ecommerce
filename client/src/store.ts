import { configureStore } from '@reduxjs/toolkit'
import categorySlice from './slices/categorySlice'
import productSlice from './slices/productSlice'
import supplierSlice from './slices/supplierSlice'
import auth from './slices/authSlice'
import customerSlice from './slices/customerSlice'
import { 
  TypedUseSelectorHook, 
  useDispatch, 
  useSelector
} from "react-redux";

// ...
const rootReducer = {
  categories: categorySlice,
  products: productSlice,
  suppliers: supplierSlice,
  auth: auth,
  customers: customerSlice
  
}

const store = configureStore({reducer: rootReducer})
export default store

// config useSelector and useDispatch
export type  RootState  = ReturnType<typeof store.getState>
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;