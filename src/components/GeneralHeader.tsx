import type { ReactElement, ReactNode } from 'react'

import PageHeader from '~/components/common/PageHeader'
import NavTabs from '~/components/common/NavTabs'
import css from '~/components/common/PageHeader/styles.module.css'
import type { NavItem } from '~/components/sidebar/SidebarNavigation/config'

const GeneralHeader = ({
  title,
  children,
  navItems,
}: {
  title: string
  children?: ReactNode
  navItems: NavItem[] | []
}): ReactElement => {
  return (
    <PageHeader
      title={title}
      action={
        <div className={css.pageHeader}>
          <div className={css.navWrapper}>{navItems.length > 1 ? <NavTabs tabs={navItems} /> : null}</div>
          {children && <div className={css.actionsWrapper}>{children}</div>}
        </div>
      }
      titleOnly={navItems.length <= 1}
    />
  )
}

export default GeneralHeader
