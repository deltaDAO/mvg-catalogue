import siteContent from '../../content/site.json'
import appConfig from '../../app.config'
import { SiteMetadata } from '../@types/SiteMetadata'
import { AppConfig } from '../@types/AppConfig'

export interface UseSiteMetadata {
  site: SiteMetadata
  appConfig: AppConfig
}

export function useSiteMetadata(): UseSiteMetadata {
  const siteMetadata: UseSiteMetadata = {
    ...siteContent,
    appConfig
  }

  return siteMetadata
}
