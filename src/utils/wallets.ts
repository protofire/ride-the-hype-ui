import type { ConnectedWallet } from '~/hooks/wallets/useOnboard'
import { WALLET_KEYS } from '~/hooks/wallets/consts'
import type { OnboardAPI } from '@web3-onboard/core'
import { connectWallet, getConnectedWallet } from '~/hooks/wallets/useOnboard'
import { hexValue } from 'ethers/lib/utils'
import type { JsonRpcSigner } from '@ethersproject/providers'
import { createWeb3 } from '~/hooks/wallets/web3'

export const isHardwareWallet = (wallet: ConnectedWallet): boolean => {
  return [WALLET_KEYS.LEDGER, WALLET_KEYS.TREZOR, WALLET_KEYS.KEYSTONE].includes(
    wallet.label.toUpperCase() as WALLET_KEYS,
  )
}

export const switchWalletChain = async (onboard: OnboardAPI, chainId: string): Promise<ConnectedWallet | null> => {
  const currentWallet = getConnectedWallet(onboard.state.get().wallets)

  if (!currentWallet) {
    return null
  }

  if (isHardwareWallet(currentWallet)) {
    await onboard.disconnectWallet({ label: currentWallet.label })
    const wallets = await connectWallet(onboard, { autoSelect: currentWallet.label })

    return wallets ? getConnectedWallet(wallets) : null
  }

  const didSwitch = await onboard.setChain({ chainId: hexValue(parseInt(chainId)) })
  if (!didSwitch) {
    return currentWallet
  }

  /**
   * Onboard doesn't update immediately and otherwise returns a stale wallet if we directly get its state
   */
  return new Promise((resolve) => {
    const source$ = onboard.state.select('wallets').subscribe((newWallets) => {
      const newWallet = getConnectedWallet(newWallets)
      if (newWallet && newWallet.chainId === chainId) {
        source$.unsubscribe()
        resolve(newWallet)
      }
    })
  })
}

export const assertWalletChain = async (onboard: OnboardAPI, chainId: string): Promise<ConnectedWallet> => {
  const wallet = getConnectedWallet(onboard.state.get().wallets)

  if (!wallet) {
    throw new Error('No wallet connected.')
  }

  if (wallet.chainId === chainId) {
    return wallet
  }

  const newWallet = await switchWalletChain(onboard, chainId)

  if (!newWallet) {
    throw new Error('No wallet connected.')
  }

  if (newWallet.chainId !== chainId) {
    throw new Error('Wallet connected to wrong chain.')
  }

  return newWallet
}

export const getAssertedChainSigner = async (onboard: OnboardAPI, chainId: string): Promise<JsonRpcSigner> => {
  const wallet = await assertWalletChain(onboard, chainId)
  const provider = createWeb3(wallet.provider)
  return provider.getSigner()
}
