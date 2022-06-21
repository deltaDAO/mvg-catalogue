import { ReactElement, SyntheticEvent, useEffect, useState } from 'react'
import {
  AdditionalInformation,
  DDO,
  Logger,
  MetadataMain
} from '@oceanprotocol/lib'
import { format } from 'date-fns'
import Dotdotdot from 'react-dotdotdot'
import styles from './Asset.module.css'
import Link from 'next/link'
import { portalUri } from '../../../app.config'
import Price from '../Price'
import { BestPrice } from '../../models/BestPrice'
import VerifiedBadge from '../atoms/VerifiedBadge'
import Loader from '../atoms/Loader'
import {
  getPublisherFromServiceSD,
  getServiceSD,
  verifyServiceSD
} from '../../utils/metadata'
import Button from '../atoms/Button'

interface AdditionalInformationExtended extends AdditionalInformation {
  serviceSelfDescription?: {
    raw?: any
    url?: any
  }
}

export default function Asset({
  ddo,
  price
}: {
  ddo: DDO
  price: BestPrice
}): ReactElement {
  const [metadata, setMetadata] = useState<MetadataMain>()
  const [isLoadingServiceSD, setIsLoadingServiceSD] = useState(false)
  const [isServiceSDVerified, setIsServiceSDVerified] = useState(false)
  const [verifiedAuthor, setVerifiedAuthor] = useState<string>()
  const [showVerifiedAuthor, setShowVerifiedAuthor] = useState(false)

  useEffect(() => {
    if (ddo) {
      const { attributes } = ddo.findServiceByType('metadata')
      setMetadata(attributes.main)

      const additionalInformation: AdditionalInformationExtended =
        attributes.additionalInformation
      const serviceSD = additionalInformation?.serviceSelfDescription
      if (!serviceSD) setShowVerifiedAuthor(true)
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

      const verifiedAuthor = getPublisherFromServiceSD(serviceSDContent)
      setIsServiceSDVerified(isServiceSDVerified)
      setVerifiedAuthor(verifiedAuthor)
    } catch (error) {
      if (!controller.signal.aborted) {
        Logger.debug(error.message)
      }
    } finally {
      setIsLoadingServiceSD(false)
      setShowVerifiedAuthor(true)
    }
  }

  // useEffect(() => {
  //   if (!ddo) return
  //   const controller = new AbortController()

  //   async function fetchVerifiedAuthor(ddo: DDO) {
  //     setIsLoadingServiceSD(true)
  //     try {
  //       const { attributes } = ddo.findServiceByType('metadata')
  //       const additionalInformation: AdditionalInformationExtended =
  //         attributes.additionalInformation
  //       const serviceSD = additionalInformation?.serviceSelfDescription
  //       if (!serviceSD) return

  //       const requestBody = serviceSD?.url
  //         ? { body: serviceSD.url }
  //         : { body: serviceSD.raw, raw: true }
  //       if (!requestBody) return

  //       const isServiceSDVerified = await verifyServiceSD({
  //         ...requestBody,
  //         signal: controller.signal
  //       })
  //       if (!isServiceSDVerified) throw new Error()

  //       const serviceSDContent = serviceSD?.url
  //         ? await getServiceSD(serviceSD.url, controller.signal)
  //         : serviceSD.raw

  //       const verifiedAuthor = getPublisherFromServiceSD(serviceSDContent)
  //       setIsServiceSDVerified(isServiceSDVerified)
  //       setVerifiedAuthor(verifiedAuthor)
  //     } catch (error) {
  //       if (!controller.signal.aborted) {
  //         Logger.debug(error.message)
  //       }
  //     } finally {
  //       setIsLoadingServiceSD(false)
  //     }
  //   }

  //   fetchVerifiedAuthor(ddo)

  //   return () => {
  //     controller.abort()
  //   }
  // }, [ddo])
  return (
    <Link href={`${portalUri}/asset/${ddo?.id}`}>
      <a className={styles.asset} target="blank" rel="noopener noreferrer">
        <div>
          <Dotdotdot className={styles.name} clamp={1}>
            {metadata?.name}
          </Dotdotdot>
          <div className={styles.author}>
            {!showVerifiedAuthor && !isServiceSDVerified && (
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
            <p>{verifiedAuthor || ddo.event.from}</p>
            {isLoadingServiceSD ? (
              <div className={styles.loader}>
                <span>Checking compliance</span>
                <Loader style="dots" />
              </div>
            ) : showVerifiedAuthor && isServiceSDVerified ? (
              <VerifiedBadge text="Verified Self-Description" />
            ) : (
              showVerifiedAuthor && (
                <VerifiedBadge text="Invalid Self-Description" isInvalid />
              )
            )}
          </div>
        </div>
        <div className={styles.info}>
          <span className={styles.price}>
            <Price price={price} conversion />
          </span>
          <span className={styles.date}>
            {metadata?.datePublished &&
              format(new Date(metadata.datePublished), 'dd/MM/yy, hh:mm z')}
          </span>
          <span className={styles.type}>{metadata?.type}</span>
        </div>
      </a>
    </Link>
  )
}
