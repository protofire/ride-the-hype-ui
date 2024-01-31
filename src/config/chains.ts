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
    chainId: '10',
    chainName: 'OP Mainnet',
    description: 'Optimism Mainnet',
    shortName: 'oeth',
    inscriptionPrefix: 'osc',
    features: [FEATURES.INSC20, FEATURES.CUSTOM_INSC],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628',
    },
    blockExplorerUriTemplate: {
      address: 'https://optimistic.etherscan.io/address/{{address}}',
      txHash: 'https://optimistic.etherscan.io/tx/{{txHash}}',
      api: 'https://optimistic.etherscan.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    disabledWallets: ['trust', 'coinbase', 'ledger', 'trezor', 'keystone', 'walletConnect_v2', 'NONE'],
    ensRegistryAddress: null,
    publicRpcUri: {
      value: 'https://mainnet.optimism.io',
    },
    rpcUri: {
      value: 'https://mainnet.optimism.io',
    },
    theme: {
      textColor: '#ffffff',
      backgroundColor: '#000000',
    },
    apiUri: {
      value:
        process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true'
          ? 'https://api.optiscriptions.io/'
          : 'https://api.stg.optiscriptions.io',
    },
  },

  {
    chainId: '1337',
    chainName: 'hardhat',
    description: 'Hardhat localhost',
    shortName: 'hardhat',
    inscriptionPrefix: 'hrd',
    features: [FEATURES.INSC20, FEATURES.CUSTOM_INSC],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628',
    },
    blockExplorerUriTemplate: {
      address: 'https://sepolia-optimism.etherscan.io/address/{{address}}',
      txHash: 'https://sepolia-optimism.etherscan.io/tx/{{txHash}}',
      api: 'https://sepolia-optimism.etherscan.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    disabledWallets: ['trust', 'coinbase', 'ledger', 'trezor', 'keystone', 'walletConnect_v2', 'NONE'],
    ensRegistryAddress: null,
    publicRpcUri: {
      value: 'http://localhost:8545',
    },
    rpcUri: {
      value: 'http://localhost:8545',
    },
    theme: {
      textColor: '#ffffff',
      backgroundColor: '#000000',
    },
    apiUri: {
      value: 'http://localhost:3001',
    },
    marketplace: '0x688e4229c7FA174eBC990d504522Ab04CBEef6eC',
  },
  {
    chainId: '11155420',
    chainName: 'OP Sepolia Testnet',
    description: 'OP Sepolia Testnet',
    shortName: 'opsep',
    inscriptionPrefix: 'osc',
    features: [FEATURES.INSC20, FEATURES.CUSTOM_INSC],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628',
    },
    blockExplorerUriTemplate: {
      address: 'https://sepolia-optimism.etherscan.io/address/{{address}}',
      txHash: 'https://sepolia-optimism.etherscan.io/tx/{{txHash}}',
      api: 'https://sepolia-optimism.etherscan.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    disabledWallets: ['trust', 'coinbase', 'ledger', 'trezor', 'keystone', 'walletConnect_v2', 'NONE'],
    ensRegistryAddress: null,
    publicRpcUri: {
      value: 'https://sepolia.optimism.io',
    },
    rpcUri: {
      value: 'https://sepolia.optimism.io',
    },
    theme: {
      textColor: '#ffffff',
      backgroundColor: '#000000',
    },
    apiUri: {
      value: 'https://api-test.stg.optiscriptions.io/',
    },
    marketplace: '0xE2807e351E967C80be5044bab3A76834e724b64f',
  },
]

// Create a map of chain short names to chain IDs
const chains: Record<string, string> = chainsConfiguration.reduce((map, chain) => {
  return { ...map, [chain.shortName]: String(chain.chainId) }
}, {})

export { chainsConfiguration }
export default chains
