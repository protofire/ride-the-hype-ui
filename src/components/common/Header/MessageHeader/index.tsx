import { type ReactElement } from 'react'
import { Stack } from '@mui/material'
import css from './styles.module.css'

const MessageHeader = (text: string): ReactElement => {
  return (
    <Stack className={css.container} alignItems={'center'} direction={'row'}>
      <span className={css.bannerText}>{text} </span>
    </Stack>
  )
}

export default MessageHeader
