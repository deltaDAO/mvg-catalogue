import { Logger } from '@oceanprotocol/lib'
import axios from 'axios'
import { isSanitizedUrl } from '.'
import { complianceUri } from '../../app.config'
import { ServiceSelfDescription } from '../@types/Metadata'

export async function getServiceSD(
  url: string,
  signal: AbortSignal
): Promise<string> {
  if (!url) return

  try {
    const serviceSD = await axios.get(url, { signal })
    return serviceSD.data
  } catch (error) {
    Logger.error(error.message)
  }
}

export async function verifyServiceSD({
  body,
  raw,
  signal
}: {
  body: string
  raw?: boolean
  signal: AbortSignal
}): Promise<boolean> {
  if (!body) return false

  const baseUrl = raw
    ? `${complianceUri}/service-offering/verify/raw`
    : `${complianceUri}/service-offering/verify`
  const requestBody = raw ? body : { url: body }

  try {
    const response = await axios.post(baseUrl, requestBody, {
      signal
    })
    if (response?.status === 200) {
      return true
    }

    return false
  } catch (error) {
    Logger.error(error.message)
    return false
  }
}

export async function getPublisherFromServiceSD(
  serviceSD: ServiceSelfDescription
): Promise<string> {
  if (!serviceSD) return

  try {
    const providedByUrl =
      serviceSD?.selfDescriptionCredential?.credentialSubject?.[
        'gx-service-offering:providedBy'
      ]?.['@value']
    if (!isSanitizedUrl(providedByUrl)) return

    const response = await axios.get(providedByUrl)
    if (!response || response.status !== 200 || !response?.data) return

    return response.data?.selfDescriptionCredential?.credentialSubject?.[
      'gx-participant:name'
    ]?.['@value']
  } catch (error) {
    Logger.error(error.message)
  }
}
