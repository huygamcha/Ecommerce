import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


interface PoliciesType {
  name: string;
  _id: string;
  content: string;
  link: string;
  slug: string;
}

interface InitialType {
  success: boolean;
  error: { message: string; errors: { name : string}  } ;
  policy: PoliciesType;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  policies: PoliciesType[];
}

const initialState: InitialType = {
  success: false,
  error: {
    message: "",
    errors: { name: ""},
  },
  policy: {
    slug: '',
    _id: "",
    name: "",
    content: '',
    link: ''
  },
  loading: false,
  deleted: false,
  updated: false,
  policies: [],
};

const getAllPolicy = createAsyncThunk<PoliciesType[]>("policy/getAll", async () => {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND}/policies`);
  const data: PoliciesType[] = response.data.payload;
  return data; 
});

const getPolicyById = createAsyncThunk<PoliciesType, string | undefined>(
  "policy/getPolicyById",
  async (id) => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND}/policies/${id}`
    );
    const data: PoliciesType = response.data.payload;
    return data; // Assuming products are in the `data` property of the response
  }
);

// tham số thứ 2 là tham số truyền vào gửi từ client
const createPolicy = createAsyncThunk<PoliciesType, PoliciesType>(
  "policy/createPolicy",
  async (name, { rejectWithValue }) => {
    const currentUser =  localStorage.getItem('userInfor') ? JSON.parse(localStorage.getItem('userInfor')!) : undefined;

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/policies`,
        name,config
      );
      const data: PoliciesType = response.data;
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

const deletePolicy = createAsyncThunk<PoliciesType, string>(
  "policy/deletePolicy",
  async (id, { rejectWithValue }) => {
    const currentUser =  localStorage.getItem('userInfor') ? JSON.parse(localStorage.getItem('userInfor')!) : undefined;

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND}/policies/${id}`,
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

const updatePolicy = createAsyncThunk<PoliciesType, { id: string; values: PoliciesType }>(
  "policy/updatePolicy",
  async ({ id, values }, { rejectWithValue }) => {
    const currentUser =  localStorage.getItem('userInfor') ? JSON.parse(localStorage.getItem('userInfor')!) : undefined;

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      };
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND}/policies/${id}`,
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
  }
);

const policySlice = createSlice({
  name: "policy",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllPolicy.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAllPolicy.fulfilled, (state, action) => {
      state.loading = false;
      state.policies = action.payload;
    });
    builder.addCase(getAllPolicy.rejected, (state, action) => {
      state.loading = false;
      state.error = { message: "", errors: { name : ''} };// Ensure a default message or fallback if action.error is undefined
    });

    // create
    builder.addCase(createPolicy.pending, (state) => {
      state.loading = true;
      // state.error = "";
    });

    builder.addCase(createPolicy.fulfilled, (state, action) => {
      state.loading = false;
      state.policy = action.payload;
      state.error = { message: "", errors: { name : ''}  };

    });
    builder.addCase(createPolicy.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as { message: string; errors: { name : string} };
      state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
    });

    //delete
    builder.addCase(deletePolicy.pending, (state) => {
      state.loading = true;
      state.error = { message: "", errors: { name : ''}};

    });

    builder.addCase(deletePolicy.fulfilled, (state, action) => {
      state.loading = false;
      state.policy = action.payload;
    });
    builder.addCase(deletePolicy.rejected, (state, action) => {
      const customErrors = action.payload as { message: string; errors: { name : string} };
      state.loading = false;
      state.error = customErrors; // Ensure a default message or fallback if action.error is undefined
    });

    //update
    builder.addCase(updatePolicy.pending, (state) => {
      state.loading = true;
      state.error = { message: "", errors: { name : ''}};
    });

    builder.addCase(updatePolicy.fulfilled, (state, action) => {
      state.loading = false;
      state.policy = action.payload;
    });

    builder.addCase(updatePolicy.rejected, (state, action) => {
      state.loading = false;
      const customErrors = action.payload as { message: string; errors: { name : string} };
      state.error = customErrors ; // Ensure a default message or fallback if action.error is undefined
    });

      //get by id
      builder.addCase(getPolicyById.pending, (state) => {
        state.loading = true;
      });
  
      builder.addCase(getPolicyById.fulfilled, (state, action) => {
        state.loading = false;
        state.policy = action.payload;
      });

      builder.addCase(getPolicyById.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) { // Check if payload exists
          const customErrors = action.payload as { message?: string; errors?: any };
          state.error = customErrors.errors || undefined;
        } else {
          // Handle the case where there's no payload (optional)
          state.error = { message: "", errors: { name: "" } };
        }
      });
  },
});

const { reducer } = policySlice;

export default reducer;
export { getAllPolicy, createPolicy, deletePolicy, updatePolicy , getPolicyById};
