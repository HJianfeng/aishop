import { configureStore } from '@reduxjs/toolkit'
import toolReducer from './toolSlice'
export default configureStore({
  reducer: {
    tool: toolReducer
  }
})