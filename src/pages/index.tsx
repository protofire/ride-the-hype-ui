import Box from '@mui/material/Box'
import { CreateInsc20 } from '~/components/create/create-insc-20'
import { CreateInsc721 } from '~/components/create/create-insc-721'

export default function Home() {
  return (
    <Box>
      <CreateInsc20 />
      <CreateInsc721 />
    </Box>
  )
}
