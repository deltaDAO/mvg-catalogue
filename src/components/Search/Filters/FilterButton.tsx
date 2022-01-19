import { ReactElement } from 'react'
import Box from '../../atoms/Box'
import Tooltip from '../../atoms/Tooltip'
import FilterOptions from './FilterOptions'

export default function FilterButton(): ReactElement {
  return (
    <Tooltip
      placement="bottom"
      trigger="mouseenter | focus | click"
      content={
        <Box>
          <FilterOptions type="type" sortDirections />
        </Box>
      }
    >
      <Box>Category</Box>
    </Tooltip>
  )
}
