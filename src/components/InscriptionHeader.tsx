import type { ReactElement, ReactNode } from 'react'
import PageHeader from '~/components/common/PageHeader'
import css from '~/components/common/PageHeader/styles.module.css'

const InscriptionHeader = ({ children }: { children?: ReactNode }): ReactElement => {
  return (
    <PageHeader
      title={'Inscription Overview'}
      action={
        <div className={css.pageHeader}>
          <div className={css.navWrapper}>{null}</div>
          {children && <div className={css.actionsWrapper}>{children}</div>}
        </div>
      }
    />
  )
}

export default InscriptionHeader
