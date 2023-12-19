// import type { Dispatch, SetStateAction } from 'react'
import { type ReactElement } from 'react'
import { Button, Paper } from '@mui/material'
import css from './styles.module.css'
// import NetworkSelector from '~/components/common/NetworkSelector'

const MessageHeader = (): ReactElement => {
  return (
    <Paper className={css.container}>
      <span className={css.bannerText}>{'> Trusted inscriptions on Optimism Ecosystem'} </span>
      <Button size="small" className={css.bannerButton}>
        Learn More
      </Button>
    </Paper>
  )
}

export default MessageHeader
