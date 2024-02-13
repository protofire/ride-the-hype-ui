import { Button } from '@mui/material'
import css from './styles.module.css'

const buttonConfig = [{ className: css.tabButton1 }, { className: css.tabButton2 }]
const TabsButton = ({ titles, onClick }: { titles: string[]; onClick?: (selected: number) => void }) => {
  return (
    <div>
      {titles.map((title, index) => (
        <Button
          key={index}
          color={'primary'}
          onClick={() => (onClick ? onClick(index) : console.log(index))}
          size="small"
          className={buttonConfig[index % 2].className}
        >
          {title}
        </Button>
      ))}
    </div>
  )
}

export default TabsButton
