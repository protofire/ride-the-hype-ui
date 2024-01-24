import { useState } from 'react'
import Button from '@mui/material/Button'

import TransferInsc20Modal from '~/components/insc-20/TransferInsc20Modal'
import CheckWallet from '~/components/common/CheckWallet'

import css from './styles.module.css'
import { IconButton, ListItem, ListItemText, Stack } from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import type { MarketplaceOrder } from '~/services/indexer-api/modules/marketplace/types'

interface Props {
  item: MarketplaceOrder
}

export const MarketplaceTokenListItem = ({ item }: Props) => {
  const [transferModalOpen, setTransferModalOpen] = useState<boolean>(false)

  const tempUSDPrice = '$ 15'
  const tempETHPrice = 'ETH 0.0062'
  return (
    <>
      <div className={css.card}>
        <div className={css.cardHeader}>
          <span className={css.dollar}>{item.ticker}</span>
        </div>
        <div className={css.cardBody}>{item.amount.toLocaleString()}</div>
        <ListItem>
          <ListItemText primary={tempUSDPrice} />
          {tempETHPrice}
        </ListItem>
        <div className={css.cardFooter}>
          <div className={css.hash}>{`${item.listId.slice(0, 8)}...${item.listId.slice(-8)}`}</div>
          <div className={css.actions}>
            <CheckWallet>
              {(isOk) => (
                <Stack direction={'row'} spacing={2}>
                  <Button variant="contained">Buy</Button>
                  <IconButton color="primary">
                    <AddShoppingCartIcon />
                  </IconButton>
                </Stack>
              )}
            </CheckWallet>
          </div>
        </div>
      </div>

      <TransferInsc20Modal
        open={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        tick={item.ticker}
        maxAmount={item.amount}
      />
    </>
  )
}
