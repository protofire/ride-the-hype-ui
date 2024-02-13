import type { ReactElement } from 'react'
import { SidebarList, SidebarListItemButton, SidebarListItemText } from '~/components/sidebar/SidebarList'
import { ListItem } from '@mui/material'
import { SOCIALS } from '~/config/constants'
import SvgIcon from '@mui/material/SvgIcon'
import TelegramIcon from '~/public/images/telegram.svg'
import TwitterIcon from '~/public/images/x-twitter.svg'
// import GitbookIcon from '~/public/images/gitbook-docs.svg'
// import DebugToggle from '../DebugToggle'

const socials = [
  { label: 'Telegram', link: SOCIALS.TELEGRAM, icon: TelegramIcon },
  { label: 'Twitter', link: SOCIALS.TWITTER, icon: TwitterIcon },
  // { label: 'Docs', link: SOCIALS.DOCS, icon: GitbookIcon },
]

const SidebarFooter = (): ReactElement => {
  return (
    <SidebarList>
      {/*{!IS_PRODUCTION && (*/}
      {/*  <ListItem disablePadding>*/}
      {/*    <DebugToggle />*/}
      {/*  </ListItem>*/}
      {/*)}*/}
      {socials.map((s, i) => (
        <ListItem key={i} disablePadding>
          <a target="_blank" rel="noopener noreferrer" href={s.link} style={{ width: '100%' }}>
            <SidebarListItemButton>
              <SvgIcon component={s.icon} inheritViewBox />
              <SidebarListItemText bold sx={{ ml: 2 }}>
                {s.label}
              </SidebarListItemText>
            </SidebarListItemButton>
          </a>
        </ListItem>
      ))}
    </SidebarList>
  )
}

export default SidebarFooter
