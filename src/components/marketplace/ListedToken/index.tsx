import { useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { Skeleton, Typography } from '@mui/material'

import css from './styles.module.css'
import useWallet from '~/hooks/wallets/useWallet'
import { MarketplaceTokenListItem } from '~/components/TokenList/MarketplaceTokenListItem'
import type { MarketplaceOrder } from '~/services/indexer-api/modules/marketplace/types'
import useAsync from '~/hooks/useAsync'
import { ZERO_ADDRESS } from '~/config/constants'
import { useCurrentChain } from '~/hooks/useChains'

const PAGE_SIZE = 12

export const ListedToken = ({
  ticker,
  fetchMarketplaceDataByTick,
}: {
  ticker: string
  fetchMarketplaceDataByTick: (tick: string, page: number, limit: number) => Promise<MarketplaceOrder[]>
}) => {
  // const { balances, loading, error } = useBalances()
  const [page, setPage] = useState(1)
  const currentChain = useCurrentChain()
  const wallet = useWallet()

  const mockData: MarketplaceOrder = {
    seller: wallet?.address ?? ZERO_ADDRESS,
    creator: currentChain?.marketplace ?? ZERO_ADDRESS,
    listId: ZERO_ADDRESS,
    ticker: ticker,
    amount: '100000',
    price: '1000',
    listingTime: 1803240230,
    expirationTime: 1905832230,
    creatorFeeRate: 200,
    salt: 123456789,
  }

  const [marketplaceTokenData, error, loading] = useAsync(async () => {
    if (!!fetchMarketplaceDataByTick && !!currentChain) {
      try {
        const data = await fetchMarketplaceDataByTick(ticker, page, PAGE_SIZE)
        return data
      } catch (e) {
        console.log(e)
      }
    }
  }, [currentChain, fetchMarketplaceDataByTick, page, ticker])

  const hasMore = marketplaceTokenData && marketplaceTokenData.length % PAGE_SIZE === 0
  const visibleTokens = useMemo(() => marketplaceTokenData?.slice(0, PAGE_SIZE * page), [marketplaceTokenData, page])

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

      {error ? <Typography>An error occurred during loading balances...</Typography> : null}

      {!loading && marketplaceTokenData?.length === 0 ? (
        <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto', textAlign: 'center' }}>
          <Typography>You don&apos;t have any OSC-20 yet</Typography>
        </Paper>
      ) : null}

      <InfiniteScroll
        dataLength={visibleTokens?.length ?? 0}
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
          {visibleTokens ? (
            visibleTokens.map((item, i) => <MarketplaceTokenListItem key={i} item={item} />)
          ) : (
            <MarketplaceTokenListItem item={mockData} />
          )}
        </div>
      </InfiniteScroll>
      <div />
    </Paper>
  )
}
