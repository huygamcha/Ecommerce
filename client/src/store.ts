import { configureStore } from '@reduxjs/toolkit'
import categorySlice from './slices/categorySlice'
import { 
  TypedUseSelectorHook, 
  useDispatch, 
  useSelector 
} from "react-redux";

// ...
const rootReducer = {
  categories: categorySlice
}

const store = configureStore({reducer: rootReducer})
export default store

export type  RootState  = ReturnType<typeof store.getState>
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;