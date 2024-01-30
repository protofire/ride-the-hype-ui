import type { ReactElement } from 'react'
import React, { useState, useEffect } from 'react'
import { Stack, Box, CircularProgress, useMediaQuery, useTheme, Typography } from '@mui/material'
import css from './styles.module.css'

const LAUNCH_TIMESTAMP = 1706778000000

const MobileCountdownTimer = (): ReactElement => {
  const [timeRemaining, setTimeRemaining] = useState<number>(1)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    const calculateTimeRemaining = (): number => {
      const date = new Date()
      const currentTimestamp = Math.floor(date.getTime())
      return LAUNCH_TIMESTAMP - currentTimestamp
    }

    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const formatTime = (ms: number) => {
    const formattedTime = [
      { label: 'days', value: Math.floor(ms / (1000 * 60 * 60 * 24)) },
      { label: 'hours', value: Math.floor(ms / (1000 * 60 * 60)) % 24 },
      { label: 'minutes', value: Math.floor(ms / (1000 * 60)) % 60 },
      { label: 'seconds', value: Math.floor(ms / 1000) % 60 },
    ]
    return formattedTime.map((item, i) => (
      <Stack key={i} alignItems={'center'} alignContent={'center'} justifyContent={'center'}>
        <Box className={css.bannerDigit}>
          {ms === 1 ? <CircularProgress size="1rem" color="inherit" /> : `${item.value < 10 ? '0' : ''}${item.value}`}
        </Box>
        <span className={css.digitText}>{item.label}</span>
      </Stack>
    ))
  }
  const text = timeRemaining ? '> Marketplace is Launching Soon!' : 'Marketplace Has Been Launched!'

  return isMobile ? (
    <>
      <Stack direction="row" spacing={2} justifyContent={'center'} justifyItems={'center'}>
        {timeRemaining > 0 && formatTime(timeRemaining)}
      </Stack>
      <Typography color="secondary" align="center" fontSize={'10px'}>
        {text}{' '}
      </Typography>
    </>
  ) : (
    <></>
  )
}

export default MobileCountdownTimer
