import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

export const register = createAsyncThunk("auth/register", async (payload, thunkAPI) => {
  const res = await api.post("/auth/register", payload);
  return res.data.user;
});
export const login = createAsyncThunk("auth/login", async (payload) => {
  const res = await api.post("/auth/login", payload);
  return res.data.user;
});
export const me = createAsyncThunk("auth/me", async () => {
  const res = await api.get("/auth/me");
  return res.data.user;
});
export const logout = createAsyncThunk("auth/logout", async () => {
  await api.post("/auth/logout");
  return null;
});

export const updatePassword = createAsyncThunk("auth/updatePassword", async (payload) => {
  // payload: { password }
  const res = await api.put("/users/password", payload);
  return res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, status: "idle" },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(register.fulfilled, (s, a) => { s.user = a.payload; })
      .addCase(login.fulfilled, (s, a) => { s.user = a.payload; })
      .addCase(me.fulfilled, (s, a) => { s.user = a.payload; })
      .addCase(logout.fulfilled, (s) => { s.user = null; });
  }
});

export default authSlice.reducer;
