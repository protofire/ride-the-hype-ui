import type { ChainInfo } from '~/types'

export const getChainsConfig = (): { results: ChainInfo[] } => ({
  results: [
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
  ],
})
