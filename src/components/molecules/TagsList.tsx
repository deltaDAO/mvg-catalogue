import React, { ReactElement } from 'react'
import TagItem from './TagItem'
import styles from './TagsList.module.css'

export default function TagsList({
  title,
  tagsList,
  selectedTags,
  setSelectedTags
}: {
  title: string
  tagsList: { display: string; value: string }[]
  selectedTags: string[]
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
}): ReactElement {
  const content = tagsList.map((e, index) => (
    <TagItem
      key={index}
      name={e.display}
      selectedTags={selectedTags}
      setSelectedTags={setSelectedTags}
    />
  ))

  return (
    <>
      <h4 className={styles.titleGroup}>{title}</h4>
      <div className={styles.networks}>{content}</div>
    </>
  )
}
