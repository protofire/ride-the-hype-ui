import { type ReactElement } from 'react'
import { Tooltip } from '@mui/material'
import useWallet from '~/hooks/wallets/useWallet'
import useConnectWallet from '../ConnectWallet/useConnectWallet'

type CheckWalletProps = {
  children: (ok: boolean) => ReactElement
}

enum Message {
  WalletNotConnected = 'Please connect your wallet',
}

const CheckWallet = ({ children }: CheckWalletProps): ReactElement => {
  const wallet = useWallet()
  const connectWallet = useConnectWallet()

  const message = !wallet ? Message.WalletNotConnected : ''

  if (!message) return children(true)

  return (
    <Tooltip title={message}>
      <span onClick={wallet ? undefined : connectWallet}>{children(false)}</span>
    </Tooltip>
  )
}

export default CheckWallet
