import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  average : undefined,
  nbPlayers : undefined,
  status: 'idle',
  error: null,
}

export const fetchStats = createAsyncThunk('quiz/fetchStats', async () => {
  const response = await axios.get('http://localhost:4000/api/stats')
  return response.data
});

export const postStats = createAsyncThunk('quiz/postStats', async ({rank}) => {
    const response = await axios.post('http://localhost:4000/api/stats',{rank : rank})
    return response.data
  })



const statsSlice = createSlice({
  name: 'stats',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchStats.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.average = action.payload.average;
        state.nbPlayers = action.payload.nbPlayers;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(postStats.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(postStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.average = action.payload.average;
        state.nbPlayers = action.payload.nbPlayers;

      })
      .addCase(postStats.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default statsSlice.reducer