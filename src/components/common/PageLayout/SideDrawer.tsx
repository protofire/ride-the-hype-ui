import { type ReactElement } from 'react'
import { Drawer, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import Sidebar from '~/components/sidebar/Sidebar'

type SideDrawerProps = {
  isOpen: boolean
  onToggle: (isOpen: boolean) => void
}

const SideDrawer = ({ isOpen, onToggle }: SideDrawerProps): ReactElement => {
  const { breakpoints } = useTheme()
  const isSmallScreen = useMediaQuery(breakpoints.down('md'))

  return (
    <>
      <Drawer variant="temporary" anchor="left" open={isOpen && isSmallScreen} onClose={() => onToggle(false)}>
        <aside>
          <Sidebar />
        </aside>
      </Drawer>
    </>
  )
}

export default SideDrawer
