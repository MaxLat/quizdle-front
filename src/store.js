import { configureStore } from '@reduxjs/toolkit'
import questionsSlice from './component/feature/question/questionsSlice'
import statsSlice from './component/feature/stats/statsSlice'

export default configureStore({
  reducer: {
    questions : questionsSlice,
    stats : statsSlice
  }
})