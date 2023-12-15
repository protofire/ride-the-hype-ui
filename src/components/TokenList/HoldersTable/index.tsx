import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import css from './styles.module.css'
import type { EnhancedTableProps } from '~/components/common/EnhancedTable'
import EnhancedTable from '~/components/common/EnhancedTable'

const PAGE_SIZE = 10

const skeletonCells: EnhancedTableProps['rows'][0]['cells'] = {
  holder: {
    rawValue: '',
    content: (
      <Typography>
        <Skeleton width="90px" height="60px" />
      </Typography>
    ),
  },
  progress: {
    rawValue: '0.00%',
    content: (
      <Typography>
        <Skeleton width="132px" height="60px" />
      </Typography>
    ),
  },
  value: {
    rawValue: '',
    content: (
      <Typography>
        <Skeleton width="90px" height="60px" />
      </Typography>
    ),
  },
}
const skeletonRows: EnhancedTableProps['rows'] = Array(25).fill({ cells: skeletonCells })

const headCells = [
  {
    id: 'holder',
    label: 'Holder',
  },
  {
    id: 'progress',
    label: 'Progress',
  },
  {
    id: 'percentage',
    label: 'Percentage',
  },
]

interface Props {
  //fetchAPI or tokenData
}

const HoldersTable = () => {
  const error = null

  return (
    <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto' }}>
      {error ? <Typography>An error occurred during loading tokens...</Typography> : null}

      <div className={css.container}>
        <EnhancedTable rows={[]} headCells={headCells} />
      </div>
    </Paper>
  )
}

export default HoldersTable
