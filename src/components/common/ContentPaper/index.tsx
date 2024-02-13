import type { ReactNode } from 'react'
import React, { type ReactElement } from 'react'
import css from './styles.module.css'
import PaperHeader from '~/public/images/assets/paper-header.svg'
import PaperFooter from '~/public/images/assets/paper-footer.svg'
import DeployedOn from '~/public/images/assets/deployed-on.svg'
import { Paper, Typography, useMediaQuery, useTheme } from '@mui/material'

const ContentPaper = ({ title, children }: { title?: string; children?: ReactNode }): ReactElement => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  {
    if (isMobile)
      return <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto', textAlign: 'center' }}>{children}</Paper>
  }

  return (
    <div className={css.wrap}>
      <div className={css.container}>
        <div className={css.block}>
          <Typography fontFamily={'KulimParkItalic'} className={css.header} variant="h4">
            {title ?? ''}
          </Typography>
          <PaperHeader />
        </div>
        <div className={css.imageLeft} />
        <Paper className={`${css.block} ${css.paperContent}`}>{children}</Paper>
        <div className={css.imageRight} />
        <PaperFooter className={css.block} />
        <DeployedOn className={css.deployedOn} />
      </div>
    </div>
  )
}

export default ContentPaper
