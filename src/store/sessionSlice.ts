import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '.'

type SessionState = {
  lastChainId: string
}

const initialState: SessionState = {
  lastChainId: '',
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setLastChainId: (state, action: PayloadAction<SessionState['lastChainId']>) => {
      state.lastChainId = action.payload
    },
  },
})

export const { setLastChainId } = sessionSlice.actions

export const selectSession = (state: RootState): SessionState => {
  return state[sessionSlice.name]
}
