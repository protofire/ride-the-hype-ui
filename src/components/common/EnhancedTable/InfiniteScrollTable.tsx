import type { ReactNode, SetStateAction } from 'react'
import React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import classNames from 'classnames'

import css from './styles.module.css'
import { Collapse } from '@mui/material'
import InfiniteScroll from 'react-infinite-scroll-component'

type RegularCell = {
  content: ReactNode
  rawValue: string | number
  sticky?: boolean
}

type RegularRow = {
  selected?: boolean
  collapsed?: boolean
  key?: string
  cells: Record<string, RegularCell>
}

type RegularHeadCell = {
  id: string
  label: ReactNode
  width?: string
  sticky?: boolean
}

type RegularTableHeadProps = {
  headCells: RegularHeadCell[]
}

function RegularTableHead(props: RegularTableHeadProps) {
  const { headCells } = props

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding="normal"
            sx={headCell.width ? { width: headCell.width } : undefined}
            className={classNames({ sticky: headCell.sticky })}
          >
            {headCell.label && <>{headCell.label}</>}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export type RegularTableProps = {
  rows: RegularRow[]
  headCells: RegularHeadCell[]
  mobileVariant?: boolean
  infiniteScrollProps: InfiniteScrollProps
}

export type InfiniteScrollProps = {
  pageSize: number
  page: number
  hasMore: boolean
  setPage: (value: SetStateAction<number>) => void
  totalTransactions: number
}

function InfiniteScrollTable({ rows, headCells, mobileVariant, infiniteScrollProps }: RegularTableProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <InfiniteScroll
        // height={400}
        dataLength={infiniteScrollProps.pageSize * infiniteScrollProps.page}
        next={() => {
          infiniteScrollProps.setPage((page) => page + 1)
        }}
        hasMore={infiniteScrollProps.hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>You have seen it all</b>
          </p>
        }
      >
        <TableContainer component={Paper} sx={{ width: '100%', mb: 2 }}>
          <Table aria-labelledby="tableTitle" className={mobileVariant ? css.mobileColumn : undefined}>
            <RegularTableHead headCells={headCells} />
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row, index) => (
                  <TableRow
                    tabIndex={-1}
                    key={row.key ?? index}
                    selected={row.selected}
                    className={row.collapsed ? css.collapsedRow : undefined}
                  >
                    {Object.entries(row.cells).map(([key, cell]) => (
                      <TableCell
                        key={key}
                        className={classNames({
                          sticky: cell.sticky,
                          [css.collapsedCell]: row.collapsed,
                        })}
                      >
                        <Collapse key={index} in={!row.collapsed} enter={false}>
                          {cell.content}
                        </Collapse>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                // Prevent no `tbody` rows hydration error
                <TableRow>
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </InfiniteScroll>
    </Box>
  )
}

export default InfiniteScrollTable
