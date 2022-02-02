import { ReactElement, ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'

import '@fontsource/overpass/300.css'
import '@fontsource/overpass/400.css'
import '@fontsource/overpass/700.css'

export default function Styles({
  children
}: {
  children: ReactNode
}): ReactElement {
  return (
    <>
      {children}
      <ToastContainer position="bottom-right" newestOnTop />
    </>
  )
}
