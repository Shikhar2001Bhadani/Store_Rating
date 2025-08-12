import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import storeReducer from "../features/storeSlice";
import ratingReducer from "../features/ratingSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    stores: storeReducer,
    ratings: ratingReducer
  }
});
