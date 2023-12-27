import type { ReactElement } from 'react'
import { useRouter } from 'next/router'
import css from './styles.module.css'
import { AppRoutes } from '~/config/routes'
import ExternalLink from '../ExternalLink'
import TelegramIcon from '~/public/images/telegram.svg'
import TwitterIcon from '~/public/images/x-twitter.svg'
import SvgIcon from '@mui/material/SvgIcon'
import { SOCIALS } from '~/config/constants'
import { useTheme } from '@mui/material/styles'
import { Box, Stack, useMediaQuery } from '@mui/material'
import Link from 'next/link'

const footerPages = [AppRoutes.allInscriptions.index, AppRoutes.create.index]

const socials = [
  { label: 'Telegram', link: SOCIALS.TELEGRAM, icon: <TelegramIcon /> },
  { label: 'Twitter', link: SOCIALS.TWITTER, icon: <TwitterIcon /> },
]

const Footer = (): ReactElement | null => {
  const router = useRouter()
  const { breakpoints } = useTheme()
  const isSmallScreen = useMediaQuery(breakpoints.down('md'))

  if (/*!footerPages.some((path) => router.pathname.startsWith(path)) ||*/ isSmallScreen) {
    return null
  }

  return (
    <>
      <Box className={css.topSection} />
      <footer className={css.container}>
        <Stack direction="row" justifyContent="center" alignContent="center" alignItems="center" spacing={2}>
          {socials.map((s, i) => (
            <SvgIcon
              key={i}
              component={Link}
              href={s.link}
              target="blank"
              inheritViewBox
              sx={{ mr: 0.5, color: '#000' }}
            >
              <div className={css.icon}>{s.icon}</div>
            </SvgIcon>
          ))}
          <ExternalLink color={'#000'} href="https://ecosystem.iotex.io/" noIcon sx={{ textDecoration: 'underline' }}>
            IoTeX Ecosystem
          </ExternalLink>
          <ExternalLink color={'#000'} href="https://protofire.io/" noIcon sx={{ textDecoration: 'underline' }}>
            Supported by Protofire.io
          </ExternalLink>
        </Stack>
      </footer>
    </>
  )
}

export default Footer
