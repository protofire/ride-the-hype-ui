import type { ReactElement } from 'react'
import { useRouter } from 'next/router'
import css from './styles.module.css'
import TelegramIcon from '~/public/images/telegram.svg'
import TwitterIcon from '~/public/images/x-twitter.svg'
import GitbookIcon from '~/public/images/gitbook-docs.svg'
import SvgIcon from '@mui/material/SvgIcon'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import { SOCIALS } from '~/config/constants'
import ExternalLink from '../../ExternalLink'

const socials = [
  { label: 'Telegram', link: SOCIALS.TELEGRAM, icon: TelegramIcon },
  { label: 'Twitter', link: SOCIALS.TWITTER, icon: TwitterIcon },
  { label: 'Docs', link: SOCIALS.DOCS, icon: GitbookIcon },
]

const FloatingButtonsFooter = (): ReactElement | null => {
  const router = useRouter()
  const { breakpoints } = useTheme()
  const isSmallScreen = useMediaQuery(breakpoints.down('md'))

  if (/*!footerPages.some((path) => router.pathname.startsWith(path)) || */ isSmallScreen) {
    return null
  }

  return (
    <div className={css.fabContainer}>
      {socials.map((s, i) => (
        <ExternalLink key={i} sx={{ bgColor: 'black' }} href={s.link} noIcon>
          <SvgIcon className={css.icon} component={s.icon} inheritViewBox />
        </ExternalLink>
      ))}
    </div>
  )
}

export default FloatingButtonsFooter
