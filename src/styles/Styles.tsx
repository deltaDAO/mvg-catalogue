import { ReactElement, ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'

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
