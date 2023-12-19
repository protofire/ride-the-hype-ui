import type { ReactElement } from 'react'
import { SidebarList, SidebarListItemButton, SidebarListItemText } from '~/components/sidebar/SidebarList'
import { Avatar, ListItem } from '@mui/material'
import { SOCIALS } from '~/config/constants'
import SvgIcon from '@mui/material/SvgIcon'
import TelegramIcon from '~/public/images/telegram.svg'
import TwitterIcon from '~/public/images/x-twitter.svg'
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
            <Avatar sx={{ bgcolor: 'black', width: 30, height: 30, mr: 1 }} alt="twitter">
              <SvgIcon component={TwitterIcon} inheritViewBox />
            </Avatar>
            <SidebarListItemText bold>Twitter</SidebarListItemText>
          </SidebarListItemButton>
        </a>
      </ListItem>

      <ListItem disablePadding>
        <a target="_blank" rel="noopener noreferrer" href={SOCIALS.TELEGRAM} style={{ width: '100%' }}>
          <SidebarListItemButton>
            <Avatar sx={{ bgcolor: 'black', width: 30, height: 30, mr: 1 }} alt="telegram">
              <SvgIcon component={TelegramIcon} inheritViewBox />
            </Avatar>
            <SidebarListItemText bold>Telegram</SidebarListItemText>
          </SidebarListItemButton>
        </a>
      </ListItem>
    </SidebarList>
  )
}

export default SidebarFooter
