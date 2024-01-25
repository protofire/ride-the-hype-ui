import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import css from './../styles.module.css'
import { useState } from 'react'
import useAsync from '~/hooks/useAsync'
import EnhancedTable from '~/components/common/EnhancedTable'
import type { MarketplaceOrderList } from '~/services/indexer-api/modules/marketplace/types'
import { AppRoutes } from '~/config/routes'
import EthHashInfo from '~/components/common/EthHashInfo'
import { type OrderParams } from '~/services/indexer-api/types'
import { fromWei } from 'web3-utils'
import Link from 'next/link'
// import { Button } from '@mui/material'

const PAGE_SIZE = 5

const headCells = [
  {
    id: 'status',
    label: 'Status',
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
  // {
  //   id: 'action',
  //   label: 'Action',
  // },
]

interface Props {
  tick: string
  fetchMarketplaceOrdersData: (params: OrderParams) => Promise<MarketplaceOrderList>
  seller?: string
}

const ActivityTable = ({ tick, fetchMarketplaceOrdersData, seller }: Props) => {
  // const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [showAll, setShowAll] = useState(false)
  const [cellLabels, setCellLabels] = useState(headCells)

  const [marketplaceData, error, loading] = useAsync(async () => {
    if (!!fetchMarketplaceOrdersData) {
      try {
        const data = await fetchMarketplaceOrdersData({ tick, page, limit: PAGE_SIZE, seller })
        return data
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchMarketplaceOrdersData, page, seller, tick])

  const rows = (marketplaceData?.list || []).map((item, i) => {
    return {
      key: i.toString(),
      href: AppRoutes.marketplace.token + `?ticker=${tick}`,
      cells: {
        status: {
          rawValue: item.status,
          content: (
            <>
              <Typography>{item.status}</Typography>
              <EthHashInfo showPrefix={false} address={item.listId} hasExplorer avatarSize={0} />
            </>
          ),
        },
        tick: {
          rawValue: tick,
          content: (
            <Link href={`/tokens?ticker=${tick}`}>
              <Typography color="primary">{tick}</Typography>
            </Link>
          ),
        },
        price: {
          rawValue: item.price,
          content: <Typography>{`ETH ${fromWei(item.price)}`}</Typography>,
        },
        amount: {
          rawValue: item.amount,
          content: <Typography>{+item.amount}</Typography>,
        },
        total: {
          rawValue: +item.amount * +item.price,
          content: <Typography>{`ETH ${+item.amount * +fromWei(item.price)}`}</Typography>,
        },
        from: {
          rawValue: item.seller,
          content: <EthHashInfo showPrefix={false} address={item.seller} hasExplorer avatarSize={0} />,
        },
        to: {
          rawValue: item.creator,
          content: <EthHashInfo showPrefix={false} address={item.creator} hasExplorer avatarSize={0} />,
        },
        time: {
          rawValue: item.listingTime,
          content: (
            <>
              {item.expirationTime && (
                <Typography>{new Date(Number(item.expirationTime) * 1000).toLocaleString()}</Typography>
              )}
            </>
          ),
        },
        // action: {
        //   rawValue: i,
        //   content: (
        //     <>{item.status === OrderStatus.PENDING ? <Button>{item.status === OrderStatus.PENDING}</Button> : <></>}</>
        //   ),
        // },
      },
    }
  })
  return (
    <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto' }}>
      {error ? <Typography>An error occurred while loading marketplace activity data...</Typography> : null}
      <div className={css.container}>
        <EnhancedTable rows={rows} headCells={cellLabels} />
      </div>
    </Paper>
  )
}

export default ActivityTable
