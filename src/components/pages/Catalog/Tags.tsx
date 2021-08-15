import React, { ReactElement, useState, useEffect } from 'react'
import Label from '../../atoms/Input/Label'
import Tooltip from '../../atoms/Tooltip'
import { ReactComponent as Caret } from '../../../images/caret.svg'
import TagsList from '../../molecules/TagsList'
import stylesIndex from '../../molecules/UserPreferences/index.module.css'
import styles from './Tags.module.css'
import {
  addExistingParamsToUrl,
  FilterByTypeOptions
} from '../../templates/Search/utils'
import { navigate } from 'gatsby'

const tagsList = [
  { display: 'europe', value: FilterByTypeOptions.Tag },
  { display: 'agriculture', value: FilterByTypeOptions.Tag },
  { display: 'dovu', value: FilterByTypeOptions.Tag },
  { display: 'ethereum', value: FilterByTypeOptions.Tag },
  { display: 'gecko', value: FilterByTypeOptions.Tag },
  { display: 'market', value: FilterByTypeOptions.Tag },
  { display: 'cmc', value: FilterByTypeOptions.Tag },
  { display: 'debt', value: FilterByTypeOptions.Tag },
  { display: 'explorer', value: FilterByTypeOptions.Tag },
  { display: 'co2e', value: FilterByTypeOptions.Tag },
  { display: 'emissions', value: FilterByTypeOptions.Tag },
  { display: 'e-commerce', value: FilterByTypeOptions.Tag },
  { display: 'vinted', value: FilterByTypeOptions.Tag },
  { display: 'scraping', value: FilterByTypeOptions.Tag },
  { display: 'product', value: FilterByTypeOptions.Tag }
]
export default function Tags({
  location
}: {
  location: Location
}): ReactElement {
  const [selectedTags, setSelectedTags] = useState([])
  async function startSearch(tags: string) {
    const urlEncodedValue = encodeURIComponent(tags)
    const url = await addExistingParamsToUrl(location, [
      'text',
      'owner',
      'tags'
    ])
    navigate(`${url}&text=${urlEncodedValue}`)
  }

  useEffect(() => {
    const tagList = selectedTags.join(' ')
    startSearch(tagList)
  }, [selectedTags])

  return (
    <Tooltip
      content={
        <ul className={stylesIndex.preferencesDetails}>
          <li>
            <Label htmlFor="chains">Filter by tag</Label>
            {/* <FormHelp>Filter by tag.</FormHelp> */}

            <TagsList
              title="Tags"
              tagsList={tagsList}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </li>
        </ul>
      }
      trigger="click focus"
      placement="bottom"
      className={`${stylesIndex.preferences} ${styles.networks}`}
    >
      <label>Tags</label>
      <Caret aria-hidden="true" className={stylesIndex.caret} />
      <div className={styles.chainsSelected}>
        {selectedTags.map((tag, index) => (
          <span className={styles.chainsSelectedIndicator} key={index} />
        ))}
      </div>
    </Tooltip>
  )
}
