import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiInstance";
import { userApi } from "../api/userEndPoints";

const initialState = {
  all_questions : [],
  questions_loading : false,
  create_question_loading : false,
  edit_question_loading : false,
  delete_question_loading : false,
  duplicate_question_loading:  false,
  question_statistics_list : [],
  question_statistics_loading :false,
  question_details_loading : false,
  question_details_list:[],
  question_status_loading : false,
  search_question_data : [],
  search_question_loading: false,
}

export const handleGetAllQuestions = createAsyncThunk("questionsSlice/handleGetAllQuestions",async({topic_id}) => {
  const response = await fetchData({url : `${userApi.routes?.questions}?topic_id=${topic_id}`});
  return response
})

export const handleSearchQuestion = createAsyncThunk("questionsSlice/handleSearchQuestion" , async({question_type , q ,difficulty_level}) => {
  const params = new URLSearchParams();
  if(question_type) params.append("question_type",question_type);
  if(difficulty_level)  params.append("difficulty_level", difficulty_level);
  if(q) params.append("q", q)
  const response = await fetchData({url :  `${userApi.routes.questions}?${params?.toString()}`});
return response;
})

export const handleUpdateQuestionStatus = createAsyncThunk("questionsSlice/handleUpdateQuestionStatus",async(id , body) => {
  const response = await fetchData({url : `${userApi.routes.questions}/${id}/approval` ,body, method:"PATCH"});
  return response;
})

export const handleGetQuestionStatistics = createAsyncThunk("questionsSlice/handleGetQuestionStatistics",async() => {
  const response = await fetchData({url : `${userApi.routes?.questions}/stats`});
  return response
})

export const handleGetQuestionDetails = createAsyncThunk("questionsSlice/handleGetQuestionDetails",async(id) => {
  const response = await fetchData({url : `${userApi.routes?.questions}/${id}`});
  return response
})

export const handleCreateQuestion =  createAsyncThunk("questionsSlice/handleCreateQuestion" , async(body) =>{
  const response = await fetchData({url : userApi.routes?.questions ,body, method:"POST"});
  return response;
})

export const handleEditQuestion =  createAsyncThunk("questionsSlice/handleEditQuestion" , async({id , body}) =>{
  console.log(body , id);
  const response = await fetchData({url : `${userApi.routes?.questions}/${id}`, body , method:"PUT"});
  return response;
})


export const handleDeleteQuestion =  createAsyncThunk("questionsSlice/handleDeleteQuestion" , async(id) =>{
  const response = await fetchData({url : `${userApi.routes?.questions}/${id}` , method:"DELETE"});
  return response;
})


export const handleDuplicateQuestion =  createAsyncThunk("questionsSlice/handleDuplicateQuestion" , async(id) =>{
  const response = await fetchData({url : `${userApi.routes?.questions}/${id}/duplicate` , method:"POST"});
  return response;
})


export const questionsSlice = createSlice({
  name:'questionsSlice',
  initialState,
  extraReducers : (builder) => {
    builder
    .addCase(handleGetAllQuestions.pending ,(state , action) => {
      state.questions_loading = true;
    })
    .addCase(handleGetAllQuestions.fulfilled , (state , action) => {
      state.questions_loading = false;
      state.all_questions = action.payload
    })
    .addCase(handleCreateQuestion.pending ,(state , action) => {
      state.create_question_loading = true;
    })
    .addCase(handleCreateQuestion.fulfilled , (state , action) => {
      state.create_question_loading = false;
    })
    .addCase(handleEditQuestion.pending ,(state , action) => {
      state.edit_question_loading = true;
    })
    .addCase(handleEditQuestion.fulfilled , (state , action) => {
      state.edit_question_loading = false;
    })
     .addCase(handleDeleteQuestion.pending ,(state , action) => {
      state.delete_question_loading = true;
    })
    .addCase(handleDeleteQuestion.fulfilled , (state , action) => {
      state.delete_question_loading = false;
    })
     .addCase(handleDuplicateQuestion.pending ,(state , action) => {
      state.duplicate_question_loading = true;
    })
    .addCase(handleDuplicateQuestion.fulfilled , (state , action) => {
      state.duplicate_question_loading = false;
    })
     .addCase(handleGetQuestionStatistics.pending ,(state , action) => {
      state.question_statistics_loading = true;
    })
    .addCase(handleGetQuestionStatistics.fulfilled , (state , action) => {
      state.question_statistics_loading = false;
      state.question_statistics_list = action.payload
    })
     .addCase(handleGetQuestionDetails.pending ,(state , action) => {
      state.question_details_loading = true;
    })
    .addCase(handleGetQuestionDetails.fulfilled , (state , action) => {
      state.question_details_loading = false;
      state.question_details_list = action.payload
    })
    .addCase(handleUpdateQuestionStatus.pending ,(state , action) => {
      state.question_status_loading = true;
    })
    .addCase(handleUpdateQuestionStatus.fulfilled , (state , action) => {
      state.question_status_loading = false;
    })
     .addCase(handleSearchQuestion.pending ,(state , action) => {
      state.search_question_loading = true;
    })
    .addCase(handleSearchQuestion.fulfilled , (state , action) => {
      state.search_question_loading = false;
      state.search_question_data = action.payload;
    })
  }
})

export default questionsSlice.reducer