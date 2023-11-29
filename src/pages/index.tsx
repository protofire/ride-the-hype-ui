import Box from '@mui/material/Box'

import Head from 'next/head'
import { Typography } from '@mui/material'

export default function Home() {
  return (
    <>
      <Head>
        <title>Welcome to Inscriptions</title>
      </Head>

      <main>
        <Box display="flex" justifyContent="center" marginTop="1rem">
          <Typography variant="h1" fontSize={[44, null, 52]} lineHeight={1} color="static.main">
            Welcome to Inscriptions!
          </Typography>
        </Box>
      </main>
    </>
  )
}
