import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { SignStatus } from '~/hooks/wallets/useVerifySignature'
import type { RootState } from '.'

interface AuthSignatureState {
  signStatus: SignStatus
}

export const initialBalancesState: AuthSignatureState = {
  signStatus: SignStatus.IDLE,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialBalancesState,
  reducers: {
    setAuthStatus: (state, action: PayloadAction<SignStatus>) => {
      state.signStatus = action.payload
    },
  },
})

export const { setAuthStatus } = authSlice.actions

export const selectAuthStatus = (state: RootState): AuthSignatureState => {
  return state[authSlice.name]
}
