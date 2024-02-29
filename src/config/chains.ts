/**
 * chains.ts
 *
 * This file contains the configuration for different blockchain chains.
 */

import type { ChainInfo } from '~/types'
import { FEATURES } from '~/types'
//import { IS_PRODUCTION } from '~/config/constants'

// Define the chains configuration
const chainsConfiguration: ChainInfo[] = [
  {
    chainId: '168587773',
    chainName: 'Blast Sepolia Testnet',
    description: 'Blast Sepolia Testnet',
    shortName: 'blastsepolia',
    inscriptionPrefix: 'ysc',
    features: [FEATURES.INSC20, FEATURES.CUSTOM_INSC],
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628',
    },
    blockExplorerUriTemplate: {
      address: 'https://testnet.blastscan.io/address/{{address}}',
      txHash: 'https://testnet.blastscan.io/tx/{{txHash}}',
      api: 'https://testnet.blastscan.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    disabledWallets: ['trust', 'coinbase', 'ledger', 'trezor', 'keystone', 'walletConnect_v2', 'NONE'],
    ensRegistryAddress: null,
    publicRpcUri: {
      value: 'https://sepolia.blast.io',
    },
    rpcUri: {
      value: 'https://sepolia.blast.io',
    },
    theme: {
      textColor: '#ffffff',
      backgroundColor: '#000000',
    },
    apiUri: {
      value: 'https://api.stg.yieldscriptions.io/.',
    },
    marketplace: '',
  },
]

// Create a map of chain short names to chain IDs
const chains: Record<string, string> = chainsConfiguration.reduce((map, chain) => {
  return { ...map, [chain.shortName]: String(chain.chainId) }
}, {})

export { chainsConfiguration }
export default chains
