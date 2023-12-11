import type { Dispatch, SetStateAction } from 'react'
import { type ReactElement } from 'react'
import { IconButton, Paper } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import classnames from 'classnames'
import css from './styles.module.css'
import ConnectWallet from '~/components/common/ConnectWallet'
import { AppRoutes } from '~/config/routes'
import Link from 'next/link'
import Logo from '~/public/logo-no-text.svg'
import Navigation from './Navigation'
// import NetworkSelector from '~/components/common/NetworkSelector'

type HeaderProps = {
  onMenuToggle?: Dispatch<SetStateAction<boolean>>
  onBatchToggle?: Dispatch<SetStateAction<boolean>>
}

const Header = ({ onMenuToggle }: HeaderProps): ReactElement => {
  const handleMenuToggle = () => {
    if (onMenuToggle) {
      onMenuToggle((isOpen) => !isOpen)
    } else {
      // router.push(logoHref)
    }
  }

  return (
    <Paper className={css.container}>
      <div className={classnames(css.element, css.menuButton, !onMenuToggle ? css.hideSidebarMobile : null)}>
        <IconButton onClick={handleMenuToggle} size="large" edge="start" color="default" aria-label="menu">
          <MenuIcon />
        </IconButton>
      </div>

      <div className={classnames(css.element, css.hideMobile, css.logo)}>
        <Link href={AppRoutes.allInscriptions} passHref>
          <Logo alt="Logo" />
        </Link>
      </div>

      <div className={classnames(css.element, css.hideMobile, css.navigation)}>
        <Navigation />
      </div>

      <div className={classnames(css.element, css.connectWallet)}>
        <ConnectWallet />
      </div>

      {/*<div className={classnames(css.element, css.networkSelector)}>*/}
      {/*  <NetworkSelector />*/}
      {/*</div>*/}
    </Paper>
  )
}

export default Header
