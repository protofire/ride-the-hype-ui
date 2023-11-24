import { useAppDispatch } from '~/store'
import { setLastChainId } from '~/store/sessionSlice'
import { useEffect } from 'react'
import { useUrlChainId } from './useChainId'

export const useInitSession = (): void => {
  const dispatch = useAppDispatch()
  const chainId = useUrlChainId()

  useEffect(() => {
    if (chainId) {
      dispatch(setLastChainId(chainId))
    }
  }, [dispatch, chainId])
}
