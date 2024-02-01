import { useParams } from 'next/navigation'
import { IS_PRODUCTION } from '~/config/constants'
import chains from '~/config/chains'
import { useAppSelector } from '~/store'
import { selectSession } from '~/store/sessionSlice'
import useWallet from './wallets/useWallet'
import useChains from './useChains'

const defaultChainId = IS_PRODUCTION ? chains.oeth : chains.opsep

export const useUrlChainId = (): string | undefined => {
  const queryParams = useParams()
  const { configs } = useChains()

  // Dynamic query params
  const shortName = queryParams?.chain?.toString()

  if (!shortName) return undefined

  return chains[shortName] || configs.find((item) => item.shortName === shortName)?.chainId
}

export const useChainId = (): string => {
  const session = useAppSelector(selectSession)
  const urlChainId = useUrlChainId()
  const wallet = useWallet()
  const { configs } = useChains()

  const walletChainId =
    wallet?.chainId && configs.some(({ chainId }) => chainId === wallet.chainId) ? wallet.chainId : undefined

  return urlChainId || walletChainId || session.lastChainId || defaultChainId
}

export default useChainId
