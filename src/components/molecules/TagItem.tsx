import React, { ChangeEvent, ReactElement } from 'react'
import { removeItemFromArray } from '../../utils'
import styles from './TagItem.module.css'

export default function TagItem({
  name,
  selectedTags,
  setSelectedTags
}: {
  name: string
  selectedTags: string[]
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
}): ReactElement {
  function handleTagSelection(e: ChangeEvent<HTMLInputElement>) {
    const { checked, name } = e.target
    if (!checked) {
      setSelectedTags([...removeItemFromArray(selectedTags, name)])
    } else {
      setSelectedTags([...selectedTags, name])
    }
  }

  return (
    <div className={styles.radioWrap} /* key={chainId} */>
      <label className={styles.radioLabel} /* htmlFor={`opt-${chainId}`} */>
        <input
          className={styles.input}
          // id={`opt-${chainId}`}
          type="checkbox"
          name={name}
          // value={chainId}
          onChange={handleTagSelection}
          defaultChecked={selectedTags.includes(name)}
        />
        {/* <NetworkName key={chainId} networkId={chainId} /> */}
        <span className={styles.name}>{name}</span>
      </label>
    </div>
  )
}
