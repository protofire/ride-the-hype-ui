/**
 * chains.ts
 *
 * This file contains the configuration for different blockchain chains.
 */

import type { ChainInfo } from '~/types'
import { FEATURES } from '~/types'
import { IS_PRODUCTION } from '~/config/constants'

// Define the chains configuration
const chainsConfiguration: ChainInfo[] = [
  {
    chainId: '1261120',
    chainName: 'zKatana',
    description: 'Astar zkEVM Testnet zKatana',
    shortName: 'azktn',
    inscriptionPrefix: 'zktt',
    features: [FEATURES.INSC20, FEATURES.CUSTOM_INSC],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      logoUri: 'https://safe-astar-static-assets.s3.amazonaws.com/chains/1261120/currency_logo.png',
    },
    blockExplorerUriTemplate: {
      address: 'https://zkatana.blockscout.com/address/{{address}}',
      txHash: 'https://zkatana.blockscout.com/tx/{{txHash}}',
      api: 'https://zkatana.blockscout.com/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
    },
    disabledWallets: ['trust', 'coinbase', 'ledger', 'trezor', 'keystone', 'walletConnect_v2', 'NONE'],
    ensRegistryAddress: null,
    publicRpcUri: {
      value: 'https://rpc.zkatana.gelato.digital',
    },
    rpcUri: {
      value: 'https://rpc.zkatana.gelato.digital',
    },
    theme: {
      textColor: '#ffffff',
      backgroundColor: '#000000',
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
      logoUri: 'https://safe-astar-static-assets.s3.amazonaws.com/chains/1261120/currency_logo.png',
    },
    blockExplorerUriTemplate: {
      address: 'https://zkatana.blockscout.com/address/{{address}}',
      txHash: 'https://zkatana.blockscout.com/tx/{{txHash}}',
      api: 'https://zkatana.blockscout.com/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
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
  },
  ...(IS_PRODUCTION
    ? [
        {
          chainId: '4689',
          chainName: 'IoTeX',
          shortName: 'iotx',
          inscriptionPrefix: 'io',
          features: [FEATURES.INSC20, FEATURES.CUSTOM_INSC],
          description: 'IoTeX Mainnet',
          rpcUri: {
            value: 'https://babel-api.mainnet.iotex.io',
          },
          publicRpcUri: {
            value: 'https://babel-api.mainnet.iotex.io',
          },
          blockExplorerUriTemplate: {
            address: 'https://iotexscan.io/address/{{address}}',
            txHash: 'https://iotexscan.io/tx/{{txHash}}',
          },
          nativeCurrency: {
            name: 'IOTX',
            symbol: 'IOTX',
            decimals: 18,
            logoUri: 'https://safe-iotex-static-assets-us-east-1.s3.amazonaws.com/chains/4689/currency_logo.png',
          },
          theme: {
            textColor: '#ffffff',
            backgroundColor: '#43c9ba',
          },
          disabledWallets: ['trust', 'coinbase', 'ledger', 'trezor', 'keystone', 'walletConnect_v2', 'NONE'],
        },
      ]
    : [
        {
          chainId: '4690',
          chainName: 'IoTeX Testnet',
          shortName: 'iotxtest',
          inscriptionPrefix: 'iott',
          features: [FEATURES.INSC20, FEATURES.CUSTOM_INSC],
          description: 'IoTeX Testnet',
          rpcUri: {
            value: 'https://babel-api.testnet.iotex.io',
          },
          publicRpcUri: {
            value: 'https://babel-api.testnet.iotex.io',
          },
          blockExplorerUriTemplate: {
            address: 'https://testnet.iotexscan.io/address/{{address}}',
            txHash: 'https://testnet.iotexscan.io/tx/{{txHash}}',
          },
          nativeCurrency: {
            name: 'IOTX',
            symbol: 'IOTX',
            decimals: 18,
            logoUri: 'https://safe-iotex-static-assets-us-east-1.s3.amazonaws.com/chains/4690/currency_logo.png',
          },
          theme: {
            textColor: '#ffffff',
            backgroundColor: '#000000',
          },
          disabledWallets: ['trust', 'coinbase', 'ledger', 'trezor', 'keystone', 'walletConnect_v2', 'NONE'],
        },
      ]),
]

// Create a map of chain short names to chain IDs
const chains: Record<string, string> = chainsConfiguration.reduce((map, chain) => {
  return { ...map, [chain.shortName]: String(chain.chainId) }
}, {})

export { chainsConfiguration }
export default chains
