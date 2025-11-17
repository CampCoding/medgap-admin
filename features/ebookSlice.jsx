import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiInstance";

const initialState = {
  ebook_list : [],
  ebook_loading : false,
  create_ebook_loading : false,
  edit_ebook_loading : false,
  delete_ebook_loading : false,
}

export const handleCreateEbook= createAsyncThunk("ebookSlice/handleCreateEbook",async({body}) =>{
 const response = await fetchData({url :"e-books/create",body ,isFile:true,method:"POST"});
 return response;
})

export const handleGetAllEbooks = createAsyncThunk("ebookSlice/handleGetAllEbooks", async({subject_id}) =>{
  const response = await fetchData({url : `e-books/list?subject_id=${subject_id}` , method :"GET"});
  return response;
})


export const handleEditEBook = createAsyncThunk("ebookSlice/handleEditEBook" , async({id , body}) => {
  const response = await fetchData({url : `e-books/update/${id}` , method :"PUT" , isFile : true , body});
  return response;
})

export const handleDeleteEbook = createAsyncThunk("ebookSlice/handleDeleteEbook" , async({id}) => {
  const response = await fetchData({url :`e-books/delete/${id}`,method:"DELETE"});
  return response;
})

export const ebookSlice = createSlice({
  name:"ebookSlice",
  initialState,
  extraReducers:(builder) => {
    builder
    .addCase(handleGetAllEbooks.pending ,(state, action) => {
      state.ebook_loading = true;
    })
    .addCase(handleGetAllEbooks.fulfilled , (state , action) => {
      state.ebook_loading = false;
      state.ebook_list = action.payload;
    })
    .addCase(handleCreateEbook.pending , (state, action) => {
      state.create_ebook_loading = true;
    })
    .addCase(handleCreateEbook.fulfilled ,(state,action) => {
      state.create_ebook_loading = false
    })
     .addCase(handleEditEBook.pending , (state, action) => {
      state.edit_ebook_loading = true;
    })
    .addCase(handleEditEBook.fulfilled ,(state,action) => {
      state.edit_ebook_loading = false
    })
     .addCase(handleDeleteEbook.pending , (state, action) => {
      state.delete_ebook_loading = true;
    })
    .addCase(handleDeleteEbook.fulfilled ,(state,action) => {
      state.delete_ebook_loading = false
    })
  }
})

export default ebookSlice.reducer;