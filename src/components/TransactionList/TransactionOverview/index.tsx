import { Box, Grid, ListItemText, Skeleton, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import type { Insc20, Transaction } from '~/services/indexer-api/types'
import css from './../styles.module.css'
import useAsync from '~/hooks/useAsync'
import EthHashInfo from '~/components/common/EthHashInfo'
import Link from 'next/link'

const tokenProperties = [
  {
    id: 'totalSupply',
    label: 'Total Supply',
  },
  {
    id: 'maxSupply',
    label: 'Max Supply',
  },
  {
    id: 'maxMint',
    label: 'Max Mint',
  },
]

const activityData = [
  {
    id: 'type',
    label: 'Method',
  },
  {
    id: 'from',
    label: 'Creator',
    link: true,
  },
  {
    id: 'hash',
    label: 'Hash',
    link: true,
  },
  {
    id: 'createdAt',
    label: 'Date',
  },
]
interface Props {
  fetchTransaction: (txHash: string) => Promise<Transaction>
  fetchToken: (ticker: string) => Promise<Insc20>
  hash: string
}
const TransactionOverview = ({ fetchTransaction, fetchToken, hash }: Props) => {
  const [txData, error, loading] = useAsync(async () => {
    if (!!fetchTransaction && !!hash) {
      try {
        const data = await fetchTransaction(hash)
        data.createdAt = new Date(Number(data.createdAt) * 1000).toLocaleString()
        return data
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchTransaction, hash])

  const [tokenData, tokenError, tokenLoading] = useAsync(async () => {
    if (!!fetchTransaction && !!txData) {
      try {
        const data = await fetchToken(txData.tick)
        data.createdAt = new Date(Number(data.createdAt) * 1000).toLocaleString()
        return data
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchToken, fetchTransaction, txData])

  return (
    <Grid component={Paper} container sx={{ padding: 1, maxWidth: '1200px', m: '1rem auto' }} direction="row">
      <Grid item md={4} xs={12}>
        <Typography color="primary" margin={'1rem'} variant="h3">
          {`Inscription #${txData?.id} `}
        </Typography>
        <div className={css.jsonInscriptionItem}>
          <pre>{JSON.stringify(txData?.data, null, 2)}</pre>
        </div>
      </Grid>
      <Grid item md={8} xs={12}>
        <Typography color="primary" margin={'1rem'} variant="h3">
          <Link href={`/token?ticker=${txData?.tick} `}>{`$${txData?.tick}`}</Link>
        </Typography>
        <Box className={css.infoItem}>
          <Typography color={'primary'} marginBottom={'1rem'} variant="h5">
            {'Token Data'}
          </Typography>
          <Grid container direction="row">
            {tokenProperties.map((prop, i) => {
              return (
                <Grid key={i} item md={4} xs={6}>
                  <ListItemText
                    key={i}
                    primary={prop.label}
                    secondary={
                      <Typography color="#fff">
                        {tokenLoading ? (
                          <Skeleton />
                        ) : tokenError || !tokenData ? (
                          'No Data'
                        ) : (
                          tokenData[prop.id as keyof Insc20]
                        )}
                      </Typography>
                    }
                  />
                </Grid>
              )
            })}
          </Grid>
          <Typography color={'primary'} marginY={'1rem'} variant="h5">
            {'Event Data'}
          </Typography>
          <Grid marginY={'1rem'} container direction="row">
            {activityData.map((prop, i) => {
              return (
                <Grid key={i} item md={3} xs={6}>
                  <ListItemText
                    primary={prop.label}
                    secondary={
                      <Typography color="#fff">
                        {loading ? (
                          <Skeleton />
                        ) : !txData || error ? (
                          'No data'
                        ) : prop.link ? (
                          <EthHashInfo
                            showCopyButton
                            address={txData[prop.id as keyof Transaction]}
                            showPrefix={false}
                            hasExplorer
                            avatarSize={0}
                          />
                        ) : (
                          txData[prop.id as keyof Transaction]
                        )}
                      </Typography>
                    }
                  />
                </Grid>
              )
            })}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}
export default TransactionOverview
