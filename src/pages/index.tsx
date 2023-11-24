import Box from '@mui/material/Box'
import { CreateInsc20 } from '~/components/create/create-insc-20'
import { MintInsc20 } from '~/components/mint/mint-insc-20'

export default function Home() {
  return (
    <Box>
      <CreateInsc20 />
      <MintInsc20 />
    </Box>
  )
}
