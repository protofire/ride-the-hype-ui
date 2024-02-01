import React, { type ReactElement } from 'react'
import { useRouter } from 'next/router'
import ListItem from '@mui/material/ListItem'

import {
  SidebarList,
  SidebarListItemButton,
  SidebarListItemIcon,
  // SidebarListItemIcon,
  SidebarListItemText,
} from '~/components/sidebar/SidebarList'
import { navItems } from './config'

const getSubdirectory = (pathname: string): string => {
  return pathname.split('/')[1]
}

const Navigation = (): ReactElement => {
  const router = useRouter()
  const currentSubdirectory = getSubdirectory(router.pathname)

  return (
    <SidebarList>
      {navItems.map((item) => {
        const isSelected = currentSubdirectory === getSubdirectory(item.href)

        return (
          <ListItem key={item.href} disablePadding selected={isSelected} {...item.listItemComponentProps}>
            <SidebarListItemButton disabled={!item.href} selected={isSelected} href={{ pathname: item.href }}>
              {item.icon && (
                <SidebarListItemIcon
                  sx={{
                    '& svg': {
                      // width: '16px',
                      // height: '16px',
                      '& path': ({ palette }) => ({
                        fill: palette.primary.main,
                      }),
                    },
                  }}
                  badge={item.badge}
                >
                  {item.icon}
                </SidebarListItemIcon>
              )}
              <SidebarListItemText bold>{item.label}</SidebarListItemText>
            </SidebarListItemButton>
          </ListItem>
        )
      })}
    </SidebarList>
  )
}

export default React.memo(Navigation)
