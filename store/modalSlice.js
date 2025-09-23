// store/modalSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOpen: false,
  post: null, 
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => { state.isOpen = true, state.post = action.payload},
    closeModal: (state, action) => { state.isOpen = false, state.postId = null},
    toggleModal: (state) => { state.isOpen = !state.isOpen },
  },
})

export const { openModal, closeModal, toggleModal } = modalSlice.actions
export default modalSlice.reducer
