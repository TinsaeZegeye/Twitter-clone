// store/modalSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOpen: false,
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state) => { state.isOpen = true },
    closeModal: (state) => { state.isOpen = false },
    toggleModal: (state) => { state.isOpen = !state.isOpen },
  },
})

export const { openModal, closeModal, toggleModal } = modalSlice.actions
export default modalSlice.reducer
