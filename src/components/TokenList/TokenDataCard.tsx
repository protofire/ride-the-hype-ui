import type { Insc20Balance } from '~/services/indexer-api/types'

import css from './styles.module.css'
import { Card } from '@mui/material'

interface Props {
  item: Insc20Balance
}

export const TokenDataCard = ({ item }: Props) => {
  return (
    <div className={css.cardContainer}>
      <Card className={css.cardTokenItem} key={item.tokenId}>
        <div className={css.cardHeader}>
          <span className={css.dollar}>{item.tick}</span>
        </div>
        <div className={css.cardBody}>{item.amount.toLocaleString()}</div>
      </Card>
    </div>
  )
}
