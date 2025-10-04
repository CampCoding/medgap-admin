import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiInstance";
import { userApi } from "../api/userEndPoints";

const initialState = {
  is_loading:  false, 
  login_data : [],
  login_error : null
}

export const handleSubmitLogin = createAsyncThunk("AuthSlice/handleSubmitLogin",async({body}) =>{
  const response = await fetchData({url : userApi.routes.login , body , method :"POST"});
  return response;
})

export const AuthSlice = createSlice({
  name:"AuthSlice",
  initialState,
  extraReducers : (builder) => {
    builder
    .addCase(handleSubmitLogin.pending, (state,  action) => {
      state.is_loading = true,
      state.login_data = null
    })
    .addCase(handleSubmitLogin.fulfilled , (state, action) => {
      state.is_loading = false,
      state.login_data = action.payload
    })
    .addCase(handleSubmitLogin.rejected , (state,action) => {
      state.login_error = action.payload
    })
  }
})

export default AuthSlice.reducer;