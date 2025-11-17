import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiInstance";
import { userApi } from "../api/userEndPoints";

const initialState = {
  teachers_list: [],
  all_teachers_loading: false,
  create_teacher_loading: false,
  edit_teacher_loading: false,
  teacher_details:{},
  error: null,
  all_teacher_statistics: [],
  teahcer_status_loading : false,
  delete_teacher_loading : false,
  teacher_modules: [],
  teacher_modules_loading : false,
  delete_teacher_module_loading : false,
};

export const handleGetAllTeachers = createAsyncThunk(
  "teachersSlice/handleGetAllTeachers",
  async (filters = {}) => {
    const { status = "", search = "", limit = 10, offset = 0 } = filters;
    
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);
    
    const response = await fetchData({
      url: `${userApi.routes?.teachers}?${params.toString()}`,
      method: "GET",
    });
    return response;
  }
);

export const handleGetTeacherDetails = createAsyncThunk("teachersSlice/handleGetTeacherDetails",async({id}) => {
  const response = await fetchData({url : `${userApi.routes.teachers}/${id}` , method :"GET" });
  return response;
})

export const handleCreateTeacher = createAsyncThunk(
  "teachersSlice/handleCreateTeacher",
  async (body) => { // Remove the nested {body} structure
    const response = await fetchData({
      url: userApi.routes?.teachers,
      body,
      isFile : true,
      method: "POST",
    });
    return response;
  }
);

export const handleEditTeacher = createAsyncThunk(
  "teachersSlice/handleEditTeacher",
  async ({id  ,body}) => { // Remove the nested {body} structure
    const response = await fetchData({
      url: `${userApi.routes?.teachers}/${id}`,
      method: "PUT",
      isFile : true,
      body
    });
    return response;
  }
);

export const handleChangeTeacherStatus = createAsyncThunk("teachersSlice/handleChangeTeacherStatus", async({id , body}) =>{
  const response = await fetchData({url : `${userApi.routes.teachers}/${id}/status` , method :"PATCH" , body });
  return response;
})


export const handleGetTeacherStatistics = createAsyncThunk("teachersSlice/handleGetTeacherStatistics", async() =>{
  const response = await fetchData({url: userApi.routes?.teachers_statistics , method :"GET"});
  return response;
})

export const handleDeleteTeacher = createAsyncThunk("teachersSlice/handleDeleteTeacher",async({id}) =>{
  const response = await fetchData({url : `${userApi.routes.teachers}/${id}/permanent` , method:"DELETE"});
  return response;
})

export const handleGetTeacherModules = createAsyncThunk("teachersSlice/handleGetTeacherModules",async({id}) => {
  const response =  await fetchData({url : `${userApi.routes?.teachers}/${id}/modules`});
  return response;
})

export const handleDeleteTeacherModules = createAsyncThunk("teachersSlice/handleDeleteTeacherModules",async({id , moduleId}) => {
  const response =  await fetchData({url : `${userApi.routes?.teachers}/${id}/modules/${moduleId}` , method:"DELETE"});
  return response;
})


export const teachersSlice = createSlice({
  name: "teachersSlice",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateTeacherStatus: (state, action) => {
      const { teacherId, status } = action.payload;
      const teacher = state.teachers_list.data?.teachers?.find(t => t.teacher_id === teacherId);
      if (teacher) {
        teacher.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All Teachers
      .addCase(handleGetAllTeachers.pending, (state) => {
        state.all_teachers_loading = true;
        state.error = null;
      })
      .addCase(handleGetAllTeachers.fulfilled, (state, action) => {
        state.all_teachers_loading = false;
        state.teachers_list = action.payload;
      })
      .addCase(handleGetAllTeachers.rejected, (state, action) => {
        state.all_teachers_loading = false;
        state.error = action.error.message;
      })
      .addCase(handleGetTeacherStatistics.fulfilled, (state, action) => {
        state.all_teacher_statistics = action.payload;
      })
      // Create Teacher
      .addCase(handleCreateTeacher.pending, (state) => {
        state.create_teacher_loading = true;
        state.error = null;
      })
      .addCase(handleCreateTeacher.fulfilled, (state, action) => {
        state.create_teacher_loading = false;
      })
      .addCase(handleEditTeacher.pending, (state) => {
        state.edit_teacher_loading = true;
        state.error = null;
      })
      .addCase(handleEditTeacher.fulfilled, (state, action) => {
        state.edit_teacher_loading = false;
      })
      .addCase(handleCreateTeacher.rejected, (state, action) => {
        state.create_teacher_loading = false;
        state.error = action.error.message;
      })
      .addCase(handleChangeTeacherStatus.pending, (state) => {
        state.teahcer_status_loading = true;
        state.error = null;
      })
      .addCase(handleChangeTeacherStatus.fulfilled, (state, action) => {
        state.teahcer_status_loading = false;
      })
      .addCase(handleDeleteTeacher.pending, (state) => {
        state.delete_teacher_loading = true;
      })
      .addCase(handleDeleteTeacher.fulfilled, (state, action) => {
        state.delete_teacher_loading = false;
      })
       .addCase(handleGetTeacherModules.pending, (state) => {
        state.teacher_modules_loading = true;
      })
      .addCase(handleGetTeacherModules.fulfilled, (state, action) => {
        state.teacher_modules_loading = false;
        state.teacher_modules = action.payload
      })
      .addCase(handleDeleteTeacherModules.pending, (state) => {
        state.delete_teacher_module_loading = true;
      })
      .addCase(handleDeleteTeacherModules.fulfilled, (state, action) => {
        state.delete_teacher_module_loading = false;
      })
  },
});

export const { clearError, updateTeacherStatus } = teachersSlice.actions;
export default teachersSlice.reducer;