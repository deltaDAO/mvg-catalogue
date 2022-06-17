import { Logger } from '@oceanprotocol/lib'
import axios from 'axios'
import { complianceUri } from '../../app.config'

export async function getServiceSD(url: string): Promise<string> {
  if (!url) return

  try {
    const serviceSD = await axios.get(url)
    return serviceSD.data
  } catch (error) {
    Logger.error(error.message)
  }
}

export async function verifyServiceSD({
  body,
  raw
}: {
  body: string
  raw?: boolean
}): Promise<boolean> {
  if (!body) return false

  const baseUrl = raw
    ? `${complianceUri}/service-offering/verify/raw`
    : `${complianceUri}/service-offering/verify`
  const requestBody = raw ? body : { url: body }

  try {
    const response = await axios.post(baseUrl, requestBody)
    if (response?.status === 200) {
      return true
    }

    return false
  } catch (error) {
    Logger.error(error.message)
    return false
  }
}

export function getPublisherFromServiceSD(serviceSD: any): string {
  if (!serviceSD) return

  return serviceSD?.selfDescriptionCredential?.credentialSubject?.[
    'gx-service-offering:name'
  ]?.['@value']
}
