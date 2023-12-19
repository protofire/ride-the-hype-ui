export declare type RpcUri = {
  value: string
}

export declare type BlockExplorerUriTemplate = {
  address: string
  txHash: string
  api?: string
}
export declare type NativeCurrency = {
  name: string
  symbol: string
  decimals: number
  logoUri: string
}
export declare type Theme = {
  textColor: string
  backgroundColor: string
}

export enum FEATURES {
  INSC20 = 'INSC20',
  INSC721 = 'INSC721',
  CUSTOM_INSC = 'CUSTOM_INSC',
}

export declare type ChainInfo = {
  chainId: string
  chainName: string
  shortName: string
  inscriptionPrefix: string
  description: string
  rpcUri: RpcUri
  publicRpcUri?: RpcUri
  blockExplorerUriTemplate: BlockExplorerUriTemplate
  nativeCurrency: NativeCurrency
  theme: Theme
  ensRegistryAddress?: string | null
  disabledWallets: string[]
  features: FEATURES[]
}

export enum Insc20Filter {
  ALL = 'all',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
}
