import Paper from '@mui/material/Paper'
import { Box, Typography } from '@mui/material'

import ConnectWallet from '.'

export const ConnectWalletPaper = () => {
  return (
    <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto', textAlign: 'center' }}>
      <Typography>Please connect your wallet to see data</Typography>
      <Box display="flex" justifyContent="center" sx={{ pt: '10px' }}>
        <ConnectWallet />
      </Box>
    </Paper>
  )
}
