import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import type { ListItemButtonProps } from '@mui/material/ListItemButton'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { navItems } from '~/components/sidebar/SidebarNavigation/config'
import { useRouter } from 'next/router'
import type { LinkProps } from 'next/link'
import Link from 'next/link'
import type { ReactElement } from 'react'
import css from './styles.module.css'
import { Tooltip } from '@mui/material'

const getSubdirectory = (pathname: string): string => {
  return pathname.split('/')[1]
}

const NavListItemButton = ({
  href,
  children,
  ...rest
}: Omit<ListItemButtonProps, 'sx'> & { href?: LinkProps['href'] }): ReactElement => {
  const button = (
    <ListItemButton className={css.listItemButton} {...rest}>
      {children}
    </ListItemButton>
  )

  return href ? (
    <Link href={href} passHref legacyBehavior>
      {button}
    </Link>
  ) : (
    button
  )
}

const Navigation = () => {
  const router = useRouter()
  const currentSubdirectory = getSubdirectory(router.pathname)

  return (
    <List className={css.list}>
      {navItems.map((item, i) => {
        const isSelected = currentSubdirectory === getSubdirectory(item.href)

        return (
          <Tooltip key={i} title="Coming Soon" disableHoverListener={item.href !== ''}>
            <ListItem disablePadding>
              <NavListItemButton disabled={!item.href} selected={isSelected} href={{ pathname: item.href }}>
                {/* {item.icon && (
                <ListItemIcon
                  className={css.icon}
                  sx={{
                    '& svg': {
                      width: '16px',
                      height: '16px',
                      '& path': ({ palette }) => ({
                        fill: palette.logo.main,
                      }),
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              )} */}

                <ListItemText primaryTypographyProps={{ variant: 'body2', fontWeight: 700 }}>{item.label}</ListItemText>
              </NavListItemButton>
            </ListItem>
          </Tooltip>
        )
      })}
    </List>
  )
}

export default Navigation
