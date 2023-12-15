import { useState } from 'react'
import type { ReactElement } from 'react'
import Button from '@mui/material/Button'

import type { Insc20 } from '~/services/indexer-api/types'
import MintInsc20Modal from '~/components/insc-20/MintInsc20Modal'

export const MintButton = ({ insc20 }: { insc20: Insc20 }): ReactElement => {
  const [mintModalOpen, setMintModalOpen] = useState<boolean>(false)

  return (
    <>
      <Button variant="contained" color="primary" size="small" onClick={() => setMintModalOpen(true)}>
        Mint
      </Button>

      <MintInsc20Modal
        open={mintModalOpen}
        onClose={() => setMintModalOpen(false)}
        tick={insc20.tick}
        maxAmount={insc20.maxMint}
      />
    </>
  )
}
