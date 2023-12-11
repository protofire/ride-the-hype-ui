import type { ReactElement } from 'react'
import { SidebarList, SidebarListItemButton, SidebarListItemText } from '~/components/sidebar/SidebarList'
import { ListItem } from '@mui/material'
import { SOCIALS } from '~/config/constants'
import TwitterIcon from '~/public/images/x-twitter.svg'
import SvgIcon from '@mui/material/SvgIcon'
import TelegramIcon from '~/public/images/telegram.svg'
// import DebugToggle from '../DebugToggle'

const SidebarFooter = (): ReactElement => {
  return (
    <SidebarList>
      {/*{!IS_PRODUCTION && (*/}
      {/*  <ListItem disablePadding>*/}
      {/*    <DebugToggle />*/}
      {/*  </ListItem>*/}
      {/*)}*/}

      <ListItem disablePadding>
        <a target="_blank" rel="noopener noreferrer" href={SOCIALS.TWITTER} style={{ width: '100%' }}>
          <SidebarListItemButton>
            <SvgIcon component={TwitterIcon} inheritViewBox fontSize="small" sx={{ mr: 1 }} />
            <SidebarListItemText bold>Twitter</SidebarListItemText>
          </SidebarListItemButton>
        </a>
      </ListItem>

      <ListItem disablePadding>
        <a target="_blank" rel="noopener noreferrer" href={SOCIALS.TELEGRAM} style={{ width: '100%' }}>
          <SidebarListItemButton>
            <SvgIcon component={TelegramIcon} inheritViewBox fontSize="medium" sx={{ mr: 1 }} />
            <SidebarListItemText bold>Telegram</SidebarListItemText>
          </SidebarListItemButton>
        </a>
      </ListItem>
    </SidebarList>
  )
}

export default SidebarFooter
