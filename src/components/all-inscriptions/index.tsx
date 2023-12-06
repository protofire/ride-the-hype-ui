import useAsync from '~/hooks/useAsync'
import { IndexerApiService } from '~/services/indexer-api'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { Skeleton, Typography } from '@mui/material'
import Link from 'next/link'
import { AppRoutes } from '~/config/routes'
import Image from 'next/image'

const AllInscriptions = () => {
  const [inscriptions, error, loading] = useAsync(async () => {
    const indexerApiService = IndexerApiService.getInstance()
    return indexerApiService.getInscriptions({ limit: 50, order: 'desc', page: 1 })
  }, [])

  return (
    <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto' }}>
      {loading ? (
        <Grid container direction="row" spacing={3} mb={2}>
          {[...Array(9)].map((e) => (
            <Grid item lg={4} xs={12} key={e}>
              <Skeleton width="100%" height="150px" variant="rounded" />
            </Grid>
          ))}
        </Grid>
      ) : null}

      {error ? <Typography>An error occurred during loading inscriptions...</Typography> : null}

      {!loading && inscriptions !== undefined && inscriptions.length === 0 ? (
        <Typography>There is no any inscription yet.</Typography>
      ) : null}

      {!loading && inscriptions !== undefined && inscriptions.length > 0 ? (
        <Grid container direction="row" spacing={3} mb={2}>
          {inscriptions.map((item) => (
            <Grid item lg={4} xs={12} key={item.id}>
              <Link href={{ pathname: AppRoutes.insc721.inscriptionDetails, query: { id: item.hash } }}>
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto' }}
                  src={item.content}
                  alt={item.hash}
                />
              </Link>
            </Grid>
          ))}
        </Grid>
      ) : null}
      <div />
    </Paper>
  )
}

export default AllInscriptions
