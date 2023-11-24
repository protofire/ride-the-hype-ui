import { Box, Button } from '@mui/material'
import css from './styles.module.css'
import ChainIndicator from '~/components/common/ChainIndicator'
import EthHashInfo from '~/components/common/EthHashInfo'
import ChainSwitcher from '~/components/common/ChainSwitcher'
import useOnboard, { type ConnectedWallet, switchWallet } from '~/hooks/wallets/useOnboard'
import { useAppSelector } from '~/store'
import { selectChainById } from '~/store/chainsSlice'

type WalletInfoProps = {
  wallet: ConnectedWallet
  handleClose: () => void
}

export const WalletInfo = ({ wallet, handleClose }: WalletInfoProps) => {
  const onboard = useOnboard()
  const chainInfo = useAppSelector((state) => selectChainById(state, wallet.chainId))
  const prefix = chainInfo?.shortName

  const handleSwitchWallet = () => {
    if (onboard) {
      handleClose()
      switchWallet(onboard)
    }
  }

  const handleDisconnect = () => {
    if (!wallet) return

    onboard?.disconnectWallet({
      label: wallet.label,
    })

    handleClose()
  }

  return (
    <Box className={css.container}>
      <Box className={css.accountContainer}>
        <ChainIndicator />

        <Box className={css.addressContainer}>
          <EthHashInfo
            address={wallet.address}
            name={wallet.ens}
            hasExplorer
            showCopyButton
            prefix={prefix}
            avatarSize={32}
          />
        </Box>
      </Box>

      <ChainSwitcher fullWidth />

      <Button variant="contained" size="small" onClick={handleSwitchWallet} fullWidth>
        Switch wallet
      </Button>

      <Button onClick={handleDisconnect} variant="danger" size="small" fullWidth disableElevation>
        Disconnect
      </Button>
    </Box>
  )
}

export default WalletInfo
