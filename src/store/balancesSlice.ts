import { createSelector } from '@reduxjs/toolkit'

import type { Insc20Balance } from '~/services/indexer-api/types'
import { makeLoadableSlice } from './common'

export const initialBalancesState: { insc20s: Insc20Balance[] } = {
  insc20s: [],
}

const { slice, selector } = makeLoadableSlice('balances', initialBalancesState)

export const balancesSlice = slice
export const selectAllBalances = selector

export const selectInsc20Balances = createSelector(
  selectAllBalances,
  (balancesState): Insc20Balance[] => balancesState.data.insc20s,
)
