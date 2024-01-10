import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import css from './../styles.module.css'
import { useState } from 'react'
import useAsync from '~/hooks/useAsync'
import EnhancedTable from '~/components/common/EnhancedTable'
import type { MarketplaceActivity } from '~/services/indexer-api/modules/marketplace/types'
import { AppRoutes } from '~/config/routes'
import EthHashInfo from '~/components/common/EthHashInfo'

const PAGE_SIZE = 5

const headCells = [
  {
    id: 'event',
    label: 'Event',
  },
  {
    id: 'tick',
    label: 'Ticker',
  },
  {
    id: 'price',
    label: 'Price',
  },
  {
    id: 'amount',
    label: 'Amount',
  },
  {
    id: 'total',
    label: 'Total',
  },
  {
    id: 'from',
    label: 'From',
  },
  {
    id: 'to',
    label: 'To',
  },
  {
    id: 'time',
    label: 'Time',
  },
]

interface Props {
  fetchMarketplaceActivityData: (page: number, limit: number) => Promise<MarketplaceActivity[]> | undefined
}

const ActivityTable = ({ fetchMarketplaceActivityData }: Props) => {
  // const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [showAll, setShowAll] = useState(false)
  const [cellLabels, setCellLabels] = useState(headCells)

  const [marketplaceData, error, loading] = useAsync(async () => {
    if (!!fetchMarketplaceActivityData) {
      try {
        const data = await fetchMarketplaceActivityData(page, PAGE_SIZE)
        return data
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchMarketplaceActivityData, page])

  const rows = (marketplaceData || []).map((item, i) => {
    return {
      key: i.toString(),
      href: AppRoutes.marketplace.token + `?ticker=${item.tick}`,
      cells: {
        event: {
          rawValue: item.event,
          content: (
            <>
              <Typography>{item.event}</Typography>
              <EthHashInfo showPrefix={false} address={item.hash} hasExplorer avatarSize={0} />
            </>
          ),
        },
        tick: {
          rawValue: item.tick,
          content: <Typography>{item.tick}</Typography>,
        },
        price: {
          rawValue: item.price,
          content: <Typography>{`$${item.price.toFixed(2)}`}</Typography>,
        },
        amount: {
          rawValue: item.amount,
          content: <Typography>{item.amount.toFixed(0)}</Typography>,
        },
        total: {
          rawValue: item.total,
          content: <Typography>{`ETH ${item.total.toFixed(2)}`}</Typography>,
        },
        from: {
          rawValue: item.from,
          content: <EthHashInfo showPrefix={false} address={item.from} hasExplorer avatarSize={0} />,
        },
        to: {
          rawValue: item.to,
          content: <EthHashInfo showPrefix={false} address={item.to} hasExplorer avatarSize={0} />,
        },
        time: {
          rawValue: item.time,
          content: <Typography>{item.time.toFixed(0)}</Typography>,
        },
      },
    }
  })
  return (
    <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto' }}>
      {error ? <Typography>An error occurred while loading marketplace activity data...</Typography> : null}
      <div className={css.container}>
        <EnhancedTable rows={rows} headCells={cellLabels} defaultSortField={headCells[5].id} />
      </div>
    </Paper>
  )
}

export default ActivityTable
