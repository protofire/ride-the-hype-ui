import type { ReactElement } from 'react'
import React from 'react'
import { AppRoutes } from '~/config/routes'
import CoinIcon from '~/public/images/sidebar/coin.svg'
import { SvgIcon } from '@mui/material'

export type NavItem = {
  label: string
  icon?: ReactElement
  href: string
  badge?: boolean
}

export const navItems: NavItem[] = [
  {
    label: 'Create',
    icon: <SvgIcon component={CoinIcon} inheritViewBox />,
    href: AppRoutes.insc721.mint,
  },
  {
    label: 'My inscriptions',
    icon: <SvgIcon component={CoinIcon} inheritViewBox />,
    href: AppRoutes.wallet.ownableInsc721,
  },
  {
    label: 'All inscriptions',
    icon: <SvgIcon component={CoinIcon} inheritViewBox />,
    href: AppRoutes.allInscriptions,
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
