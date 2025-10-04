import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiInstance";
import { userApi } from "../api/userEndPoints";

const initialState = {
   list_module_loading : false,
   list_module_data : [],
   list_module_error:  null,
   modules_statistic : [],
   module_statistics_loading : false,
   module_statistics_error:null,
   create_module_loading:false,
   update_module_loading:false,
   permanent_module_loading:false,
   soft_module_loading:false,
   module_units:[],
   module_unit_loading : false,
   list_module_available : [] ,
   list_module_available_loading : false,
   list_module_teachers:[],
   list_module_teacher_loading : false,
    list_module_students:[],
   list_module_student_loading : false,
}

export const handleGetListModulesAvailable = createAsyncThunk("moduleSlice/handleGetListModules",async() =>{
  const response = await fetchData({url : userApi.routes?.list_modules , method : "GET"});
  return response;
})

export const handleGetAllModules = createAsyncThunk("moduleSlice/handleGetAllModules",async() =>{
  const response = await fetchData({url : userApi.routes?.all_modules_statistics , method : "GET"});
  return response;
})

export const handleGetAllModulesStatistics = createAsyncThunk("moduleSlice/handleGetAllModulesStatistics",async() =>{
  const response = await fetchData({url : userApi.routes?.modules_statistics , method : "GET"});
  return response;
})

export const handleCreateModule = createAsyncThunk("moduleSlice/handleCreateModule", async({body}) => {
  const response = await fetchData({url : userApi.routes?.create_module , body , method : "POST"});
  return response;
})

export const handleUpdateModule = createAsyncThunk("moduleSlice/handleUpdateModule", async({body , id}) => {
  const response = await fetchData({url : `${userApi.routes?.update_module}/${id}` , body , method : "PUT"});
  return response;
})

export const handlePermanentDeletModule = createAsyncThunk("moduleSlice/handlePermanentDeletModule", async({id}) => {
  const response = await fetchData({url : `${userApi.routes?.permanent_delete_module}/${id}/permanent`  , method : "DELETE"});
  return response;
})

export const handleSofttDeletModule = createAsyncThunk("moduleSlice/handleSofttDeletModule", async({id}) => {
  const response = await fetchData({url : `${userApi.routes?.soft_delete_module}/${id}`  , method : "DELETE"});
  return response;
})

export const handleGetModuleUnits = createAsyncThunk("moduleSlice/handleGetModuleUnits", async({id}) => {
  const response = await fetchData({url : `${userApi.routes?.module_units}/${id}/units`  , method : "GET"});
  return response;
})

export const handleGetModuleTeachers = createAsyncThunk("moduleSlice/handleGetModuleTeachers", async({id}) => {
  const response = await fetchData({url : `${userApi.routes?.module_units}/${id}/teachers`  , method : "GET"});
  return response;
})

export const handleGetModuleStudents = createAsyncThunk("moduleSlice/handleGetModuleStudents", async({id}) => {
  const response = await fetchData({url : `${userApi.routes?.module_units}/${id}/students`  , method : "GET"});
  return response;
})

export const moduleSlice = createSlice({
  name:"moduleSlice",
  initialState,
  extraReducers :  (builder) =>  {
    builder
    .addCase(handleGetAllModules.pending , (state , action) => {
      state.list_module_loading = true,
      state.list_module_error = null
    })
    .addCase(handleGetAllModules.fulfilled , (state, action) => {
      state.list_module_data = action?.payload,
      state.list_module_loading = false
    })
    .addCase(handleGetAllModules.rejected , (state,action) => {
      state.list_module_loading = false,
      state.list_module_error = action.payload
    })
    .addCase(handleGetAllModulesStatistics.pending , (state , action) => {
      state.module_statistics_loading = true,
      state.module_statistics_error = null
    })
    .addCase(handleGetAllModulesStatistics.fulfilled , (state, action) => {
      state.modules_statistic = action?.payload,
      state.module_statistics_loading = false
    })
    .addCase(handleGetAllModulesStatistics.rejected , (state,action) => {
      state.module_statistics_loading = false,
      state.module_statistics_error = action.payload
    })
    .addCase(handleCreateModule.pending , (state , action) => {
      state.create_module_loading = true
    })
    .addCase(handleCreateModule.fulfilled , (state, action) => {
      state.create_module_loading = false
    })
    .addCase(handleCreateModule.rejected , (state,action) => {
      state.create_module_loading = false
    })
     .addCase(handleUpdateModule.pending , (state , action) => {
      state.update_module_loading = true
    })
    .addCase(handleUpdateModule.fulfilled , (state, action) => {
      state.update_module_loading = false
    })
    .addCase(handleUpdateModule.rejected , (state,action) => {
      state.update_module_loading = false
    })
     .addCase(handlePermanentDeletModule.pending , (state , action) => {
      state.permanent_module_loading = true
    })
    .addCase(handlePermanentDeletModule.fulfilled , (state, action) => {
      state.permanent_module_loading = false
    })
    .addCase(handlePermanentDeletModule.rejected , (state,action) => {
      state.permanent_module_loading = false
    })
     .addCase(handleSofttDeletModule.pending , (state , action) => {
      state.soft_module_loading = true
    })
    .addCase(handleSofttDeletModule.fulfilled , (state, action) => {
      state.soft_module_loading = false
    })
    .addCase(handleSofttDeletModule.rejected , (state,action) => {
      state.soft_module_loading = false
    })
    .addCase(handleGetModuleUnits.pending , (state , action) => {
      state.module_unit_loading = true
    })
    .addCase(handleGetModuleUnits.fulfilled , (state, action) => {
      state.module_unit_loading = false,
      state.module_units = action.payload
    })
    .addCase(handleGetModuleUnits.rejected , (state,action) => {
      state.module_unit_loading = false
    })
    .addCase(handleGetListModulesAvailable.pending , (state , action) => {
      state.list_module_available_loading = true
    })
    .addCase(handleGetListModulesAvailable.fulfilled , (state, action) => {
      state.list_module_available_loading = false,
      state.list_module_available = action.payload
    })
    .addCase(handleGetListModulesAvailable.rejected , (state,action) => {
      state.list_module_available_loading = false
    })
    .addCase(handleGetModuleTeachers.pending , (state , action) => {
      state.list_module_teacher_loading = true
    })
    .addCase(handleGetModuleTeachers.fulfilled , (state, action) => {
      state.list_module_teacher_loading = false,
      state.list_module_teachers = action.payload
    })
    .addCase(handleGetModuleTeachers.rejected , (state,action) => {
      state.list_module_teacher_loading = false
    })
    .addCase(handleGetModuleStudents.pending , (state , action) => {
      state.list_module_student_loading = true
    })
    .addCase(handleGetModuleStudents.fulfilled , (state, action) => {
      state.list_module_student_loading = false,
      state.list_module_students = action.payload
    })
    .addCase(handleGetModuleStudents.rejected , (state,action) => {
      state.list_module_student_loading = false
    })
  }
})

export default moduleSlice.reducer