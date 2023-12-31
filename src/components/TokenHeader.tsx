import type { ReactElement, ReactNode } from 'react'
import PageHeader from '~/components/common/PageHeader'
import css from '~/components/common/PageHeader/styles.module.css'

const TokenHeader = ({ children, ticker }: { children?: ReactNode; ticker: string }): ReactElement => {
  return (
    <PageHeader
      title={ticker + ' Token Overview'}
      action={
        <div className={css.pageHeader}>
          <div className={css.navWrapper}>{null}</div>
          {children && <div className={css.actionsWrapper}>{children}</div>}
        </div>
      }
    />
  )
}

export default TokenHeader
