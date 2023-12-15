import type { ReactElement } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import classNames from 'classnames'

import css from './styles.module.css'

const PageHeader = ({
  title,
  action,
  noBorder = true,
  titleOnly = true,
}: {
  title: string
  action?: ReactElement
  noBorder?: boolean
  titleOnly?: boolean
}): ReactElement => {
  return (
    <Box className={classNames(css.container, { [css.border]: !noBorder })}>
      {titleOnly ? (
        <Typography variant="h3" className={css.title}>
          {title}
        </Typography>
      ) : (
        <>
          <Grid container direction="row" justifyContent="center" alignItems="center">
            <Grid item md={5} xs={12}>
              <Typography variant="h3" className={css.titleTabs}>
                {title}
              </Typography>
            </Grid>

            <Grid alignContent={'center'} item md={7} xs={12}>
              {action}
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  )
}

export default PageHeader
