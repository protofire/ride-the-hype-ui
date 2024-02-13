import { Box, LinearProgress, List, ListItem, ListItemText, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import EthHashInfo from '~/components/common/EthHashInfo'
import type { Insc20 } from '~/services/indexer-api/types'
import { MintButton } from '~/components/insc-20/Insc20List/MintButton'
import type { Badge } from '~/config/badgeConfig'
import { BADGE_CONFIG, retrieveKnownBadges } from '~/config/badgeConfig'
import Image from 'next/image'
import { useCurrentChain } from '~/hooks/useChains'

const listProperties = [
  {
    id: 'mintAction',
    label: 'Actions',
    action: true,
  },
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
    date: true,
  },
  {
    id: 'completedTx',
    label: 'Completed Tx Hash',
    link: true,
    nullable: true,
  },
  {
    id: 'completedAt',
    label: 'Completed At',
    nullable: true,
  },
]

export type TokenData = Insc20 & {
  badges: string[]
  progress: number
}
interface Props {
  // fetchToken: (ticker: string) => Promise<Insc20>
  tokenData?: TokenData
  loading?: boolean
  error?: Error
  ticker: string
}
const TokenOverview = ({ tokenData, ticker, loading, error }: Props) => {
  const currentChain = useCurrentChain()

  return (
    <>
      <Paper sx={{ px: '36px', maxHeight: '56vh', overflow: 'auto' }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
          <Typography color="primary" textAlign={'center'} variant="h2">
            {'$' + ticker}
          </Typography>
          {/* Known badges */}
          {currentChain &&
            retrieveKnownBadges(currentChain?.chainId, ticker).map((badge, i) => (
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
          {listProperties.map((property) => {
            if (property.nullable && tokenData && !tokenData[property.id as keyof Insc20]) {
              return null
            }
            return (
              <ListItem key={property.id} sx={{ py: 1, px: 0 }}>
                <ListItemText primary={property.label} />
                {loading ? (
                  <Skeleton width="50%" />
                ) : tokenData ? (
                  <>
                    <Typography>
                      {property.id === 'progress' ? (
                        <Stack>
                          <Typography>{`${tokenData.progress.toFixed(2)}%`}</Typography>
                          <LinearProgress variant="determinate" value={tokenData.progress} />
                        </Stack>
                      ) : property.link === true ? (
                        <EthHashInfo
                          address={(tokenData[property.id as keyof Insc20] ?? '0x0') as string}
                          shortAddress={false}
                          showPrefix={false}
                          hasExplorer
                          showCopyButton
                          avatarSize={0}
                        />
                      ) : property.action === true ? (
                        <>
                          <Box display="flex" flexDirection="row" gap={1} alignItems="center">
                            {tokenData.progress !== 100 ? (
                              <MintButton insc20={tokenData} />
                            ) : (
                              <Typography sx={{ color: `success.main` }}>Fully minted</Typography>
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
            )
          })}
        </List>

        {error ? <Typography>An error occurred when during loading token...</Typography> : null}
      </Paper>
    </>
  )
}

export default TokenOverview
