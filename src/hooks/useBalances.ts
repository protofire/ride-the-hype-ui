import { useMemo } from 'react'
import isEqual from 'lodash/isEqual'
import { useAppSelector } from '~/store'
import { initialBalancesState, selectAllBalances } from '~/store/balancesSlice'
import type { Insc20Balance } from '~/services/indexer-api/modules/indexer-tokens/types'

const useBalances = (): {
  balances: { insc20s: Insc20Balance[] }
  loading: boolean
  error?: string
} => {
  const state = useAppSelector(selectAllBalances, isEqual)
  const { data, error, loading } = state

  return useMemo(
    () => ({
      balances: data,
      error,
      loading: loading || initialBalancesState === data,
    }),
    [data, error, loading],
  )
}

export default useBalances
