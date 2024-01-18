import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import RefreshIcon from '@mui/icons-material/Refresh'
import { FormControl, FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import type { Insc20 } from '~/services/indexer-api/types'
import useAsync from '~/hooks/useAsync'
import type { EnhancedTableProps } from '~/components/common/EnhancedTable'
import EnhancedTable from '~/components/common/EnhancedTable'
import { AppRoutes } from '~/config/routes'
import { IndexerApiService } from '~/services/indexer-api'
import { Insc20Filter } from '~/types'

import { MintButton } from './MintButton'
import css from './styles.module.css'
import type { Badge } from '~/config/badgeConfig'
import { BADGE_CONFIG, KNOWN_BADGES } from '~/config/badgeConfig'
import { Tooltip } from '@mui/material'

import Image from 'next/image'
import EthHashInfo from '~/components/common/EthHashInfo'
import { useCurrentChain } from '~/hooks/useChains'

const PAGE_SIZE = 100

const skeletonCells: EnhancedTableProps['rows'][0]['cells'] = {
  tick: {
    rawValue: '...',
    content: (
      <div className={css.token}>
        <Typography>
          <Skeleton width="80px" height="40px" />
        </Typography>
      </div>
    ),
  },
  createdAt: {
    rawValue: '',
    content: (
      <Typography>
        <Skeleton width="132px" height="40px" />
      </Typography>
    ),
  },
  progress: {
    rawValue: '0.00%',
    content: (
      <Typography>
        <Skeleton width="132px" height="40px" />
      </Typography>
    ),
  },
  holders: {
    rawValue: '',
    content: (
      <Typography>
        <Skeleton width="90px" height="40px" />
      </Typography>
    ),
  },
  transactions: {
    rawValue: '',
    content: (
      <Typography>
        <Skeleton width="90px" height="40px" />
      </Typography>
    ),
  },
  actions: {
    rawValue: '',
    sticky: true,
    content: <div></div>,
  },
}
const skeletonRows: EnhancedTableProps['rows'] = Array(5).fill({ cells: skeletonCells })

const headCells = [
  {
    id: 'tick',
    label: 'Ticker',
    width: '15%',
  },
  {
    id: 'createdAt',
    label: 'Deploy time',
    width: '25%',
  },
  {
    id: 'progress',
    label: 'Progress',
    width: '25%',
  },
  {
    id: 'holders',
    label: 'Holders',
    width: '10%',
  },
  {
    id: 'transactions',
    label: 'Transactions',
    width: '10%',
  },
  {
    id: 'actions',
    label: '',
    width: '15%',
    sticky: true,
  },
]

type EnhancedInsc20 = Insc20 & {
  badges: string[]
}

const Insc20List = () => {
  const [counter, setCounter] = useState<number>(0)
  // const [tokens, setTokens] = useState([] as Insc20[])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)

  const [filter, setFilter] = useState<Insc20Filter>(Insc20Filter.ALL)

  const currentChain = useCurrentChain()

  const [tokens, error, loading] = useAsync(async () => {
    const indexerApiService = IndexerApiService.getInstance(currentChain)
    let finalData: EnhancedInsc20[] | [] = []
    let i = 1
    let loadedAll = false

    while (!loadedAll) {
      const data = await indexerApiService.tokensModule.getAllInsc20({
        page: i, //TODO: switch to state when server side rendering will be available
        limit: PAGE_SIZE,
        order: 'desc',
        mintingStatus: filter,
      })
      const dataWithBadges: EnhancedInsc20[] | [] = data
        ? data.map((token) => ({
            ...token,
            badges: token.badge ? token.badge?.split(',') : [],
          }))
        : []
      finalData = [...finalData, ...dataWithBadges]
      i++
      loadedAll = data && data.length < PAGE_SIZE
    }

    return finalData
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, counter, filter, currentChain])

  // Add new tokens to the accumulated list
  // useEffect(() => {
  //   if (newTokens && newTokens.length > 0) {
  //     setTokens((prev) => prev.concat(newTokens))
  //   }
  // }, [newTokens])

  const refresh = () => {
    // setTokens([])
    setHasMore(true)
    setPage(1)
    setCounter((prevState) => prevState + 1)
  }

  useEffect(() => {
    if (filter) {
      // setTokens([])
      setPage(1)
      setHasMore(true)
    }
  }, [filter])

  const handleChangeFilter = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value as Insc20Filter)
  }

  const rows = loading
    ? skeletonRows
    : (tokens || []).map((item) => {
        const progressValue = item.progress ? +(+item.progress * 100).toFixed(2) : 0
        const createdAtDate = new Date(Number(item.createdAt) * 1000)

        return {
          key: item.id,
          href: AppRoutes.token.index + `?ticker=${item.tick}`,
          cells: {
            tick: {
              rawValue: item.tick,
              content: (
                <Stack direction="row" alignContent={'center'} alignItems={'center'} spacing={1}>
                  <Typography>{item.tick}</Typography>
                  {/* Known badges */}
                  {KNOWN_BADGES[item.tick] &&
                    KNOWN_BADGES[item.tick].map((badge, i) => (
                      <Tooltip key={i} title={BADGE_CONFIG[badge].description}>
                        <Image width={40} src={BADGE_CONFIG[badge].icon} alt={''} />
                      </Tooltip>
                    ))}
                  {/* Auto badges */}
                  {item?.badges &&
                    item?.badges.map((badge, i) => (
                      <Tooltip key={i} title={BADGE_CONFIG[badge as Badge].description}>
                        <Image width={40} src={BADGE_CONFIG[badge as Badge].icon} alt={''} />
                      </Tooltip>
                    ))}
                  {/* {BADGE_CONFIG[item.badge as Badge] && (
                    <Tooltip title={BADGE_CONFIG[item.badge as Badge].description}>
                      <Image width={20} src={BADGE_CONFIG[item.badge as Badge].icon} alt={''} />
                    </Tooltip>
                  )} */}
                </Stack>
              ),
            },
            createdAt: {
              rawValue: createdAtDate.getTime(),
              content: <Typography>{createdAtDate.toLocaleString()}</Typography>,
            },
            progress: {
              rawValue: progressValue,
              content: (
                <Box display="flex" alignItems="center">
                  <Box width="100%" mr={1}>
                    <LinearProgress variant="determinate" value={progressValue} />
                  </Box>
                  <Box minWidth={35}>
                    <Typography variant="body2" color="textSecondary">
                      {`${progressValue}%`}
                    </Typography>
                  </Box>
                </Box>
              ),
            },
            holders: {
              rawValue: item.holders,
              content: <Typography>{item.holders}</Typography>,
            },
            transactions: {
              rawValue: item.transactions,
              content: <Typography>{item.transactions}</Typography>,
            },
            actions: {
              rawValue: '',
              sticky: true,
              content: (
                <Box display="flex" flexDirection="row" gap={1} alignItems="center">
                  {progressValue !== 100 ? (
                    <MintButton insc20={item} />
                  ) : (
                    <Typography color="error">
                      Fully minted at
                      {item.completedTx && <EthHashInfo address={item.completedTx} hasExplorer avatarSize={0} />}
                    </Typography>
                  )}
                </Box>
              ),
            },
          },
        }
      })

  return (
    <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto' }}>
      <div className={css.actionButtonsContainer}>
        <FormControl>
          <RadioGroup
            row
            sx={{ ml: '1rem' }}
            name="actions-radio-buttons-group"
            value={filter}
            onChange={handleChangeFilter}
          >
            <FormControlLabel value={Insc20Filter.ALL} control={<Radio />} label="All" />
            <FormControlLabel value={Insc20Filter.IN_PROGRESS} control={<Radio />} label="In progress" />
            <FormControlLabel value={Insc20Filter.COMPLETED} control={<Radio />} label="Completed" />
          </RadioGroup>
        </FormControl>

        <Button variant="text" onClick={refresh} size="small" endIcon={<RefreshIcon />}>
          Refresh
        </Button>
      </div>

      {error ? <Typography>An error occurred during loading tokens...</Typography> : null}

      <div className={css.container}>
        <EnhancedTable rows={rows} headCells={headCells} defaultSortField="holders" />
      </div>
    </Paper>
  )
}

export default Insc20List
