import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiInstance";
import { userApi } from "../api/userEndPoints";

const initialState = {
  create_unit_loading : false,
  edit_unit_loading : false,
  delete_unit_loading : false
}

export const handleCreateUnit = createAsyncThunk("unitsSlice/handleCreateUnit",async({id , body}) => {
  const response = await fetchData({url : `${userApi.routes.create_module}/${id}/units/create` , body , method :"POST"});
  return response
})

export const handleEditUnit = createAsyncThunk("unitsSlice/handleEditUnit",async({id  , unitId, body}) => {
  const response = await fetchData({url : `${userApi.routes.create_module}/${id}/units/${unitId}/update`,body, method :"PUT"});
  return response
})

export const handleDeleteUnit = createAsyncThunk("unitsSlice/handleDeleteUnit",async({id  , unitId}) => {
  const response = await fetchData({url : `${userApi.routes.create_module}/${id}/units/${unitId}/delete`, method :"DELETE"});
  return response
})


export const unitsSlice = createSlice({
  name:"unitsSlice",
  initialState,
  extraReducers : (builder) => {
    builder
    .addCase(handleCreateUnit.pending ,(state , action) => {
      state.create_unit_loading = true;
    })
    .addCase(handleCreateUnit.fulfilled , (state , action) => {
      state.create_unit_loading = false
    })
    .addCase(handleEditUnit.pending ,(state , action) => {
      state.edit_unit_loading = true;
    })
    .addCase(handleEditUnit.fulfilled , (state , action) => {
      state.edit_unit_loading = false
    })
    .addCase(handleDeleteUnit.pending ,(state , action) => {
      state.delete_unit_loading = true;
    })
    .addCase(handleDeleteUnit.fulfilled , (state , action) => {
      state.delete_unit_loading = false
    })
  }
})

export default  unitsSlice.reducer;