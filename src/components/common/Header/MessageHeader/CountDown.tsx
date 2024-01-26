import type { ReactElement } from 'react'
import React, { useState, useEffect } from 'react'
import { Stack, Box } from '@mui/material'
import css from './styles.module.css'

const LAUNCH_TIMESTAMP = 1706778000000

const CountdownTimer = (): ReactElement => {
  const [timeRemaining, setTimeRemaining] = useState<number>(2)

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

  const formatTime = (milliseconds: number) => {
    const formattedTime = [
      { label: 'days', value: Math.floor(milliseconds / (1000 * 60 * 60 * 24)) },
      { label: 'hours', value: Math.floor(milliseconds / (1000 * 60 * 60)) % 24 },
      { label: 'minutes', value: Math.floor(milliseconds / (1000 * 60)) % 60 },
      { label: 'seconds', value: Math.floor(milliseconds / 1000) % 60 },
    ]
    return formattedTime.map((item, i) => (
      <Stack key={i} alignItems={'center'} alignContent={'center'} justifyContent={'center'}>
        <Box className={css.bannerDigit}>{`${item.value < 10 ? '0' : ''}${item.value}`}</Box>
        <span className={css.digitText}>{item.label}</span>
      </Stack>
    ))
  }
  const text = timeRemaining ? '> Marketplace is Launching Soon!' : 'Marketplace Has Been Launched!'

  return (
    <Stack className={css.container} alignItems={'center'} direction={'row'}>
      <span className={css.bannerText}>{text} </span>
      <Stack direction="row" spacing={2}>
        {timeRemaining && formatTime(timeRemaining)}
      </Stack>
    </Stack>
  )
}

export default CountdownTimer
