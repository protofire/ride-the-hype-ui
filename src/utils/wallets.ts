import type { ConnectedWallet } from '~/hooks/wallets/useOnboard'
import { WALLET_KEYS } from '~/hooks/wallets/consts'
import type { OnboardAPI } from '@web3-onboard/core'
import { connectWallet, getConnectedWallet } from '~/hooks/wallets/useOnboard'
import { hexValue } from 'ethers/lib/utils'

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
