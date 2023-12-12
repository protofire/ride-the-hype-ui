import type { ReactElement } from 'react'
import { useRouter } from 'next/router'
import css from './styles.module.css'
import { AppRoutes } from '~/config/routes'
import ExternalLink from '../ExternalLink'
/* import TelegramIcon from '~/public/images/telegram.svg'
import TwitterIcon from '~/public/images/x-twitter.svg'
import SvgIcon from '@mui/material/SvgIcon'
import { SOCIALS } from '~/config/constants' */
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'

const footerPages = [
  AppRoutes.allInscriptions,
  AppRoutes.create.insc721,
  AppRoutes.create.insc20,
  AppRoutes.create.custom,
]

const Footer = (): ReactElement | null => {
  const router = useRouter()
  const { breakpoints } = useTheme()
  const isSmallScreen = useMediaQuery(breakpoints.down('md'))

  if (!footerPages.some((path) => router.pathname.startsWith(path)) || isSmallScreen) {
    return null
  }

  return (
    <footer className={css.container}>
      <ul>
        {/* <li>
          <ExternalLink href={SOCIALS.TELEGRAM} noIcon>
            <SvgIcon component={TelegramIcon} inheritViewBox fontSize="medium" sx={{ mr: 0.5 }} />
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href={SOCIALS.TWITTER} noIcon>
            <SvgIcon component={TwitterIcon} inheritViewBox fontSize="medium" sx={{ mr: 0.5 }} />
          </ExternalLink>
        </li> */}
        {/* <li>
          <ExternalLink href="https://ecosystem.iotex.io/" noIcon sx={{ textDecoration: 'underline' }}>
            IoTeX Ecosystem
          </ExternalLink>
        </li>
        | */}
        <li>
          <ExternalLink href="https://protofire.io/" noIcon sx={{ textDecoration: 'underline' }}>
            Supported by Protofire.io
          </ExternalLink>
        </li>
      </ul>
    </footer>
  )
}

export default Footer
