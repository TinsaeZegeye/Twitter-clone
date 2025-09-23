'use client'

import { useDispatch, useSelector } from 'react-redux'

export default function CommentModal() {
    const isOpen = useSelector((state) => state.modal.isOpen)
    const dispatch = useDispatch();
  return (
    <div>
          <h1>Comment modal</h1>
          {isOpen && (
              <h2>Modal is open</h2>
          )}
    </div>
  )
}
