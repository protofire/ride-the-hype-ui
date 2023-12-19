import { useEffect, useState, type ReactElement } from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'

import css from './styles.module.css'
import SideDrawer from './SideDrawer'
import Header from '~/components/common/Header'
import useDebounce from '~/hooks/useDebounce'
import Footer from '../Footer'
import MessageHeader from '../Header/MessageHeader.tsx/messageHeader'

const PageLayout = ({ children }: { pathname: string; children: ReactElement }): ReactElement => {
  const router = useRouter()
  const [noSidebar, setNoSidebar] = useState<boolean>(false)
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const isAnimated = useDebounce(true, 300)

  useEffect(() => {
    setNoSidebar(!router.isReady)
  }, [router])
  return (
    <>
      <header className={css.header}>
        <Header onMenuToggle={noSidebar ? undefined : setSidebarOpen} />
        <MessageHeader />
      </header>

      {!noSidebar && <SideDrawer isOpen={isSidebarOpen} onToggle={setSidebarOpen} />}

      <div
        className={classnames(css.main, {
          [css.mainNoSidebar]: !isSidebarOpen,
          [css.mainAnimated]: isAnimated,
        })}
      >
        <div className={css.content}>{children}</div>

        <Footer />
      </div>
    </>
  )
}

export default PageLayout
