import { useEffect } from 'react'
import { type ChainInfo } from '~/types'

import useAsync, { type AsyncResult } from '../useAsync'
import { getChainsConfig } from '~/utils/getChainsConfig'

const getConfigs = async (): Promise<ChainInfo[]> => {
  const data = getChainsConfig()
  console.log(data)
  return data.results || []
}

export const useLoadChains = (): AsyncResult<ChainInfo[]> => {
  const [data, error, loading] = useAsync<ChainInfo[]>(getConfigs, [])

  // Log errors
  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  return [data, error, loading]
}

export default useLoadChains
