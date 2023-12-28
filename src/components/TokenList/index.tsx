import { useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { Box, Skeleton, Typography } from '@mui/material'

import { TokenListItem } from '~/components/TokenList/TokenListItem'
import useBalances from '~/hooks/useBalances'

import css from './styles.module.css'
import useWallet from '~/hooks/wallets/useWallet'
import ConnectWallet from '../common/ConnectWallet'

const PAGE_SIZE = 12

export const TokenList = () => {
  const { balances, loading, error } = useBalances()
  const [page, setPage] = useState(1)
  const wallet = useWallet()

  const visibleBalances = useMemo(() => balances.insc20s.slice(0, PAGE_SIZE * page), [balances.insc20s, page])
  const hasMore = visibleBalances.length % PAGE_SIZE === 0

  if (!wallet || !wallet.address)
    return (
      <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto', textAlign: 'center' }}>
        <Typography>Please connect your wallet to see your tokens</Typography>
        <Box display="flex" justifyContent="center" sx={{ pt: '10px' }}>
          <ConnectWallet />
        </Box>
      </Paper>
    )

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

      {!loading && balances.insc20s.length === 0 ? (
        <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto', textAlign: 'center' }}>
          <Typography>You don&apos;t have any OSC-20 yet</Typography>
        </Paper>
      ) : null}

      <InfiniteScroll
        dataLength={visibleBalances.length}
        next={() => setPage((page) => page + 1)}
        hasMore={hasMore}
        loader={''}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>You have seen it all</b>
          </p>
        }
      >
        <div className={css.gridContainer}>
          {visibleBalances.map((item) => (
            <TokenListItem key={item.tokenId} item={item} />
          ))}
        </div>
      </InfiniteScroll>
      <div />
    </Paper>
  )
}
