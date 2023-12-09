import { useMemo } from 'react'
import { useRouter } from 'next/router'
import useAsync from '~/hooks/useAsync'
import { IndexerApiService } from '~/services/indexer-api'
import { Box, Skeleton, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import Image from 'next/image'
import Grid from '@mui/material/Grid'
import EthHashInfo from '~/components/common/EthHashInfo'

const MIMETYPE_JSON = 'application/json'
const INPUT_HEADER = `data:${MIMETYPE_JSON},`

const Inscription = () => {
  const router = useRouter()
  const [inscriptionDetails, error, loading] = useAsync(async () => {
    if (!router.query.id || !(typeof router.query.id === 'string')) return undefined

    const indexerApiService = IndexerApiService.getInstance()
    const tx = await indexerApiService.getTransaction(router.query.id)
    const insc = await indexerApiService.getInscriptionByHash(router.query.id)

    if (!tx || !insc) return null

    return {
      ...insc,
      tx,
    }
  }, [router.query.id])

  const json = useMemo(() => {
    if (inscriptionDetails?.contentType === MIMETYPE_JSON) {
      const str = Buffer.from(inscriptionDetails.content.split('base64,')[1], 'base64').toString('ascii')
      try {
        return JSON.stringify(JSON.parse(str.slice(INPUT_HEADER.length)), null, 2)
      } catch {
        return 'Invalid JSON content'
      }
    }
  }, [inscriptionDetails])

  if (loading) return <Skeleton width="100%" height="10px" variant="rounded" />

  return (
    <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto' }}>
      {error ? (
        <Typography>An error occurred during loading this inscription by hash {router.query.id}</Typography>
      ) : null}

      {!loading && inscriptionDetails === null ? <Typography>{router.query.id} not found.</Typography> : null}

      {!loading && inscriptionDetails ? (
        <Grid container direction="row" spacing={3} mb={2}>
          <Grid item lg={5} xs={12}>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
              src={
                inscriptionDetails.contentType === 'application/json'
                  ? '/images/json-file.svg'
                  : inscriptionDetails.content
              }
              alt={inscriptionDetails.hash}
            />
          </Grid>

          <Grid item lg={7} xs={12}>
            <Typography gutterBottom variant="h3" component="div">
              Inscriptions #{inscriptionDetails.id}
            </Typography>

            <Box display="flex">
              <Typography component="div" marginRight=".3rem">
                Created at
              </Typography>
              <EthHashInfo address={inscriptionDetails.hash} hasExplorer showAvatar={false} showCopyButton />
            </Box>

            <Typography variant="body2" color="text.secondary">
              <pre>
                {JSON.stringify(
                  {
                    creator: inscriptionDetails.creator,
                    currentOwner: inscriptionDetails.owner,
                    createdAt: new Date(inscriptionDetails.createdAt).toLocaleString(),
                    blockNumber: inscriptionDetails.tx.blockNumber,
                    contentType: inscriptionDetails.tx.data?.[`content-type`],
                  },
                  null,
                  2,
                )}
              </pre>
            </Typography>
          </Grid>

          {inscriptionDetails.contentType === 'application/json' ? (
            <Grid item>
              <Typography component="div" marginRight=".3rem">
                File content:
              </Typography>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{json}</pre>
            </Grid>
          ) : null}
        </Grid>
      ) : null}
      <div />
    </Paper>
  )
}

export default Inscription
