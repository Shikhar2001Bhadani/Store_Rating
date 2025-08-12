import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

export const submitRating = createAsyncThunk("ratings/submit", async (payload) => {
  // payload may include: { storeId, ratingValue, comment? }
  const res = await api.post("/ratings", payload);
  return res.data;
});

export const getUserRating = createAsyncThunk("ratings/getUserRating", async (storeId) => {
  const res = await api.get(`/ratings/user/${storeId}`);
  return res.data.rating;
});

const ratingSlice = createSlice({
  name: "ratings",
  initialState: { current: null },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUserRating.fulfilled, (s,a) => { s.current = a.payload; })
           .addCase(submitRating.fulfilled, (s,a) => { s.current = a.payload.rating; });
  }
});

export default ratingSlice.reducer;
