import Typography from '@mui/material/Typography'
import css from './../styles.module.css'
import { useState } from 'react'
import useAsync from '~/hooks/useAsync'
import EnhancedTable from '~/components/common/EnhancedTable'
import type { MarketplaceList } from '~/services/indexer-api/modules/marketplace/types'
// import { Button, ButtonGroup } from '@mui/material'
import { AppRoutes } from '~/config/routes'
import { useCurrentChain } from '~/hooks/useChains'
// import { fromWei } from 'web3-utils'
import { Paper } from '@mui/material'

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
  // {
  //   id: 'volume',
  //   label: 'Volume (All)',
  // },
  {
    id: 'sales',
    label: 'Sales (All)',
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
  fetchMarketplaceData: (page: number, limit: number) => Promise<MarketplaceList> | undefined
  title?: string
}

const MarketplaceTable = ({ fetchMarketplaceData, title }: Props) => {
  // const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(15)
  const [showAll, setShowAll] = useState(true)
  const [cellLabels, setCellLabels] = useState(headCells)
  const currentChain = useCurrentChain()

  const [marketplaceData, error, loading] = useAsync(async () => {
    if (!!fetchMarketplaceData) {
      try {
        const data = await fetchMarketplaceData(page + 1, pageSize)
        return data
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchMarketplaceData, page, pageSize])

  const rows = (marketplaceData?.list || []).map((item, i) => {
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
          content: <Typography>{`$ ${parseFloat(item.floorPriceUsd.toFixed(6).toString())}`}</Typography>,
        },
        // volume: {
        //   rawValue: item.volume24h,
        //   content: (
        //     <Typography>{`ETH ${
        //       showAll ? fromWei(item.volumeAll.toString()) : fromWei(item.volume24h.toString())
        //     }`}</Typography>
        //   ),
        // },
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
    <Paper title={title}>
      {error ? <Typography>An error occurred while loading marketplace data...</Typography> : null}
      <div className={css.container}>
        <EnhancedTable
          rows={rows}
          headCells={cellLabels}
          onDemandPagination={{
            pageSize: pageSize,
            page: page,
            setPage: setPage,
            setPageSize: setPageSize,
            totalHolders: marketplaceData?.count ?? 0,
          }}
        />
      </div>
    </Paper>
  )
}

export default MarketplaceTable
