import { Box, Paper, Typography } from '@mui/material'

import ConnectWallet from '.'

export const ConnectWalletPaper = () => {
  return (
    <Paper>
      <Typography textAlign={'center'}>Please connect your wallet to see data</Typography>
      <Box display="flex" justifyContent="center" sx={{ pt: '10px' }}>
        <ConnectWallet />
      </Box>
    </Paper>
  )
}
