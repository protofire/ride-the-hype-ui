import type { ReactElement, ReactNode } from 'react'

import PageHeader from '~/components/common/PageHeader'
import NavTabs from '~/components/common/NavTabs'
import css from '~/components/common/PageHeader/styles.module.css'
import { walletNavItems } from '~/components/sidebar/SidebarNavigation/config'

const WalletHeader = ({ children }: { children?: ReactNode }): ReactElement => {
  return (
    <PageHeader
      title="Your inscriptions"
      action={
        <div className={css.pageHeader}>
          <div className={css.navWrapper}>
            <NavTabs tabs={walletNavItems} />
          </div>
          {children && <div className={css.actionsWrapper}>{children}</div>}
        </div>
      }
    />
  )
}

export default WalletHeader
