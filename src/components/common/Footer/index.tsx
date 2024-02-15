import { type ReactElement, useState } from 'react'
import { useRouter } from 'next/router'
import css from './styles.module.css'
import ExternalLink from '../ExternalLink'
import TwitterIcon from '~/public/images/x-twitter.svg'
import SvgIcon from '@mui/material/SvgIcon'
import { useTheme } from '@mui/material/styles'
import { Stack, useMediaQuery } from '@mui/material'
import { SOCIALS } from '~/config/constants'

const socials = [
  // { label: 'Telegram', link: SOCIALS.TELEGRAM, icon: TelegramIcon },
  { label: 'Twitter', link: SOCIALS.TWITTER, icon: TwitterIcon },
  // { label: 'Docs', link: SOCIALS.DOCS, icon: GitbookIcon },
]

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
          {socials.map((s, i) => (
            <ExternalLink key={i} sx={{ bgColor: 'primary' }} href={s.link} noIcon>
              <SvgIcon className={css.icon} component={s.icon} inheritViewBox />
            </ExternalLink>
          ))}

          {/* <ExternalLink sx={{ bgColor: 'primary' }} href={SOCIALS.TWITTER} noIcon>
            <SvgIcon className={css.icon} component={TwitterIcon} inheritViewBox />
          </ExternalLink> */}
          {/* <ExternalLink color={'#000'} href="https://protofire.io/" noIcon sx={{ textDecoration: 'underline' }}>
            Supported by Protofire.io
          </ExternalLink> */}
        </Stack>
      </footer>
    </>
  )
}

export default Footer
