import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { Skeleton, Typography } from '@mui/material'

import css from './styles.module.css'
import { MarketplaceTokenListItem } from '~/components/TokenList/MarketplaceTokenListItem'
import type { MarketplaceOrderExtended, MarketplaceOrderList } from '~/services/indexer-api/modules/marketplace/types'
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
  const [hasMore, setHasMore] = useState(false)
  const [listedTokens, setListedTokens] = useState([] as MarketplaceOrderExtended[])

  const [marketplaceTokenData, error, loading] = useAsync(async () => {
    if (!!fetchMarketplaceOrdersData) {
      try {
        const data = await fetchMarketplaceOrdersData({ tick, page, limit: PAGE_SIZE, status: OrderStatus.LISTED })
        setListedTokens((prev) => prev.concat(data.list as MarketplaceOrderExtended[]))
        setHasMore(!(data.list && data.list.length < PAGE_SIZE))
        return data
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchMarketplaceOrdersData, page, tick])

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

      {!loading && marketplaceTokenData?.count === 0 ? (
        <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto', textAlign: 'center' }}>
          <Typography>No listed tokens</Typography>
        </Paper>
      ) : null}

      <InfiniteScroll
        dataLength={PAGE_SIZE * page}
        next={() => {
          setPage((page) => page + 1)
        }}
        hasMore={hasMore}
        loader={''}
        // endMessage={
        //   <p style={{ textAlign: 'center' }}>
        //     <b>You have seen it all</b>
        //   </p>
        // }
      >
        <div className={css.gridContainer}>
          {listedTokens && listedTokens.map((item, i) => <MarketplaceTokenListItem key={i} item={item} />)}
        </div>
      </InfiniteScroll>
      <div />
    </Paper>
  )
}
