// store/store.js
import { configureStore } from '@reduxjs/toolkit'
import modalReducer from './modalSlice'
import authReducer from "./authSlice"

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    auth: authReducer,
  },
})