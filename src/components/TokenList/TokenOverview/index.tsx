import { List, ListItem, ListItemText, Skeleton, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import EthHashInfo from '~/components/common/EthHashInfo'
import useAsync from '~/hooks/useAsync'
import type { Insc20 } from '~/services/indexer-api/types'

const listProperties = [
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
  {
    id: 'progress',
    label: 'Progress',
  },
  {
    id: 'decimals',
    label: 'Decimals',
  },
  {
    id: 'creatorAddress',
    label: 'Deployed By',
    link: true,
  },
  {
    id: 'createdAt',
    label: 'Deploy Time',
  },
  // {
  //   id: 'holders',
  //   label: 'Holders',
  // },
  // {
  //   id: 'transactions',
  //   label: 'Transactions',
  // },
]

interface Props {
  fetchToken: (ticker: string) => Promise<Insc20>
  ticker: string
}

const TokenOverview = ({ fetchToken, ticker }: Props) => {
  const [tokenData, error, loading] = useAsync(async () => {
    if (!!fetchToken && !!ticker) {
      try {
        const data = await fetchToken(ticker)
        return data
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchToken, ticker])

  return (
    <Paper sx={{ padding: 8, maxWidth: '1200px', m: '1rem auto' }}>
      <Typography color="secondary" textAlign={'center'} variant="h2">
        {'$' + ticker}
      </Typography>
      <List disablePadding>
        {listProperties.map((property) => (
          <ListItem key={property.id} sx={{ py: 1, px: 0 }}>
            <ListItemText primary={property.label} />
            {loading ? (
              <Skeleton width="50%" />
            ) : tokenData ? (
              <>
                <Typography color="secondary" fontFamily={'Inter'} fontSize={'18px'} variant="body2">
                  {property.id === 'progress' ? (
                    `${Math.round((Number(tokenData.totalSupply) / Number(tokenData.maxSupply)) * 100)}%`
                  ) : property.id === 'createdAt' ? (
                    new Date(Number(tokenData[property.id]) * 1000).toLocaleString()
                  ) : property.link === true ? (
                    <EthHashInfo address={tokenData['creatorAddress']} showPrefix={false} hasExplorer avatarSize={0} />
                  ) : (
                    tokenData[property.id as keyof Insc20]
                  )}
                </Typography>
              </>
            ) : (
              <Typography color="secondary">No data available</Typography>
            )}
          </ListItem>
        ))}
      </List>
      {/* <Button fullWidth>Mint</Button> */}
      {error ? <Typography>An error occurred when during loading token...</Typography> : null}
    </Paper>
  )
}

export default TokenOverview
