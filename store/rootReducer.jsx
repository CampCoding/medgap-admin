import { combineReducers } from "@reduxjs/toolkit";
import LoginReducer from '../features/authSlice';
import ModulesReducer from '../features/modulesSlice';
import TeacherReducer from '../features/teachersSlice';
import ReviewerReducer from '../features/reviewersSlice';
import TopicsReducer from '../features/topicsSlice';
import QuestionReducer from '../features/questionsSlice';
import UnitReducer from '../features/unitsSlice';
import FlashcardReducer from '../features/flashcardsSlice';
import EbookReducer from '../features/ebookSlice';

export const rootReducers = combineReducers({
  login : LoginReducer,
  modules : ModulesReducer,
  teachers: TeacherReducer,
  topics: TopicsReducer,
  questions : QuestionReducer,
  units :UnitReducer,
  flashcards : FlashcardReducer,
  ebooks : EbookReducer,
  reviwers : ReviewerReducer
});