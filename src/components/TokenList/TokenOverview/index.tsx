import { List, ListItem, ListItemText, Skeleton, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { useRouter } from 'next/router'
import { useState } from 'react'
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
  },
  {
    id: 'createdAt',
    label: 'Created At',
  },
  {
    id: 'holders',
    label: 'Holders',
  },
  {
    id: 'transactions',
    label: 'Transactions',
  },
]

interface Props {
  fetchToken: (ticker: string) => Promise<Insc20>
  ticker: string
}

const TokenOverview = ({ fetchToken, ticker }: Props) => {
  const router = useRouter()

  const [token, setToken] = useState([] as Insc20[])
  const [hasMore, setHasMore] = useState(false)
  const [progressValue, setProgressValue] = useState(0)

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
    <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto' }}>
      <List disablePadding>
        {listProperties.map((property) => (
          <ListItem key={property.id} sx={{ py: 1, px: 0 }}>
            <ListItemText primary={property.label} />
            {loading ? (
              <Skeleton width="50%" />
            ) : tokenData ? (
              <Typography color="secondary" variant="body2">
                {property.id === 'progress'
                  ? `${Math.round((Number(tokenData.totalSupply) / Number(tokenData.maxSupply)) * 100)}%`
                  : property.id === 'createdAt'
                  ? new Date(Number(tokenData[property.id]) * 1000).toLocaleString()
                  : tokenData[property.id as keyof Insc20]}
              </Typography>
            ) : (
              <Typography color="secondary">No data available</Typography>
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default TokenOverview
