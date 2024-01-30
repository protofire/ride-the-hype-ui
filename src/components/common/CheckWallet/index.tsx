import { type ReactElement } from 'react'
import { Tooltip } from '@mui/material'
import useWallet from '~/hooks/wallets/useWallet'
import useConnectWallet from '../ConnectWallet/useConnectWallet'
import { useAppSelector } from '~/store'
import { selectAuthStatus } from '~/store/authSlice'
import { SignStatus } from '~/hooks/wallets/useVerifySignature'

type CheckWalletProps = {
  children: (ok: boolean) => ReactElement
}

enum Message {
  WalletNotConnected = 'Please connect your wallet',
  MessageNotSigned = 'Please sign an agreement message',
}

const CheckWallet = ({ children }: CheckWalletProps): ReactElement => {
  const wallet = useWallet()
  const connectWallet = useConnectWallet()
  const authStatus = useAppSelector((state) => selectAuthStatus(state))

  const message = !wallet
    ? Message.WalletNotConnected
    : authStatus.signStatus === SignStatus.PENDING || authStatus.signStatus === SignStatus.ERROR
    ? Message.MessageNotSigned
    : ''

  if (!message) return children(true)

  return (
    <Tooltip title={message}>
      <span onClick={wallet ? undefined : connectWallet}>{children(false)}</span>
    </Tooltip>
  )
}

export default CheckWallet
