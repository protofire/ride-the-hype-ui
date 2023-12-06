import Onboard, { type EIP1193Provider, type OnboardAPI } from '@web3-onboard/core'
import type { ChainInfo } from '~/types'
import { hexValue } from '@ethersproject/bytes'
import { getAllWallets, getRecommendedInjectedWallets } from '~/hooks/wallets/wallets'
import { getRpcServiceUrl } from '~/hooks/wallets/web3'

export type ConnectedWallet = {
  label: string
  chainId: string
  address: string
  ens?: string
  provider: EIP1193Provider
}

let onboard: OnboardAPI | null = null

export const createOnboard = (chainConfigs: ChainInfo[], currentChain: ChainInfo): OnboardAPI => {
  if (onboard) return onboard

  const wallets = getAllWallets(currentChain)

  const chains = chainConfigs.map((cfg) => ({
    id: hexValue(parseInt(cfg.chainId)),
    label: cfg.chainName,
    rpcUrl: getRpcServiceUrl(cfg.rpcUri),
    token: cfg.nativeCurrency.symbol,
    color: cfg.theme.backgroundColor,
    publicRpcUrl: cfg.publicRpcUri?.value,
    blockExplorerUrl: new URL(cfg.blockExplorerUriTemplate.address).origin,
  }))

  onboard = Onboard({
    wallets,

    chains,

    accountCenter: {
      mobile: { enabled: false },
      desktop: { enabled: false },
    },

    notify: {
      enabled: false,
    },

    appMetadata: {
      name: 'Ioscriptions',
      icon: location.origin + '/images/logo.svg',
      description: 'Poc of Inscriptions',
      recommendedInjectedWallets: getRecommendedInjectedWallets(),
    },

    connect: {
      removeWhereIsMyWalletWarning: true,
      autoConnectLastWallet: true,
    },
  })

  return onboard
}
