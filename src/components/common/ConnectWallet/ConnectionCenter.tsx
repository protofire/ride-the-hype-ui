import { Box } from '@mui/material'
import ConnectWalletButton from './ConnectWalletButton'
import { type ReactElement } from 'react'
import css from '~/components/common/ConnectWallet/styles.module.css'

export const ConnectionCenter = (): ReactElement => {
  return (
    <Box className={css.buttonContainer}>
      <ConnectWalletButton />
    </Box>
  )
}

export default ConnectionCenter
