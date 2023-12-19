import type { ReactElement } from 'react'
import { useRouter } from 'next/router'
import css from './styles.module.css'
import { AppRoutes } from '~/config/routes'
import ExternalLink from '../ExternalLink'
//import TelegramIcon from '~/public/images/telegram.svg'
import TwitterIcon from '~/public/images/x-twitter.svg'
import SvgIcon from '@mui/material/SvgIcon'
// import { SOCIALS } from '~/config/constants'
import { useTheme } from '@mui/material/styles'
import { Stack, useMediaQuery } from '@mui/material'

const footerPages = [AppRoutes.allInscriptions.index, AppRoutes.create.index]

const Footer = (): ReactElement | null => {
  const router = useRouter()
  const { breakpoints } = useTheme()
  const isSmallScreen = useMediaQuery(breakpoints.down('md'))

  if (!footerPages.some((path) => router.pathname.startsWith(path)) || isSmallScreen) {
    return null
  }

  return (
    <>
      <footer className={css.container}>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
          {/* <ExternalLink href={''} noIcon>
            <SvgIcon component={TelegramIcon} inheritViewBox />
          </ExternalLink> */}
          <ExternalLink href={'https://twitter.com/optiscriptions'} noIcon>
            <SvgIcon component={TwitterIcon} inheritViewBox />
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
