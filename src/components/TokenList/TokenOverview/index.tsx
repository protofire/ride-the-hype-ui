import { Box, LinearProgress, List, ListItem, ListItemText, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import EthHashInfo from '~/components/common/EthHashInfo'
import ContentTabs from '~/components/common/NavTabs/ContentTabs'
import useAsync from '~/hooks/useAsync'
import type { Insc20, TokenHolder, Transaction } from '~/services/indexer-api/types'
import HoldersTable from '../HoldersTable'
import TransactionsTable from '../TransactionsTable'
import { MintButton } from '~/components/insc-20/Insc20List/MintButton'
import type { Badge } from '~/config/badgeConfig'
import { BADGE_CONFIG, KNOWN_BADGES } from '~/config/badgeConfig'
import Image from 'next/image'

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
    label: 'Max per Mint',
  },
  {
    id: 'holdLimit',
    label: 'Max Mint per Address',
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
  {
    id: 'mintAction',
    label: 'Actions',
    action: true,
  },
  // {
  //   id: 'transactions',
  //   label: 'Transactions',
  // },
]

interface Props {
  fetchToken: (ticker: string) => Promise<Insc20>
  fetchHolders: (ticker: string, page: number, limit: number) => Promise<TokenHolder[]> | undefined
  fetchTransactions: (ticker: string, page: number, limit: number) => Promise<Transaction[]> | undefined
  ticker: string
}

const labels = ['holders', 'transactions']

const TokenOverview = ({ fetchToken, fetchHolders, fetchTransactions, ticker }: Props) => {
  const [tokenData, error, loading] = useAsync(async () => {
    if (!!fetchToken && !!ticker) {
      try {
        const data = await fetchToken(ticker)
        data.createdAt = new Date(Number(data.createdAt) * 1000).toLocaleString()
        const updatedObject = {
          ...data,
          progress: (Number(data.totalSupply) / Number(data.maxSupply)) * 100,
          badges: data.badge ? data.badge?.split(',') : [],
        }
        return updatedObject
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchToken, ticker])

  return (
    <>
      <Paper sx={{ padding: 8, maxWidth: '1200px', m: '1rem auto' }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
          <Typography color="primary" textAlign={'center'} variant="h2">
            {'$' + ticker}
          </Typography>
          {KNOWN_BADGES[ticker] &&
            KNOWN_BADGES[ticker].map((badge, i) => (
              <Tooltip key={i} title={BADGE_CONFIG[badge].description}>
                <Image width={40} src={BADGE_CONFIG[badge].icon} alt={''} />
              </Tooltip>
            ))}

          {/* Auto badges */}
          {tokenData?.badges &&
            tokenData?.badges.map((badge, i) => (
              <Tooltip key={i} title={BADGE_CONFIG[badge as Badge].description}>
                <Image width={40} src={BADGE_CONFIG[badge as Badge].icon} alt={''} />
              </Tooltip>
            ))}
        </Stack>

        <List disablePadding>
          {listProperties.map((property) => (
            <ListItem key={property.id} sx={{ py: 1, px: 0 }}>
              <ListItemText primary={property.label} />
              {loading ? (
                <Skeleton width="50%" />
              ) : tokenData ? (
                <>
                  <Typography fontFamily={'Inter'}>
                    {property.id === 'progress' ? (
                      <Stack>
                        <Typography>{`${tokenData.progress.toFixed(2)}%`}</Typography>
                        <LinearProgress variant="determinate" value={tokenData.progress} />
                      </Stack>
                    ) : property.link === true ? (
                      <EthHashInfo
                        address={tokenData['creatorAddress']}
                        shortAddress={false}
                        showPrefix={false}
                        hasExplorer
                        showCopyButton
                        avatarSize={0}
                      />
                    ) : property.action === true ? (
                      <>
                        <Box display="flex" flexDirection="row" gap={1} alignItems="center">
                          {Math.round((Number(tokenData.totalSupply) / Number(tokenData.maxSupply)) * 100) !== 100 ? (
                            <MintButton insc20={tokenData} />
                          ) : (
                            <Typography color="error">Fully minted</Typography>
                          )}
                        </Box>
                      </>
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

        {error ? <Typography>An error occurred when during loading token...</Typography> : null}
      </Paper>
      <ContentTabs navItems={labels}>
        <HoldersTable
          ticker={ticker ?? ''}
          fetchHolders={fetchHolders}
          totalHolders={tokenData?.holders ?? 0}
          maxSupply={tokenData?.maxSupply ?? 0}
        />
        <TransactionsTable
          ticker={ticker ?? ''}
          fetchTransactions={fetchTransactions}
          totalTransactions={tokenData?.transactions ?? 0}
        />
      </ContentTabs>
    </>
  )
}

export default TokenOverview
