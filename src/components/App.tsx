import Head from 'next/head'
import { ReactElement, ReactNode } from 'react'
import { useSiteMetadata } from '../hooks/UseSiteMetadata'
import Navbar from './molecules/Navbar'

export default function App({
  children
}: {
  children: ReactNode
}): ReactElement {
  const { site } = useSiteMetadata()

  return (
    <>
      <Head>
        <title>{site.title}</title>
        <meta name="description" content={site.description} />
        <link rel="icon" href={site.siteIcon} />
      </Head>

      <div>
        <Navbar />
        <main>{children}</main>
      </div>
    </>
  )
}
