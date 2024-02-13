import { type ReactElement, useState } from 'react'
import { useRouter } from 'next/router'
import css from './styles.module.css'
import { AppRoutes } from '~/config/routes'
import ExternalLink from '../ExternalLink'
import TelegramIcon from '~/public/images/telegram.svg'
import TwitterIcon from '~/public/images/x-twitter.svg'
import SvgIcon from '@mui/material/SvgIcon'
import { useTheme } from '@mui/material/styles'
import { Stack, useMediaQuery } from '@mui/material'
import { SOCIALS } from '~/config/constants'

const footerPages = [AppRoutes.allInscriptions.index, AppRoutes.create.index]

const Footer = (): ReactElement | null => {
  const router = useRouter()
  const { breakpoints } = useTheme()
  const isSmallScreen = useMediaQuery(breakpoints.down('md'))
  const [isScrollable, setIsScrollable] = useState(true)

  if (/*!footerPages.some((path) => router.pathname.startsWith(path)) || */ isSmallScreen) {
    return null
  }

  return (
    <>
      <footer className={css.container}>
        <Stack direction="row" justifyContent="right" alignItems="right" spacing={2}>
          <ExternalLink sx={{ bgColor: 'primary' }} href={SOCIALS.TELEGRAM} noIcon>
            <SvgIcon className={css.icon} component={TelegramIcon} inheritViewBox />
          </ExternalLink>
          <ExternalLink sx={{ bgColor: 'primary' }} href={SOCIALS.TWITTER} noIcon>
            <SvgIcon className={css.icon} component={TwitterIcon} inheritViewBox />
          </ExternalLink>
          {/* <ExternalLink color={'#000'} href="https://protofire.io/" noIcon sx={{ textDecoration: 'underline' }}>
            Supported by Protofire.io
          </ExternalLink> */}
        </Stack>
      </footer>
    </>
  )
}

export default Footer
