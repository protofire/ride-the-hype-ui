import { type ReactElement } from 'react'
import { Box, Divider } from '@mui/material'
import SidebarHeader from '~/components/sidebar/SidebarHeader'
import SidebarNavigation from '~/components/sidebar/SidebarNavigation'
import SidebarFooter from '~/components/sidebar/SidebarFooter'

import css from './styles.module.css'

const Sidebar = (): ReactElement => {
  return (
    <div className={css.container}>
      <div className={css.scroll}>
        <SidebarHeader />
        <SidebarNavigation />
        <Box flex={1} />

        <Divider flexItem sx={{ bgcolor: 'secondary.main' }} />

        <SidebarFooter />
      </div>
    </div>
  )
}

export default Sidebar
