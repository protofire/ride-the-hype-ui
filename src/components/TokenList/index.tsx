import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { Skeleton, Typography } from '@mui/material'

import useAsync from '~/hooks/useAsync'
import type { Insc20Balance } from '~/services/indexer-api/types'
import { TokenListItem } from '~/components/TokenList/TokenListItem'
import useWallet from '~/hooks/wallets/useWallet'
import { IndexerApiService } from '~/services/indexer-api'

import css from './styles.module.css'

const PAGE_SIZE = 12

export const TokenList = () => {
  const wallet = useWallet()

  const [inscriptions, setInscriptions] = useState([] as Insc20Balance[])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)

  const [newInscriptions, error, loading] = useAsync(async () => {
    if (!!wallet) {
      const api = IndexerApiService.getInstance()
      const data = await api.tokensModule.getUserHoldings(wallet.address, { page, limit: PAGE_SIZE, order: 'desc' })

      setHasMore(!(data && data.length < PAGE_SIZE))

      return data
    }
  }, [page, wallet])

  useEffect(() => {
    setInscriptions([])
  }, [wallet])

  // Add new inscriptions to the accumulated list
  useEffect(() => {
    if (newInscriptions && newInscriptions.length > 0) {
      setInscriptions((prev) => prev.concat(newInscriptions))
    }
  }, [newInscriptions])

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

      {error ? <Typography>An error occurred during loading inscriptions...</Typography> : null}

      {!loading && inscriptions !== undefined && inscriptions.length === 0 ? (
        <Typography>There are not any inscription yet.</Typography>
      ) : null}

      <InfiniteScroll
        dataLength={inscriptions.length}
        next={() => setPage((page) => page + 1)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>You have seen it all</b>
          </p>
        }
      >
        <div className={css.gridContainer}>
          {inscriptions.map((item) => (
            <TokenListItem key={item.tokenId} item={item} />
          ))}
        </div>
      </InfiniteScroll>
      <div />
    </Paper>
  )
}
