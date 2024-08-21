import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import authorizedAxiosInstance from "../utils/axiosCustom";

interface LocationsType {
  _id: string;
  time: string;
  address: string;
  map: string;
  name: string;
  iframe: string;
  description: string;
  album: Array<string>;
}

interface InitialType {
  success: boolean;
  error: string | undefined;
  location: LocationsType;
  loading: boolean;
  deleted: boolean;
  updated: boolean;
  locations: LocationsType[];
}

const initialState: InitialType = {
  success: false,
  error: "",
  location: {
    album: [],
    iframe: "",
    description: "",
    name: "",
    _id: "",
    time: "",
    address: "",
    map: "",
  },
  loading: false,
  deleted: false,
  updated: false,
  locations: [],
};

const getAllLocation = createAsyncThunk<LocationsType[]>(
  "location/getAll",
  async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND}/locations`
    );
    const data: LocationsType[] = response.data.payload;
    return data;
  }
);

// tham số thứ 2 là tham số truyền vào gửi từ client
const createLocation = createAsyncThunk<LocationsType, LocationsType>(
  "location/createLocation",
  async (name, { rejectWithValue }) => {
    const currentUser = localStorage.getItem("userInfor")
      ? JSON.parse(localStorage.getItem("userInfor")!)
      : undefined;
    try {
      const response = await authorizedAxiosInstance.post(
        `${process.env.REACT_APP_BACKEND}/locations`,
        name
      );
      const data: LocationsType = response.data;
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

const deleteLocation = createAsyncThunk<LocationsType, string>(
  "location/deleteLocation",
  async (id, { rejectWithValue }) => {
    const currentUser = localStorage.getItem("userInfor")
      ? JSON.parse(localStorage.getItem("userInfor")!)
      : undefined;
    try {
      const response = await authorizedAxiosInstance.delete(
        `${process.env.REACT_APP_BACKEND}/locations/${id}`
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

const updateLocation = createAsyncThunk<
  LocationsType,
  { id: string; values: LocationsType }
>("location/updateLocation", async ({ id, values }, { rejectWithValue }) => {
  const currentUser = localStorage.getItem("userInfor")
    ? JSON.parse(localStorage.getItem("userInfor")!)
    : undefined;
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${currentUser.token}`,
      },
    };
    const response = await authorizedAxiosInstance.patch(
      `${process.env.REACT_APP_BACKEND}/locations/${id}`,
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

const locationSlice = createSlice({
  name: "location",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllLocation.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAllLocation.fulfilled, (state, action) => {
      state.loading = false;
      state.locations = action.payload;
    });
    builder.addCase(getAllLocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // create
    builder.addCase(createLocation.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(createLocation.fulfilled, (state, action) => {
      state.loading = false;
      state.location = action.payload;
    });
    builder.addCase(createLocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    //delete
    builder.addCase(deleteLocation.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteLocation.fulfilled, (state, action) => {
      state.loading = false;
      state.location = action.payload;
    });
    builder.addCase(deleteLocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    //update
    builder.addCase(updateLocation.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(updateLocation.fulfilled, (state, action) => {
      state.loading = false;
      state.location = action.payload;
    });

    builder.addCase(updateLocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

const { reducer } = locationSlice;
export default reducer;
export { getAllLocation, createLocation, deleteLocation, updateLocation };
