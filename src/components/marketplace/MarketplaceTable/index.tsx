import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import css from './../styles.module.css'
import { useState } from 'react'
import useAsync from '~/hooks/useAsync'
import EnhancedTable from '~/components/common/EnhancedTable'
import type { Marketplace } from '~/services/indexer-api/modules/marketplace/types'
import { Button, ButtonGroup } from '@mui/material'
import { AppRoutes } from '~/config/routes'

const PAGE_SIZE = 5

const headCells = [
  {
    id: 'tick',
    label: 'Ticker',
  },
  {
    id: 'floorPrice',
    label: 'Floor Price',
  },
  {
    id: 'volume',
    label: 'Volume (24h)',
  },
  {
    id: 'sales',
    label: 'Sales (24h)',
  },
  {
    id: 'owners',
    label: 'Owners',
  },
  {
    id: 'marketCap',
    label: 'Market Cap',
  },
  {
    id: 'listed',
    label: 'Listed',
  },
]

interface Props {
  fetchMarketplaceData: (page: number, limit: number) => Promise<Marketplace[]> | undefined
}

const MarketplaceTable = ({ fetchMarketplaceData }: Props) => {
  // const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [showAll, setShowAll] = useState(false)
  const [cellLabels, setCellLabels] = useState(headCells)

  const [marketplaceData, error, loading] = useAsync(async () => {
    if (!!fetchMarketplaceData) {
      try {
        const data = await fetchMarketplaceData(page, PAGE_SIZE)
        return data
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchMarketplaceData, page])

  const rows = (marketplaceData || []).map((item, i) => {
    return {
      key: i.toString(),
      href: AppRoutes.marketplace.token + `?ticker=${item.tick}`,
      cells: {
        tick: {
          rawValue: item.tick,
          content: <Typography>{item.tick}</Typography>,
        },
        floorPrice: {
          rawValue: item.floorPrice,
          content: <Typography>{`$${item.floorPrice.toFixed(2)}`}</Typography>,
        },
        volume: {
          rawValue: item.volume24h,
          content: <Typography>{`ETH ${(showAll ? item.volumeAll : item.volume24h).toFixed(2)}`}</Typography>,
        },
        sales: {
          rawValue: item.sales24h,
          content: <Typography>{`${(showAll ? item.salesAll : item.sales24h).toFixed(0)}`}</Typography>,
        },
        owners: {
          rawValue: item.owners,
          content: <Typography>{item.owners.toFixed(0)}</Typography>,
        },
        marketCap: {
          rawValue: item.marketCap,
          content: <Typography>{`$${item.marketCap.toLocaleString()}`}</Typography>,
        },
        listed: {
          rawValue: item.listed,
          content: <Typography>{item.listed.toFixed(0)}</Typography>,
        },
      },
    }
  })
  return (
    <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto' }}>
      {error ? <Typography>An error occurred while loading marketplace data...</Typography> : null}
      <ButtonGroup sx={{ width: '50px' }}>
        <Button
          color={showAll ? 'primary' : 'secondary'}
          onClick={() => {
            setShowAll((prevState) => !prevState)
            console.log(showAll)
            setCellLabels(
              cellLabels.map((cell) =>
                cell.id === 'volume'
                  ? { ...cell, label: `Volume (All)` }
                  : cell.id === 'sales'
                  ? { ...cell, label: `Sales (All)` }
                  : cell,
              ),
            )
          }}
        >
          All
        </Button>
        <Button
          color={showAll ? 'secondary' : 'primary'}
          onClick={() => {
            setShowAll((prevState) => !prevState)
            console.log(showAll)
            setCellLabels(
              cellLabels.map((cell) =>
                cell.id === 'volume'
                  ? { ...cell, label: `Volume (24 h)` }
                  : cell.id === 'sales'
                  ? { ...cell, label: `Sales (24 h)` }
                  : cell,
              ),
            )
          }}
        >
          24h
        </Button>
      </ButtonGroup>
      <div className={css.container}>
        <EnhancedTable rows={rows} headCells={cellLabels} defaultSortField={headCells[5].id} />
      </div>
    </Paper>
  )
}

export default MarketplaceTable
