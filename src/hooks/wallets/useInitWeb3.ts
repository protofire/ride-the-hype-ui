import { useEffect } from 'react'

import { useCurrentChain } from '~/hooks/useChains'
import useWallet from '~/hooks/wallets/useWallet'
import { createWeb3, createWeb3ReadOnly, setWeb3, setWeb3ReadOnly } from '~/hooks/wallets/web3'

export const useInitWeb3 = () => {
  const chain = useCurrentChain()
  const chainId = chain?.chainId
  const rpcUri = chain?.rpcUri
  const wallet = useWallet()

  useEffect(() => {
    if (wallet && wallet.chainId === chainId) {
      const web3 = createWeb3(wallet.provider)
      setWeb3(web3)
    } else {
      setWeb3(undefined)
    }
  }, [wallet, chainId])

  useEffect(() => {
    if (!rpcUri) {
      setWeb3ReadOnly(undefined)
      return
    }
    const web3ReadOnly = createWeb3ReadOnly(rpcUri)
    setWeb3ReadOnly(web3ReadOnly)
  }, [rpcUri])
}
