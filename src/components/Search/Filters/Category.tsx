import { ReactElement } from 'react'
import { FilterByTypeOptions } from '../../../models/SortAndFilters'
import Box from '../../atoms/Box'
import Tooltip from '../../atoms/Tooltip'
import FilterOptions from './FilterOptions'

const serviceFilterItems = [
  { display: 'data sets', value: FilterByTypeOptions.Data },
  { display: 'algorithms', value: FilterByTypeOptions.Algorithm }
]

export default function Category(): ReactElement {
  return (
    <>
      <Tooltip
        content={
          <Box>
            <FilterOptions type="category" sortDirections />
          </Box>
        }
      >
        <Box>Category</Box>
      </Tooltip>
    </>
  )
}
