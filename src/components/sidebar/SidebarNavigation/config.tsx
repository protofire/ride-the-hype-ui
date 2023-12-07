import type { ReactElement } from 'react'
import React from 'react'
import { AppRoutes } from '~/config/routes'
import CreateIcon from '~/public/images/sidebar/create.svg'
import RecentIcon from '~/public/images/sidebar/recent.svg'
import PersonalIcon from '~/public/images/sidebar/personal.svg'
import { SvgIcon } from '@mui/material'
import type { ListItemProps } from '@mui/material/ListItem/ListItem'

export type NavItem = {
  label: string
  icon?: ReactElement
  href: string
  badge?: boolean
  listItemComponentProps?: ListItemProps
}

export const navItems: NavItem[] = [
  {
    label: 'Recent inscriptions',
    icon: <SvgIcon component={RecentIcon} inheritViewBox />,
    href: AppRoutes.allInscriptions,
  },
  {
    label: 'My inscriptions',
    icon: <SvgIcon component={PersonalIcon} inheritViewBox />,
    href: AppRoutes.wallet.ownableInsc721,
    listItemComponentProps: { divider: true },
  },
  {
    label: 'Create inscription',
    icon: <SvgIcon component={CreateIcon} inheritViewBox />,
    href: AppRoutes.insc721.mint,
  },
]

export const insc20NavItems = [
  {
    label: 'Create',
    href: AppRoutes.insc20.create,
  },
  {
    label: 'Mint',
    href: AppRoutes.insc20.mint,
  },
  {
    label: 'Transfer',
    href: AppRoutes.insc20.transfer,
  },
]

export const insc721NavItems = [
  {
    label: 'Mint',
    href: AppRoutes.insc721.mint,
  },
]

export const walletNavItems = [
  {
    label: 'Coins',
    href: AppRoutes.wallet.index,
  },
  {
    label: 'NFTs',
    href: AppRoutes.wallet.ownableInsc721,
  },
]
