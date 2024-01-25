import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { Skeleton, Typography } from '@mui/material'

import css from './styles.module.css'
import { MarketplaceTokenListItem } from '~/components/TokenList/MarketplaceTokenListItem'
import type { MarketplaceOrderList } from '~/services/indexer-api/modules/marketplace/types'
import useAsync from '~/hooks/useAsync'
import { OrderStatus, type OrderParams } from '~/services/indexer-api/types'

const PAGE_SIZE = 12

export const ListedToken = ({
  tick,
  fetchMarketplaceOrdersData,
}: {
  tick: string
  fetchMarketplaceOrdersData: (params: OrderParams) => Promise<MarketplaceOrderList>
}) => {
  const [page, setPage] = useState(1)

  const [marketplaceTokenData, error, loading] = useAsync(async () => {
    if (!!fetchMarketplaceOrdersData) {
      try {
        const data = await fetchMarketplaceOrdersData({ tick, page, limit: PAGE_SIZE, status: OrderStatus.LISTED })
        return data
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchMarketplaceOrdersData, page, tick])

  const hasMore = marketplaceTokenData && marketplaceTokenData.list.length % PAGE_SIZE === 0
  // const visibleTokens = useMemo(() => marketplaceTokenData?.slice(0, PAGE_SIZE * page), [marketplaceTokenData, page])
  return (
    <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto' }}>
      {loading ? (
        <Grid container direction="row" spacing={3} mb={2}>
          {[...Array(PAGE_SIZE)].map((element, index) => (
            <Grid item lg={3} xs={6} key={`${element}-${index}`}>
              <Skeleton width="100%" height="250px" variant="rounded" />
            </Grid>
          ))}
        </Grid>
      ) : null}

      {error ? <Typography>An error occurred during loading tokens...</Typography> : null}

      {!loading && marketplaceTokenData?.list.length === 0 ? (
        <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto', textAlign: 'center' }}>
          <Typography>No listed tokens</Typography>
        </Paper>
      ) : null}

      <InfiniteScroll
        dataLength={1}
        next={() => setPage((page) => page + 1)}
        hasMore={hasMore ?? false}
        loader={''}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>You have seen it all</b>
          </p>
        }
      >
        <div className={css.gridContainer}>
          {marketplaceTokenData &&
            marketplaceTokenData.list.map((item, i) => <MarketplaceTokenListItem key={i} item={item} />)}
        </div>
      </InfiniteScroll>
      <div />
    </Paper>
  )
}
