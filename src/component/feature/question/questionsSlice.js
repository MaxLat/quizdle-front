import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  questions: null,
  status: 'idle',
  error: null,
}

export const fetchQuestions = createAsyncThunk('quiz/fetchQuestions', async () => {
  const response = await axios.get(`${process.env.REACT_APP_API}/api/quiz`)
  return response.data
})



const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers : {
    questionsFromStorage(state, action) {
        state.questions = action.payload;
        state.status = 'succeeded';
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchQuestions.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.questions = action.payload
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { questionsFromStorage } = questionsSlice.actions

export default questionsSlice.reducer

