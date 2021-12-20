import '../styles/globals.css'
import type { AppProps } from 'next/app'
import App from '../components/App'

export default function NextApp({ Component }: AppProps) {
  return (
    <App>
      <Component />
    </App>
  )
}
