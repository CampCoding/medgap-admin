import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiInstance";
import { userApi } from "../api/userEndPoints";

const initialState = {
  all_flashcards : [],
  flashcard_loading : false,
  flashcard_statics : [],
  flashcards_statistics_loading:  false,
  create_flashcard_loading : false,
  edit_flashcard_loading : false,
  delete_flashcard_loading : false,
  flashcards_list: [],
  flashcards_loading : false,
  create_flash_loading : false,
  edit_flash_loading : false,
  delete_flash_loading : false
}

export const handleGetAllFlashCards = createAsyncThunk("flashcards/handleGetAllFlashCards", async({topic_id}) => {
  const response = await fetchData({url : `${userApi.routes.flashcards}?topic_id=${topic_id}`});
  return response;
})

export const handleGetFlashcardStatistics = createAsyncThunk("flashcards/handleGetFlashcardStatistics" , async() => {
  const response = await fetchData({url : userApi.routes.flashcards+"/stats"})
  return response;
})

export const handleCreateFlashCard = createAsyncThunk("flashcards/handleCreateFlashCard",async({body}) => {
  const response = await fetchData({url : userApi.routes.flashcards  , method :"POST" , body});
  return response
})

export const handleEditFlashCard = createAsyncThunk("flashcards/handleEditFlashCard",async({body , id}) => {
  const response = await fetchData({url : `${userApi.routes.flashcards}/${id}`  , method :"PUT" , body});
  return response
})

export const handleDeleteFlashCard = createAsyncThunk("flashcards/handleDeleteFlashCard", async({id}) => {
  const response= await fetchData({url : `${userApi.routes?.flashcards}/${id}` , method :"DELETE"});
  return response;
})

export const handleGetFlashcards = createAsyncThunk('flashcards/handleGetFlashcards',async({id}) => {
  const response = await fetchData({url : `${userApi.routes?.flashcards}/${id}/cards`});
  return response
})

export const handleCreateCardsOfFlashCards = createAsyncThunk("flashcards/handleCreateCardsOfFlashCards", async({body}) => {
  const response = await fetchData({url : 'flashcards/cards', method:"POST" , body});
  return response;
})

export const handleEditCardsOfFlashCards = createAsyncThunk("flashcards/handleEditCardsOfFlashCards", async({id,body}) => {
  const response = await fetchData({url : `flashcards/cards/${id}`, method:"PUT" , body});
  return response;
})

export const handleDeleteCardsOfFlashCards = createAsyncThunk("flashcards/handleDeleteCardsOfFlashCards", async({id}) => {
  const response = await fetchData({url :`flashcards/cards/${id}`, method:"DELETE" });
  return response;
})

export const flashcards = createSlice({
  name:"flashcards",
  initialState,
  extraReducers : (builder) => {
    builder
    .addCase(handleGetFlashcardStatistics.pending , (state , action) => {
      state.flashcards_statistics_loading = true
    })
    .addCase(handleGetFlashcardStatistics.fulfilled ,(state, action) => {
      state.flashcard_statics = action.payload ;
      state.flashcards_statistics_loading= false
    })
    .addCase(handleCreateFlashCard.pending , (state , action) => {
      state.create_flashcard_loading = true
    })
    .addCase(handleCreateFlashCard.fulfilled ,(state, action) => {
      state.create_flashcard_loading= false
    })
    .addCase(handleEditFlashCard.pending , (state , action) => {
      state.edit_flashcard_loading = true
    })
    .addCase(handleEditFlashCard.fulfilled ,(state, action) => {
      state.edit_flashcard_loading= false
    })
    .addCase(handleDeleteFlashCard.pending , (state , action) => {
      state.delete_flashcard_loading = true
    })
    .addCase(handleDeleteFlashCard.fulfilled ,(state, action) => {
      state.delete_flashcard_loading= false
    })
    .addCase(handleGetAllFlashCards.pending , (state , action) => {
      state.flashcard_loading = true
    })
    .addCase(handleGetAllFlashCards.fulfilled ,(state, action) => {
      state.flashcard_loading= false;
      state.all_flashcards = action.payload;
    })

    .addCase(handleGetFlashcards.pending , (state , action) => {
      state.flashcard_loading = true;
    })
    .addCase(handleGetFlashcards.fulfilled , (state , action) => {
      state.flashcard_loading = false;
      state.flashcards_list = action.payload
    })
    .addCase(handleCreateCardsOfFlashCards.pending ,(state, action) => {
      state.create_flash_loading = true;
    })
    .addCase(handleCreateCardsOfFlashCards.fulfilled ,(state , action) => {
      state.create_flash_loading = false
    })
    .addCase(handleEditCardsOfFlashCards.pending ,(state, action) => {
      state.edit_flash_loading = true;
    })
    .addCase(handleEditCardsOfFlashCards.fulfilled ,(state , action) => {
      state.edit_flash_loading = false
    })
    .addCase(handleDeleteCardsOfFlashCards.pending ,(state, action) => {
      state.delete_flash_loading = true;
    })
    .addCase(handleDeleteCardsOfFlashCards.fulfilled ,(state , action) => {
      state.delete_flash_loading = false
    })
  }
})

export default flashcards.reducer;