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
    label: 'All Inscriptions',
    icon: <SvgIcon component={RecentIcon} inheritViewBox />,
    href: AppRoutes.allInscriptions.index,
  },
  {
    label: 'My Balance',
    icon: <SvgIcon component={PersonalIcon} inheritViewBox />,
    href: AppRoutes.wallet.ownableInsc721,
    listItemComponentProps: { divider: true },
  },
  {
    label: 'Inscribe',
    icon: <SvgIcon component={CreateIcon} inheritViewBox />,
    href: AppRoutes.create.index,
  },
]

export const allInscriptionsNavItems: NavItem[] = [
  {
    label: 'IRC-20',
    href: AppRoutes.allInscriptions.allInsc20,
  },
  {
    label: 'IRC-721',
    href: AppRoutes.allInscriptions.allInsc721,
  },
]

export const createNavItems = [
  {
    label: 'IRC-20',
    href: AppRoutes.create.insc20,
  },
  {
    label: 'IRC-721',
    href: AppRoutes.create.insc721,
  },
  {
    label: 'Custom',
    href: AppRoutes.create.custom,
  },
]

export const insc20NavItems = [
  {
    label: 'Inscribe',
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
    label: 'IRC-20',
    href: AppRoutes.wallet.ownableInsc20,
  },
  {
    label: 'IRC-721',
    href: AppRoutes.wallet.ownableInsc721,
  },
]
