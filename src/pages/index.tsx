import React, { ReactElement, useState } from 'react'
import PageSearch from '../components/templates/Search'
import { PageProps } from 'gatsby'
import Page from '../components/templates/Page'
import queryString from 'query-string'
import { accountTruncate } from '../utils/web3'
import ethereumAddress from 'ethereum-address'
import { useSiteMetadata } from '../hooks/useSiteMetadata'

export default function PageGatsbySearch(props: PageProps): ReactElement {
  const { siteTitle, siteTagline } = useSiteMetadata()
  const parsed = queryString.parse(props.location.search)
  const { text, owner, tags, categories } = parsed
  const [totalResults, setTotalResults] = useState<number>()
  const [totalPagesNumber, setTotalPagesNumber] = useState<number>()

  const isETHAddress = ethereumAddress.isAddress(text as string)
  const searchValue =
    (isETHAddress ? accountTruncate(text as string) : text) ||
    tags ||
    categories
  const title = owner
    ? `Published by ${accountTruncate(owner as string)}`
    : `${
        totalResults !== undefined
          ? searchValue && searchValue !== ' '
            ? totalResults === 0
              ? 'No results'
              : totalResults +
                (totalResults > 1 ? ' results' : ' result') +
                ' for ' +
                searchValue
            : totalResults + ' results'
          : 'Searching...'
      }`

  return (
    <Page
      title={siteTitle}
      description={siteTagline}
      uri={props.uri}
      headerCenter
    >
      <h3>{title}</h3>
      <PageSearch
        location={props.location}
        setTotalResults={setTotalResults}
        setTotalPagesNumber={setTotalPagesNumber}
      />
    </Page>
  )
}
