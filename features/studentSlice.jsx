import { fetchData } from "@/api/apiInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState ={
    create_studnet_loading : false,
}

export const handleCreateStudent = createAsyncThunk("studentSlice/handleCreateStudent", async({body}) => {
    const response = await fetchData({url :"users/create" , body , method :"POST" });
    return response;
})

export const studentSlice = createSlice({
    name:"studentSlice",
    initialState,
    extraReducers:(builder) => {
        builder
        .addCase(handleCreateStudent.pending , (state,action) => {
            state.create_studnet_loading = true
        })
        .addCase(handleCreateStudent.fulfilled , (state,action) => {
            state.create_studnet_loading = false
        })
    }
})

export default studentSlice.reducer;