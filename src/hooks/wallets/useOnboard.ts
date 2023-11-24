import { useEffect } from 'react'
import { type EIP1193Provider, type WalletState, type OnboardAPI } from '@web3-onboard/core'
import { type ChainInfo } from '~/types'
import { getAddress } from 'ethers/lib/utils'
import useChains, { useCurrentChain } from '~/hooks/useChains'
import ExternalStore from '~/services/ExternalStore'

const WALLETCONNECT = 'WalletConnect'

export type ConnectedWallet = {
  label: string
  chainId: string
  address: string
  ens?: string
  provider: EIP1193Provider
  icon?: string
}

const { getStore, setStore, useStore } = new ExternalStore<OnboardAPI>()

export const initOnboard = async (chainConfigs: ChainInfo[], currentChain: ChainInfo) => {
  const { createOnboard } = await import('~/services/onboard')
  if (!getStore()) {
    setStore(createOnboard(chainConfigs, currentChain))
  }
}

// Get the most recently connected wallet address
export const getConnectedWallet = (wallets: WalletState[]): ConnectedWallet | null => {
  if (!wallets) return null

  const primaryWallet = wallets[0]
  if (!primaryWallet) return null

  const account = primaryWallet.accounts[0]
  if (!account) return null

  try {
    const address = getAddress(account.address)
    return {
      label: primaryWallet.label,
      address,
      ens: account.ens?.name,
      chainId: Number(primaryWallet.chains[0].id).toString(10),
      provider: primaryWallet.provider,
      icon: primaryWallet.icon,
    }
  } catch (e) {
    console.error(e)
    return null
  }
}

// Detect mobile devices
const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

// Detect injected wallet
const hasInjectedWallet = () => typeof window !== 'undefined' && !!window?.ethereum

// Wrapper that tracks/sets the last used wallet
export const connectWallet = async (
  onboard: OnboardAPI,
  options?: Parameters<OnboardAPI['connectWallet']>[0],
): Promise<WalletState[] | undefined> => {
  // On mobile, automatically choose WalletConnect if there is no injected wallet
  if (!options && isMobile() && !hasInjectedWallet()) {
    options = {
      autoSelect: WALLETCONNECT,
    }
  }

  let wallets: WalletState[] | undefined

  try {
    wallets = await onboard.connectWallet(options)
  } catch (e) {
    console.error(e)
    return
  }

  return wallets
}

export const switchWallet = (onboard: OnboardAPI) => {
  return connectWallet(onboard)
}

// Disable/enable wallets according to chain
export const useInitOnboard = () => {
  const { configs } = useChains()
  const chain = useCurrentChain()
  const onboard = useStore()

  useEffect(() => {
    if (configs.length > 0 && chain) {
      void initOnboard(configs, chain)
    }
  }, [configs, chain])

  // Disable unsupported wallets on the current chain
  useEffect(() => {
    if (!onboard || !chain) return

    const enableWallets = async () => {
      const { getSupportedWallets } = await import('~/hooks/wallets/wallets')
      const supportedWallets = getSupportedWallets(chain)
      onboard.state.actions.setWalletModules(supportedWallets)
    }

    void enableWallets()
  }, [chain, onboard])

  // Track connected wallet
  useEffect(() => {
    let lastConnectedWallet = ''
    if (!onboard) return

    const walletSubscription = onboard.state.select('wallets').subscribe((wallets) => {
      const newWallet = getConnectedWallet(wallets)
      if (newWallet) {
        if (newWallet.label !== lastConnectedWallet) {
          lastConnectedWallet = newWallet.label
        }
      } else {
        lastConnectedWallet = ''
      }
    })

    return () => {
      walletSubscription.unsubscribe()
    }
  }, [onboard])
}

export default useStore
