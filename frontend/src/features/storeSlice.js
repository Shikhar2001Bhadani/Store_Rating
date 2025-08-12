import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

export const fetchStores = createAsyncThunk("stores/fetch", async (params) => {
  const res = await api.get("/stores", { params });
  return res.data;
});

const storeSlice = createSlice({
  name: "stores",
  initialState: { list: [], total: 0, status: "idle" },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchStores.fulfilled, (s, a) => {
      s.list = a.payload.stores;
      s.total = a.payload.total;
    });
  }
});

export default storeSlice.reducer;
