import type { ReactElement } from 'react'
import { useCallback } from 'react'
import { Button } from '@mui/material'
import { useCurrentChain } from '~/hooks/useChains'
import useOnboard from '~/hooks/wallets/useOnboard'
import useIsWrongChain from '~/hooks/useIsWrongChain'
import { switchWalletChain } from '~/utils/wallets'
import BlastLogo from '~/public/images/assets/blast-logo.svg'

const ChainSwitcher = ({ fullWidth }: { fullWidth?: boolean }): ReactElement | null => {
  const chain = useCurrentChain()
  const onboard = useOnboard()
  const isWrongChain = useIsWrongChain()

  const handleChainSwitch = useCallback(async () => {
    if (!onboard || !chain) return

    await switchWalletChain(onboard, chain.chainId)
  }, [chain, onboard])

  if (!isWrongChain) return null

  return (
    <Button
      onClick={handleChainSwitch}
      variant="outlined"
      size="small"
      fullWidth={fullWidth}
      sx={{ fontFamily: 'KulimParkItalic' }}
    >
      SWITCH TO <BlastLogo />
    </Button>
  )
}

export default ChainSwitcher
