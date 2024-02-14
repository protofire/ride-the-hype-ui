import { Box, Typography } from '@mui/material'
import { type ReactElement } from 'react'
import EthHashInfo from '~/components/common/EthHashInfo'
import type { ConnectedWallet } from '~/hooks/wallets/useOnboard'
import { useAppSelector } from '~/store'
import { selectChainById } from '~/store/chainsSlice'

import css from './styles.module.css'
import BlastIcon from '~/public/images/assets/blast.svg'

export const UNKNOWN_CHAIN_NAME = 'Unknown'

const WalletOverview = ({ wallet }: { wallet: ConnectedWallet }): ReactElement => {
  const walletChain = useAppSelector((state) => selectChainById(state, wallet.chainId))

  return (
    <Box className={css.container}>
      {walletChain && (
        <Box className={css.imageContainer}>
          <BlastIcon className={css.notEnabled} />
        </Box>
      )}

      <Box className={css.walletDetails}>
        <Typography variant="caption" component="div" className={css.walletName}>
          {wallet.label.toUpperCase()}
        </Typography>

        <Typography variant="caption" color="secondary" /*fontWeight="bold"*/ component="div">
          {wallet.ens ? (
            <div>{wallet.ens}</div>
          ) : (
            <EthHashInfo
              prefix={''}
              showCopyButton
              address={wallet.address}
              showName={false}
              showAvatar={false}
              avatarSize={12}
            />
          )}
        </Typography>
      </Box>
    </Box>
  )
}

export default WalletOverview
