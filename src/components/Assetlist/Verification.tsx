import styles from './Verification.module.css'
import Button from '../atoms/Button'
import Loader from '../atoms/Loader'
import VerifiedBadge from '../atoms/VerifiedBadge'
import { useEffect, useState } from 'react'
import { AdditionalInformation, DDO, Logger } from '@oceanprotocol/lib'
import {
  getPublisherFromServiceSD,
  getServiceSD,
  verifyServiceSD
} from '../../utils/metadata'

interface AdditionalInformationExtended extends AdditionalInformation {
  serviceSelfDescription?: {
    raw?: any
    url?: any
  }
}

export default function Verification({ ddo }: { ddo: DDO }) {
  const [isLoadingServiceSD, setIsLoadingServiceSD] = useState(false)
  const [isServiceSDVerified, setIsServiceSDVerified] = useState(false)
  const [showVerifiedAuthor, setShowVerifiedAuthor] = useState(false)
  const [verifiedServiceProviderName, setVerifiedServiceProviderName] =
    useState<string>()

  useEffect(() => {
    if (!ddo) return
    const { attributes } = ddo.findServiceByType('metadata')

    const additionalInformation: AdditionalInformationExtended =
      attributes.additionalInformation
    const serviceSD = additionalInformation?.serviceSelfDescription
    if (!serviceSD) {
      setIsServiceSDVerified(undefined)
      setShowVerifiedAuthor(true)
    }
  }, [ddo])

  const fetchVerifiedAuthor = async () => {
    if (!ddo) return
    const controller = new AbortController()
    setIsLoadingServiceSD(true)
    try {
      const { attributes } = ddo.findServiceByType('metadata')
      const additionalInformation: AdditionalInformationExtended =
        attributes.additionalInformation
      const serviceSD = additionalInformation?.serviceSelfDescription
      if (!serviceSD) return

      const requestBody = serviceSD?.url
        ? { body: serviceSD.url }
        : { body: serviceSD.raw, raw: true }
      if (!requestBody) return

      const isServiceSDVerified = await verifyServiceSD({
        ...requestBody,
        signal: controller.signal
      })
      if (!isServiceSDVerified) throw new Error()

      const serviceSDContent = serviceSD?.url
        ? await getServiceSD(serviceSD.url, controller.signal)
        : serviceSD.raw

      const serviceProviderName = await getPublisherFromServiceSD(
        serviceSDContent
      )
      setIsServiceSDVerified(isServiceSDVerified)
      setVerifiedServiceProviderName(serviceProviderName)
    } catch (error) {
      if (!controller.signal.aborted) {
        Logger.debug(error.message)
      }
    } finally {
      setIsLoadingServiceSD(false)
      setShowVerifiedAuthor(true)
    }
  }

  return (
    <div className={styles.container}>
      {isServiceSDVerified !== undefined && (
        <div>
          <Button
            disabled={isLoadingServiceSD}
            style="primary"
            onClick={(e) => {
              e.preventDefault()
              fetchVerifiedAuthor()
            }}
          >
            Verify
          </Button>
        </div>
      )}
      <p>{verifiedServiceProviderName || ddo.event.from}</p>
      {isLoadingServiceSD ? (
        <div className={styles.loader}>
          <span>Checking compliance</span>
          <Loader style="dots" />
        </div>
      ) : (
        showVerifiedAuthor &&
        (isServiceSDVerified ? (
          <VerifiedBadge text="Verified Self-Description" />
        ) : isServiceSDVerified === undefined ? (
          <VerifiedBadge text="Unavailable Self-Description" isUnavailable />
        ) : (
          <VerifiedBadge text="Invalid Self-Description" isInvalid />
        ))
      )}
    </div>
  )
}
