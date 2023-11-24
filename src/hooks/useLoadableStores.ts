import { useEffect } from 'react'
import { type Slice } from '@reduxjs/toolkit'
import { useAppDispatch } from '~/store'
import { type AsyncResult } from './useAsync'

// Import all the loadable hooks
import useLoadChains from './loadables/useLoadChains'

// Import all the loadable slices
import { chainsSlice } from '~/store/chainsSlice'

// Dispatch into the corresponding store when the loadable is loaded
const useUpdateStore = (slice: Slice, useLoadHook: () => AsyncResult<unknown>): void => {
  const dispatch = useAppDispatch()
  const [data, error, loading] = useLoadHook()
  const setAction = slice.actions.set

  useEffect(() => {
    dispatch(
      setAction({
        data,
        error: data ? undefined : error?.message,
        loading: loading && !data,
      }),
    )
  }, [dispatch, setAction, data, error, loading])
}

const useLoadableStores = () => {
  useUpdateStore(chainsSlice, useLoadChains)
}

export default useLoadableStores
