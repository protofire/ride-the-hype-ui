import { type RpcUri } from '~/types'
import { type EIP1193Provider } from '@web3-onboard/core'
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import ExternalStore from '~/services/ExternalStore'
import { EMPTY_DATA } from '~/config/constants'

// RPC helpers
export const getRpcServiceUrl = (rpcUri: RpcUri): string => {
  return rpcUri.value
}

export const createWeb3ReadOnly = (rpcUri: RpcUri): JsonRpcProvider | undefined => {
  const url = getRpcServiceUrl(rpcUri)
  if (!url) return
  return new JsonRpcProvider({ url, timeout: 10_000 })
}

export const createWeb3 = (walletProvider: EIP1193Provider): Web3Provider => {
  return new Web3Provider(walletProvider)
}

export const { setStore: setWeb3, useStore: useWeb3 } = new ExternalStore<Web3Provider>()

export const {
  getStore: getWeb3ReadOnly,
  setStore: setWeb3ReadOnly,
  useStore: useWeb3ReadOnly,
} = new ExternalStore<JsonRpcProvider>()

export const getUserNonce = async (userAddress: string): Promise<number> => {
  const web3 = getWeb3ReadOnly()
  if (!web3) return -1
  try {
    return await web3.getTransactionCount(userAddress, 'pending')
  } catch (error) {
    return Promise.reject(error)
  }
}

export const isSmartContract = async (provider: JsonRpcProvider, address: string): Promise<boolean> => {
  const code = await provider.getCode(address)

  return code !== EMPTY_DATA
}
