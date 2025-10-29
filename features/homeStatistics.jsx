import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiInstance";

const initialState = {
  home_data : [],
  home_loading : false,
}

export const handleGetHomeStatistics = createAsyncThunk("homeStatistics/handleGetHomeStatistics", async() => {
  const response = await fetchData({url :"overview", method :"GET"});
  return response;
})

export const homeStatistics = createSlice({
  name:"homeStatistics",
  initialState,
  extraReducers : (builder) => {
    builder
    .addCase(handleGetHomeStatistics.pending ,(state) => {
      state.home_loading = true;
    })
    .addCase(handleGetHomeStatistics.fulfilled ,(state, action) => {
      state.home_data = action.payload;
      state.home_loading = false;
    })
  }
})

export default homeStatistics.reducer;