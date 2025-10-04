import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiInstance";
import { userApi } from "../api/userEndPoints";

const initialState = {
  topics_list: [],
  topics_loading: false,
  create_topic_loading : false,
  edit_topic_loading : false,
  topic_details:[],
  topic_details_loading : false,
  delete_topic_loading : false,
  duplicate_topic_loading : false,
  topic_flashcard_list : [],
  topic_flashcard_loading : false,
  topic_questions_list : [],
  topic_questions_loading:false,
  topic_library_list: [],
  topic_library_loading : false,
};

export const handleGetAllTopics = createAsyncThunk(
  "topicsSlice/handleGetAllTopics",
  async ({ unit_id, search, status }) => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (search) params.append("search", search);
    if (unit_id) params.append("unit_id", unit_id);
    const response = await fetchData({
      url: `${userApi.routes?.topics}?${params.toString()}`,
      method: "GET",
    });
    return response;
  }
);

export const handleCreateTopic = createAsyncThunk("topicsSlice/handleCreateTopic", async({body}) =>{
  const response = await fetchData({url : userApi.routes.topics , body , method :"POST"});
  return response;
})

export const handleEditTopic = createAsyncThunk("topicsSlice/handleEditTopic", async({body , id}) =>{
  const response = await fetchData({url : `${userApi.routes.topics}/${id}` , body , method :"PUT"});
  return response;
})

export const handleTopicDetails = createAsyncThunk("topicsSlice/handleTopicDetails",async({id}) => {
  const response = await fetchData({url : `${userApi.routes?.topics}/${id}` , method :"GET"});
  return response
})

export const handleDeleteTopic = createAsyncThunk("topicsSlice/handleDeleteTopic",async({id}) => {
  const response = await fetchData({url : `${userApi.routes?.topics}/${id}` , method :"DELETE"});
  return response;
})

export const handleDuplicateTopic = createAsyncThunk("topicsSlice/handleDuplicateTopic",async({id , body}) => {
  const response = await fetchData({url : `${userApi.routes?.topics}/${id}/duplicate`, body , method :"POST"});
  return response;
})

export const handleFlashcardTopics = createAsyncThunk("topicsSlice/handleFlashcardTopics", async({id}) => {
  const response = await fetchData({url : `${userApi.routes?.topics}/${id}/flashcards`, method :"GET"});
  return response;
})

export const handleQuestionsTopics = createAsyncThunk("topicsSlice/handleQuestionsTopics", async({id}) => {
  const response = await fetchData({url : `${userApi.routes?.topics}/${id}/questions`, method :"GET"});
  return response;
})


export const handleLibraryTopics = createAsyncThunk("topicsSlice/handleLibraryTopics", async({id}) => {
  const response = await fetchData({url : `${userApi.routes?.topics}/${id}/library`, method :"GET"});
  return response;
})



export const topicsSlice = createSlice({
  name: "topicsSlice",
  initialState,
  extraReducers : (builder) => {
    builder
    .addCase(handleGetAllTopics.pending , (state , action) =>{
      state.topics_loading = true;
    })
    .addCase(handleGetAllTopics.fulfilled ,(state,action) => {
      state.topics_list=action.payload;
      state.topics_loading = false;
    })
     builder
    .addCase(handleCreateTopic.pending , (state , action) =>{
      state.create_topic_loading = true;
    })
    .addCase(handleCreateTopic.fulfilled ,(state,action) => {
      state.create_topic_loading = false;
    })
     .addCase(handleEditTopic.pending , (state , action) =>{
      state.edit_topic_loading = true;
    })
    .addCase(handleEditTopic.fulfilled ,(state,action) => {
      state.edit_topic_loading = false;
    })
     .addCase(handleTopicDetails.pending , (state , action) =>{
      state.topic_details_loading = true;
    })
    .addCase(handleTopicDetails.fulfilled ,(state,action) => {
      state.topic_details_loading = false;
      state.topic_details = action.payload
    })
     .addCase(handleDeleteTopic.pending , (state , action) =>{
      state.delete_topic_loading = true;
    })
    .addCase(handleDeleteTopic.fulfilled ,(state,action) => {
      state.delete_topic_loading = false;
    })
     .addCase(handleDuplicateTopic.pending , (state , action) =>{
      state.duplicate_topic_loading = true;
    })
    .addCase(handleDuplicateTopic.fulfilled ,(state,action) => {
      state.duplicate_topic_loading = false;
    })
      .addCase(handleFlashcardTopics.pending , (state , action) =>{
      state.topic_flashcard_loading = true;
    })
    .addCase(handleFlashcardTopics.fulfilled ,(state,action) => {
      state.topic_flashcard_loading = false;
      state.topic_flashcard_list = action.payload
    })
    .addCase(handleLibraryTopics.pending , (state , action) =>{
      state.topic_library_loading = true;
    })
    .addCase(handleLibraryTopics.fulfilled ,(state,action) => {
      state.topic_library_loading = false;
      state.topic_library_list = action.payload
    })
    .addCase(handleQuestionsTopics.pending , (state , action) =>{
      state.topic_questions_loading = true;
    })
    .addCase(handleQuestionsTopics.fulfilled ,(state,action) => {
      state.topic_questions_loading = false;
      state.topic_questions_list = action.payload
    })
  }
});

export default topicsSlice.reducer;