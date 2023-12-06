/**
 * chains.ts
 *
 * This file contains the configuration for different blockchain chains.
 */

import type { ChainInfo } from '~/types'
import { IS_PRODUCTION } from '~/config/constants'

// Define the chains configuration
const chainsConfiguration: ChainInfo[] = IS_PRODUCTION
  ? [
      {
        chainId: '4689',
        chainName: 'IoTeX',
        shortName: 'iotx',
        inscriptionPrefix: 'io',
        description: 'IoTeX Mainnet',
        rpcUri: {
          value: 'https://babel-api.mainnet.iotex.io',
        },
        publicRpcUri: {
          value: 'https://babel-api.mainnet.iotex.io',
        },
        blockExplorerUriTemplate: {
          address: 'https://iotexscout.io/address/{{address}}',
          txHash: 'https://iotexscout.io/tx/{{txHash}}',
          api: 'https://iotexscout.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
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
        disabledWallets: ['trust', 'coinbase', 'ledger', 'trezor', 'keystone', 'walletConnect_v2'],
      },
      // {
      //   chainId: '17000',
      //   chainName: 'Holesky',
      //   shortName: 'holesky',
      //   inscriptionPrefix: 'hls',
      //   description: 'Ethereum Holesky Testnet',
      //   nativeCurrency: {
      //     name: 'Ether',
      //     symbol: 'ETH',
      //     decimals: 18,
      //     logoUri: 'https://staging-safe-holesky-static-assets-us-east-1.s3.amazonaws.com/chains/17000/currency_logo.png',
      //   },
      //   blockExplorerUriTemplate: {
      //     address: 'https://holesky.etherscan.io/address/{{address}}',
      //     txHash: 'https://holesky.etherscan.io/tx/{{txHash}}',
      //     api: 'https://holesky.etherscan.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
      //   },
      //   disabledWallets: ['trust', 'coinbase', 'ledger', 'trezor', 'keystone', 'walletConnect_v2'],
      //   ensRegistryAddress: null,
      //   publicRpcUri: {
      //     value: 'https://ethereum-holesky.publicnode.com',
      //   },
      //   rpcUri: {
      //     value: 'https://ethereum-holesky.publicnode.com',
      //   },
      //   theme: {
      //     textColor: '#ffffff',
      //     backgroundColor: '#000000',
      //   },
      // },
      // {
      //   chainId: '23294',
      //   chainName: 'Oasis Sapphire',
      //   inscriptionPrefix: 'oas',
      //   description: 'Oasis Sapphire Mainnet',
      //   nativeCurrency: {
      //     name: 'Rose',
      //     symbol: 'ROSE',
      //     decimals: 18,
      //     logoUri: 'https://safe-oasis-static-assets-us-east-1.s3.amazonaws.com/chains/23294/currency_logo.png',
      //   },
      //   blockExplorerUriTemplate: {
      //     address: 'https://explorer.sapphire.oasis.io/address/{{address}}',
      //     txHash: 'https://explorer.sapphire.oasis.io/tx/{{txHash}}',
      //     api: 'https://explorer.sapphire.oasis.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
      //   },
      //   disabledWallets: ['trust', 'coinbase', 'ledger', 'trezor', 'keystone', 'walletConnect_v2'],
      //   ensRegistryAddress: null,
      //   publicRpcUri: {
      //     value: 'https://sapphire.oasis.io',
      //   },
      //   rpcUri: {
      //     value: 'https://sapphire.oasis.io',
      //   },
      //   shortName: 'sapphire',
      //   theme: {
      //     textColor: '#ffffff',
      //     backgroundColor: '#000000',
      //   },
      // },
      // {
      //   chainId: '23295',
      //   chainName: 'Oasis Sapphire Testnet',
      //   inscriptionPrefix: 'oast',
      //   description: 'Oasis Sapphire Testnet',
      //   nativeCurrency: {
      //     name: 'Sapphire Test Rose',
      //     symbol: 'TEST',
      //     decimals: 18,
      //     logoUri: 'https://safe-oasis-static-assets-us-east-1.s3.amazonaws.com/chains/23295/currency_logo.png',
      //   },
      //   blockExplorerUriTemplate: {
      //     address: 'https://testnet.explorer.sapphire.oasis.dev/address/{{address}}',
      //     txHash: 'https://testnet.explorer.sapphire.oasis.dev/tx/{{txHash}}',
      //     api: 'https://testnet.sapphire.oasis.dev/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}',
      //   },
      //
      //   disabledWallets: ['trust', 'coinbase', 'ledger', 'trezor', 'keystone', 'walletConnect_v2'],
      //   ensRegistryAddress: null,
      //   publicRpcUri: {
      //     value: 'https://testnet.sapphire.oasis.dev',
      //   },
      //   rpcUri: {
      //     value: 'https://testnet.sapphire.oasis.dev',
      //   },
      //   shortName: 'sapphire-testnet',
      //   theme: {
      //     textColor: '#ffffff',
      //     backgroundColor: '#000000',
      //   },
      // },
    ]
  : [
      {
        chainId: '4690',
        chainName: 'IoTeX Testnet',
        shortName: 'iotxtest',
        inscriptionPrefix: 'iott',
        description: 'IoTeX Testnet',
        rpcUri: {
          value: 'https://babel-api.testnet.iotex.io',
        },
        publicRpcUri: {
          value: 'https://babel-api.testnet.iotex.io',
        },
        blockExplorerUriTemplate: {
          address: 'https://testnet.iotexscout.io/address/{{address}}',
          txHash: 'https://testnet.iotexscout.io/tx/{{txHash}}',
          api: 'https://testnet.iotexscout.io/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
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
        disabledWallets: ['trust', 'coinbase', 'ledger', 'trezor', 'keystone', 'walletConnect_v2'],
      },
    ]

// Create a map of chain short names to chain IDs
const chains: Record<string, string> = chainsConfiguration.reduce((map, chain) => {
  return { ...map, [chain.shortName]: String(chain.chainId) }
}, {})

export { chainsConfiguration }
export default chains
