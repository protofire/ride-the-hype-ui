import { useState } from 'react'
import Button from '@mui/material/Button'

import type { Insc20Balance } from '~/services/indexer-api/types'
import TransferInsc20Modal from '~/components/insc-20/TransferInsc20Modal'
import CheckWallet from '~/components/common/CheckWallet'

import css from './styles.module.css'

interface Props {
  item: Insc20Balance
}

export const TokenListItem = ({ item }: Props) => {
  const [transferModalOpen, setTransferModalOpen] = useState<boolean>(false)

  return (
    <>
      <div className={css.card} key={item.tokenId}>
        <div className={css.cardHeader}>
          <span className={css.dollar}>{item.tick}</span>
        </div>
        <div className={css.cardBody}>{item.amount.toLocaleString()}</div>
        <div className={css.cardFooter}>
          <div className={css.hash}>{`${item.hash.slice(0, 8)}...${item.hash.slice(-8)}`}</div>
          <div className={css.actions}>
            <CheckWallet>
              {(isOk) => (
                <Button className={css.button} onClick={() => setTransferModalOpen(true)} disabled={!isOk}>
                  Transfer
                </Button>
              )}
            </CheckWallet>
            {/* <button className={css.button}>List</button> */}
          </div>
        </div>
      </div>

      <TransferInsc20Modal
        open={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        tick={item.tick}
        maxAmount={item.amount}
      />
    </>
  )
}
