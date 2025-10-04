import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apiInstance";
import { userApi } from "../api/userEndPoints";

const initialState = {
  reviewers_list: [],
  all_reviewers_loading: false,
  create_reviewer_loading: false,
  edit_reviewer_loading: false,
  reviewer_details: {},
  error: null,
  all_reviewer_statistics: [],
  reviewer_status_loading: false,
  delete_reviewer_loading: false,
  reviewer_modules: [],
  reviewer_modules_loading: false,
  delete_reviewer_module_loading: false,
};

export const handleGetAllReviewers = createAsyncThunk(
  "reviewersSlice/handleGetAllReviewers",
  async (filters = {}) => {
    const { status = "", search = "", limit = 10, offset = 0 } = filters;
    
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);
    
    const response = await fetchData({
      url: `${userApi.routes?.teachers}?role=reviewer`,
      method: "GET",
    });
    return response;
  }
);

export const handleGetReviewerDetails = createAsyncThunk(
  "reviewersSlice/handleGetReviewerDetails",
  async ({ id }) => {
    const response = await fetchData({
      url: `${userApi.routes.teachers}/${id}`,
      method: "GET"
    });
    return response;
  }
);

export const handleCreateReviewer = createAsyncThunk(
  "reviewersSlice/handleCreateReviewer",
  async (body) => {
    const response = await fetchData({
      url: userApi.routes?.teachers,
      body,
      isFile: true,
      method: "POST",
    });
    return response;
  }
);

export const handleEditReviewer = createAsyncThunk(
  "reviewersSlice/handleEditReviewer",
  async ({ id, body }) => {

    
    const response = await fetchData({
      url: `${userApi.routes?.teachers}/${id}`,
      method: "PUT",
      isFile: true,
      body
    });
    return response;
  }
);

export const handleChangeReviewerStatus = createAsyncThunk(
  "reviewersSlice/handleChangeReviewerStatus",
  async ({ id, body }) => {
    const response = await fetchData({
      url: `${userApi.routes.teachers}/${id}/status`,
      method: "PATCH",
      body
    });
    return response;
  }
);

export const handleGetReviewerStatistics = createAsyncThunk(
  "reviewersSlice/handleGetReviewerStatistics",
  async () => {
    const response = await fetchData({
      url: userApi.routes?.teachers_statistics,
      method: "GET"
    });
    return response;
  }
);

export const handleDeleteReviewer = createAsyncThunk(
  "reviewersSlice/handleDeleteReviewer",
  async ({ id }) => {
    const response = await fetchData({
      url: `${userApi.routes.teachers}/${id}/permanent`,
      method: "DELETE"
    });
    return response;
  }
);

export const handleGetReviewerModules = createAsyncThunk(
  "reviewersSlice/handleGetReviewerModules",
  async ({ id }) => {
    const response = await fetchData({
      url: `${userApi.routes?.teachers}/${id}/modules`
    });
    return response;
  }
);

export const handleDeleteReviewerModules = createAsyncThunk(
  "reviewersSlice/handleDeleteReviewerModules",
  async ({ id, moduleId }) => {
    const response = await fetchData({
      url: `${userApi.routes?.teachers}/${id}/modules/${moduleId}`,
      method: "DELETE"
    });
    return response;
  }
);

export const reviewersSlice = createSlice({
  name: "reviewersSlice",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateReviewerStatus: (state, action) => {
      const { reviewerId, status } = action.payload;
      const reviewer = state.reviewers_list.data?.teachers?.find(t => t.teacher_id === reviewerId);
      if (reviewer) {
        reviewer.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All Reviewers
      .addCase(handleGetAllReviewers.pending, (state) => {
        state.all_reviewers_loading = true;
        state.error = null;
      })
      .addCase(handleGetAllReviewers.fulfilled, (state, action) => {
        state.all_reviewers_loading = false;
        state.reviewers_list = action.payload;
      })
      .addCase(handleGetAllReviewers.rejected, (state, action) => {
        state.all_reviewers_loading = false;
        state.error = action.error.message;
      })
      
      // Get Reviewer Details
      .addCase(handleGetReviewerDetails.fulfilled, (state, action) => {
        state.reviewer_details = action.payload;
      })
      
      // Get Reviewer Statistics
      .addCase(handleGetReviewerStatistics.fulfilled, (state, action) => {
        state.all_reviewer_statistics = action.payload;
      })
      
      // Create Reviewer
      .addCase(handleCreateReviewer.pending, (state) => {
        state.create_reviewer_loading = true;
        state.error = null;
      })
      .addCase(handleCreateReviewer.fulfilled, (state, action) => {
        state.create_reviewer_loading = false;
      })
      .addCase(handleCreateReviewer.rejected, (state, action) => {
        state.create_reviewer_loading = false;
        state.error = action.error.message;
      })
      
      // Edit Reviewer
      .addCase(handleEditReviewer.pending, (state) => {
        state.edit_reviewer_loading = true;
        state.error = null;
      })
      .addCase(handleEditReviewer.fulfilled, (state, action) => {
        state.edit_reviewer_loading = false;
      })
      .addCase(handleEditReviewer.rejected, (state, action) => {
        state.edit_reviewer_loading = false;
        state.error = action.error.message;
      })
      
      // Change Reviewer Status
      .addCase(handleChangeReviewerStatus.pending, (state) => {
        state.reviewer_status_loading = true;
        state.error = null;
      })
      .addCase(handleChangeReviewerStatus.fulfilled, (state, action) => {
        state.reviewer_status_loading = false;
      })
      .addCase(handleChangeReviewerStatus.rejected, (state, action) => {
        state.reviewer_status_loading = false;
        state.error = action.error.message;
      })
      
      // Delete Reviewer
      .addCase(handleDeleteReviewer.pending, (state) => {
        state.delete_reviewer_loading = true;
      })
      .addCase(handleDeleteReviewer.fulfilled, (state, action) => {
        state.delete_reviewer_loading = false;
      })
      .addCase(handleDeleteReviewer.rejected, (state, action) => {
        state.delete_reviewer_loading = false;
        state.error = action.error.message;
      })
      
      // Get Reviewer Modules
      .addCase(handleGetReviewerModules.pending, (state) => {
        state.reviewer_modules_loading = true;
      })
      .addCase(handleGetReviewerModules.fulfilled, (state, action) => {
        state.reviewer_modules_loading = false;
        state.reviewer_modules = action.payload;
      })
      .addCase(handleGetReviewerModules.rejected, (state, action) => {
        state.reviewer_modules_loading = false;
        state.error = action.error.message;
      })
      
      // Delete Reviewer Module
      .addCase(handleDeleteReviewerModules.pending, (state) => {
        state.delete_reviewer_module_loading = true;
      })
      .addCase(handleDeleteReviewerModules.fulfilled, (state, action) => {
        state.delete_reviewer_module_loading = false;
      })
      .addCase(handleDeleteReviewerModules.rejected, (state, action) => {
        state.delete_reviewer_module_loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, updateReviewerStatus } = reviewersSlice.actions;
export default reviewersSlice.reducer;