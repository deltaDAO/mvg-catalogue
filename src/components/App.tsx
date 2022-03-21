import Head from 'next/head'
import { ReactElement, ReactNode } from 'react'
import { useSiteMetadata } from '../hooks/UseSiteMetadata'
import PricesProvider from '../providers/Prices'
import UrqlClientProvider from '../providers/UrqlProvider'
import { UserPreferencesProvider } from '../providers/UserPreferences'
import Styles from '../styles/Styles'
import Navbar from './molecules/Navbar'

export default function App({
  children
}: {
  children: ReactNode
}): ReactElement {
  const { site } = useSiteMetadata()

  return (
    <UrqlClientProvider>
      <UserPreferencesProvider>
        <PricesProvider>
          <Styles>
            <Head>
              <title>{site.title}</title>
              <meta name="description" content={site.description} />
              <link rel="icon" href={site.siteIcon} />
            </Head>

            <div>
              <Navbar />
              <main>{children}</main>
            </div>
          </Styles>
        </PricesProvider>
      </UserPreferencesProvider>
    </UrqlClientProvider>
  )
}
