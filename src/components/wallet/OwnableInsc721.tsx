import Image from 'next/image'
import Link from 'next/link'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import useWallet from '~/hooks/wallets/useWallet'
import { getBlockExplorerLink } from '~/utils/chains'
import { IndexerApiService } from '~/services/indexer-api'
import useAsync from '~/hooks/useAsync'
import { Typography } from '@mui/material'
import { useCurrentChain } from '~/hooks/useChains'

const OwnableInsc721 = () => {
  const wallet = useWallet()
  const chain = useCurrentChain()
  const [inscriptions, error, loading] = useAsync(async () => {
    if (wallet) {
      const indexerApiService = IndexerApiService.getInstance()
      return indexerApiService.getOwnableInscriptions(wallet.address)
    }
    return undefined
  }, [wallet])

  return (
    <Paper sx={{ padding: 4, maxWidth: '900px', m: '1rem auto' }}>
      {loading ? <Typography>Loading...</Typography> : null}
      {error ? <Typography>An error occurred during loading your NFTs...</Typography> : null}
      {!loading && inscriptions !== undefined && inscriptions.length === 0 ? (
        <Typography>You don&apos;t have any NFT yet.</Typography>
      ) : null}
      {!loading && inscriptions !== undefined && inscriptions.length > 0 ? (
        <Grid container direction="row" spacing={3} mb={2}>
          {inscriptions.map((item) => (
            <Grid item lg={5} xs={12} key={item.id}>
              <Link
                href={chain ? getBlockExplorerLink(chain, item.hash)?.href || '' : ''}
                target="_blank"
                rel="noopener noreferrer"
              >
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
