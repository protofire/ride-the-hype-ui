import { useState } from 'react'
import useAsync from '~/hooks/useAsync'
import { IndexerApiService } from '~/services/indexer-api'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { Skeleton, Typography } from '@mui/material'
import Link from 'next/link'
import { AppRoutes } from '~/config/routes'
import Image from 'next/image'
import InfiniteScroll from 'react-infinite-scroll-component'
import type { Inscription } from '~/services/indexer-api/types'

const limit = 12

const AllInscriptions = () => {
  const [inscriptions, setInscriptions] = useState([] as Inscription[])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(2)

  const [, error, loading] = useAsync(async () => {
    const api = IndexerApiService.getInstance()
    const data = await api.getInscriptions({ limit, order: 'desc', page: 1 })
    setInscriptions(data)
  }, [])

  const fetchInscriptions = async () => {
    const api = IndexerApiService.getInstance()
    const data = await api.getInscriptions({ limit, order: 'desc', page })
    if (data.length > 0) {
      setInscriptions((prev) => [...prev, ...data])
    } else {
      setHasMore(false)
    }
    setPage((page) => page + 1)
  }

  return (
    <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto' }}>
      {loading ? (
        <Grid container direction="row" spacing={3} mb={2}>
          {[...Array(12)].map((element, index) => (
            <Grid item lg={3} xs={6} key={`${element}-${index}`}>
              <Skeleton width="100%" height="250px" variant="rounded" />
            </Grid>
          ))}
        </Grid>
      ) : null}

      {error ? <Typography>An error occurred during loading inscriptions...</Typography> : null}

      {!loading && inscriptions !== undefined && inscriptions.length === 0 ? (
        <Typography>There is no any inscription yet.</Typography>
      ) : null}

      <InfiniteScroll dataLength={inscriptions.length} next={fetchInscriptions} hasMore={hasMore} loader={null}>
        <Grid container direction="row" spacing={3} mb={2}>
          {inscriptions.map((item) => (
            <Grid item lg={3} xs={6} key={item.id}>
              <Link href={{ pathname: AppRoutes.insc721.inscriptionDetails, query: { id: item.hash } }}>
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto' }}
                  src={item.contentType === 'application/json' ? '/images/json-file.svg' : item.content}
                  alt={item.hash}
                />
              </Link>
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
      <div />
    </Paper>
  )
}

export default AllInscriptions
