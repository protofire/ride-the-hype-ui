import Image from 'next/image'
import Link from 'next/link'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import useWallet from '~/hooks/wallets/useWallet'
import { IndexerApiService } from '~/services/indexer-api'
import useAsync from '~/hooks/useAsync'
import { Skeleton, Typography } from '@mui/material'
import { AppRoutes } from '~/config/routes'

const OwnableInsc721 = () => {
  const wallet = useWallet()
  const [inscriptions, error, loading] = useAsync(async () => {
    if (wallet) {
      const indexerApiService = IndexerApiService.getInstance()
      return indexerApiService.getOwnableInscriptions(wallet.address, { limit: 100, order: 'desc', page: 1 })
    }
    return undefined
  }, [wallet])

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

      {error ? <Typography>An error occurred during loading your inscriptions...</Typography> : null}

      {!loading && inscriptions !== undefined && inscriptions.length === 0 ? (
        <Typography>You don&apos;t have any inscription yet.</Typography>
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

export default OwnableInsc721
