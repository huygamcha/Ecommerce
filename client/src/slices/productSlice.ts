import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ProductsType {
  _id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  discount: number;
  stock: number;
  total: number;
  pic: string;
  slug: string;
  category: any;
  brand: any;
  fromBrand: string;
  supplierHome: string;
  country: string;
  ingredient: string;
  detail: string;
  specifications: string;
  unit: string;
  album: Array<string>;
  age: number;
  tagList: Array<string>;
}

interface ProductSearchType {
  search?: string;
  page?: number;
  pageSize?: number;
  searchTag?: string ;
  categoryId?: string;
  brandId?: string;
  priceFrom?: number;
  priceTo?: number;
  ageFrom?: number;
  ageTo?: number;
}

interface InitialType {
  success: boolean;
  error: { message?: string; errors?: { name: string } };
  product: ProductsType | undefined;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  products: ProductsType[];
  productsSearch: ProductsType[];
  productsHistory: ProductsType[];
}

const initialState: InitialType = {
  success: false,
  error: { message: "", errors: { name: "" } },
  product: {
    tagList: [],
    album: [''],
    brand: {},
    category: {},
    slug: "",
    _id: "",
    name: "",
    description: "",
    categoryId: "",
    price: 0,
    discount: 0,
    stock: 0,
    total: 0,
    pic: "",
    fromBrand: '',
    supplierHome: '',
    country: '',
    ingredient: '',
    detail: '',
    specifications: '',
    unit: '',
    age: 0
  },
  loading: false,
  deleted: false,
  updated: false,
  products: [],
  productsSearch: [],
  productsHistory: []
};

const getAllProduct = createAsyncThunk<ProductsType[], ProductSearchType>(
  "product/getAll",
  async (arg = {}) => {
    let { search, page, pageSize } = arg;
    if (!search) {
      search = "";
    }
    if (!page) {
      page = 1;
    }
    if (!pageSize) {
      pageSize = 12;
    }

    // trả về response rồi lấy ra, để tránh lỗi A non-serializable value was detected in an action, in the path: `payload.headers`
    //https://chat.openai.com/c/48f823af-3e96-48aa-8df3-fe6e306aef10
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND}/products?search=${search}&page=${page}&pageSize=${pageSize}`
    );
    const data: ProductsType[] = response.data.payload;
    return data; // Assuming products are in the `data` property of the response
  }
);

const getAllProductSearch = createAsyncThunk<ProductsType[], ProductSearchType>(
  "product/getAllProductSearch",
  async (arg = {}) => {
    const filter = localStorage.getItem("filter")
      ? JSON.parse(localStorage.getItem("filter")!)
      : undefined;

    const searchPriceInfor = localStorage.getItem("searchPrice")
      ? JSON.parse(localStorage.getItem("searchPrice")!)
      : undefined;

    const searchAgeInfor = localStorage.getItem("searchAge")
      ? JSON.parse(localStorage.getItem("searchAge")!)
      : undefined;

    let { searchTag, priceFrom, priceTo, ageFrom, ageTo , categoryId, brandId, search } = arg;
    console.log('««««« arg »»»»»', arg);

    if (!search) {
      search= ''
    }
    
    if (!searchTag) {
      searchTag = ''
    }
    if (filter && filter.searchTag) {
      searchTag = filter.searchTag;
    }
  
    if (!categoryId) {
      categoryId = filter?.categoryId; // Use optional chaining to safely access filter.categoryId
    }

    if (!brandId) {
      brandId = filter?.brandId; // Use optional chaining to safely access filter.brandId
    }

    if (!priceFrom && searchPriceInfor && priceFrom !== 0) {
      priceFrom = searchPriceInfor.priceFrom;
    } else if (!priceFrom && !searchPriceInfor) {
      priceFrom = 0;
    }

    if (!priceTo && searchPriceInfor && priceTo !== 0) {
      priceTo = searchPriceInfor.priceTo;
    } else if (!priceTo && !searchPriceInfor) {
      priceTo = 1000000000;
    }

    if (!ageFrom && searchAgeInfor && ageFrom !== 0) {
      ageFrom = searchAgeInfor.ageFrom;
    } else if (!ageFrom && !searchAgeInfor) {
      ageFrom = 0;
    }

    if (!ageTo && searchAgeInfor && ageTo !== 0) {
      ageTo = searchAgeInfor.ageTo;
    } else if (!ageTo && !searchAgeInfor) {
      ageTo = 100;
    }
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND}/products/search?${categoryId? `categoryId=${categoryId}` : ''}${searchTag? `&searchTag=${searchTag}` : ''}${brandId? `&brandId=${brandId}` : ''}&priceFrom=${priceFrom}&priceTo=${priceTo}&ageFrom=${ageFrom}&ageTo=${ageTo}&search=${search}`
    );
    const data: ProductsType[] = response.data.payload;
    return data; // Assuming products are in the `data` property of the response
  }
);

const getProductByCategories = createAsyncThunk<
  ProductsType[],
  string | undefined
>("product/getProductByCategories", async (id) => {
  
  const categoryId = localStorage.getItem("searchCategory")
  ? JSON.parse(localStorage.getItem("searchCategory")!)
  : undefined;

  if (!id) {
    id = categoryId.id
  }
  console.log('««««« id »»»»»', id);
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND}/products/byCategories?id=${id}`
  );
  const data: ProductsType[] = response.data.payload;
  return data; // Assuming products are in the `data` property of the response
});

const getProductBySuppliers = createAsyncThunk<
  ProductsType[],
  string | undefined
>("product/getProductBySuppliers", async (id) => {

  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND}/products/BySuppliers?id=${id}`
  );
  const data: ProductsType[] = response.data.payload;
  return data; // Assuming products are in the `data` property of the response
});

const getProductById = createAsyncThunk<ProductsType, string | undefined>(
  "product/getProductById",
  async (id) => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND}/products/${id}`
      );
    const data: ProductsType = response.data.payload;
    return data; // Assuming products are in the `data` property of the response
  }
);

// tham số thứ 2 là tham số truyền vào gửi từ client
const createProduct = createAsyncThunk<ProductsType, ProductsType>(
  "product/createProduct",
  async (name, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/products`,
        name
      );
      const data: ProductsType = response.data;
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

const deleteProduct = createAsyncThunk<ProductsType, string>(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND}/products/${id}`,
        config
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

const updateProduct = createAsyncThunk<
  ProductsType,
  { id: string; values: ProductsType }
>("product/updateProduct", async ({ id, values }, { rejectWithValue }) => {
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const response = await axios.patch(
      `${process.env.REACT_APP_BACKEND}/products/${id}`,
      values,
      config
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

const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    // addToHistory: (state, action) => {
    //   const specificItem = state.productsHistory.find(item => item._id === action.payload.id)
    //   if (!specificItem) {
    //     state.productsHistory.push(action.payload.id)
    //   }
    // }
  },
  extraReducers(builder) {
    //get all
    builder.addCase(getAllProduct.pending, (state) => {
      state.loading = true;
      state.error = { message: "", errors: { name: "" } };
    });

    builder.addCase(getAllProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
    });
    builder.addCase(getAllProduct.rejected, (state, action) => {
      console.log("««««« action »»»»»", action);
      state.loading = false;

      if (action.payload) {
        const customErrors = action.payload as {
          message?: string;
          errors?: any;
        };
        state.error = customErrors;
      }
      // Ensure a default message or fallback if action.error is undefined
    });

    //get search tag
    builder.addCase(getAllProductSearch.pending, (state) => {
      state.loading = true;
      state.error = { message: "", errors: { name: "" } };
    });

    builder.addCase(getAllProductSearch.fulfilled, (state, action) => {
      console.log("««««« action »»»»»", action);
      state.loading = false;
      state.productsSearch = action.payload;
    });
    builder.addCase(getAllProductSearch.rejected, (state, action) => {
      console.log("««««« action »»»»»", action);
      state.loading = false;
      if (action.payload) {
        const customErrors = action.payload as {
          message?: string;
          errors?: any;
        };
        state.error = customErrors;
      }
      // Ensure a default message or fallback if action.error is undefined
    });

    //get by category
    builder.addCase(getProductByCategories.pending, (state) => {
      state.loading = true;
      state.error = { message: "", errors: { name: "" } };
    });

    builder.addCase(getProductByCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
    });
    builder.addCase(getProductByCategories.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as { message?: string; errors?: any };
      state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
    });

    //get by supplier
    builder.addCase(getProductBySuppliers.pending, (state) => {
      state.error = { message: "", errors: { name: "" } };
      state.loading = true;
    });

    builder.addCase(getProductBySuppliers.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
    });
    builder.addCase(getProductBySuppliers.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as { message?: string; errors?: any };
      state.error = customErrors.errors || undefined; // Ensure a default message or fallback if action.error is undefined
    });

    //get by id
    builder.addCase(getProductById.pending, (state) => {
      state.loading = true;
      state.product = undefined;
      state.error = { message: "", errors: { name: "" } };
    });

    builder.addCase(getProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
    });
    builder.addCase(getProductById.rejected, (state, action) => {
      console.log("««««« action »»»»»", action);
      state.loading = false;
      const customErrors = action.payload as { message?: string; errors?: any };
      state.error = customErrors.errors || undefined; // Ensure a default message or fallback if action.error is undefined
    });

    // create
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.error = { message: "", errors: { name: "" } };
    });

    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      console.log("««««« action »»»»»", action);
      // custom lại lỗi error trả về như postman
      // redux chỉ hỗ trợ gọi tới action.payload
      // nếu gọi thêm action.payload.errors để trả rả như postman thì
      // redux không chắc rằng errors có phải là một object không nên nó không lưu => lỗi
      const customErrors = action.payload as { message?: string; errors?: any };
      state.loading = false;
      state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
    });

    //delete
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = { message: "", errors: { name: "" } };
    });

    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      const customErrors = action.payload as { message?: string; errors?: any };
      state.loading = false;
      state.error = customErrors.errors || undefined; // Ensure a default message or fallback if action.error is undefined
    });

    //update
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = { message: "", errors: { name: "" } };
    });

    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as { message?: string; errors?: any };
      state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
    });
  },
});

const { reducer, actions } = productSlice;

export default reducer;
export {
  getAllProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductByCategories,
  getProductBySuppliers,
  getProductById,
  getAllProductSearch,
};

// export const { addToHistory } = actions
