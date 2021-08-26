import React, { ReactElement, useState, useEffect } from 'react'
import Label from '../../atoms/Input/Label'
import Tooltip from '../../atoms/Tooltip'
import { ReactComponent as Caret } from '../../../images/caret.svg'
import TagsList from '../../molecules/TagsList'
import styles from './tags.module.css'
import { addExistingParamsToUrl } from './utils'
import { navigate } from 'gatsby'

const tagsList = [
  'europe',
  'agriculture',
  'dovu',
  'ethereum',
  'gecko',
  'market',
  'cmc',
  'debt',
  'explorer',
  'co2e',
  'emissions',
  'e-commerce',
  'vinted',
  'scraping',
  'product'
]
export default function Tags({
  location
}: {
  location: Location
}): ReactElement {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
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
        <ul className={styles.tagTooltipDetails}>
          <li>
            <Label htmlFor="chains">Filter by tag</Label>
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
      className={styles.tagTooltip}
    >
      <button className={styles.tagButton}>
        <label className={styles.tagLabel}>Tags</label>
        <Caret aria-hidden="true" className={styles.caret} />
      </button>
      <div className={styles.chainsSelected}>
        {selectedTags.map((tag, index) => (
          <span className={styles.chainsSelectedIndicator} key={index} />
        ))}
      </div>
    </Tooltip>
  )
}
