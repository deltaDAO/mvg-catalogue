export default interface Metadata {
  '@context': string
  chainId: number
  created: Date
  isInPurgatory: boolean
  dataToken: string
  publicKey: {
    owner: string
  }
  service: Service[]
  updated: Date
}

export interface Service {
  attributes: {
    additionalInformation: {
      description: string
      tags: string[]
      termsAndConditions: boolean
    }
    curation: {
      isListed: true
      numVotes: number
      rating: number
    }
    main: MetadataMain
    status: {
      isListed: true
      isOrderDisabled: false
      isRetired: false
    }
  }
  index: number
  type: 'metadata' | 'compute' | 'download'
}

export const MetadataMainTypes = ['dataset', 'algorithm']

export interface MetadataMain {
  author: string
  dateCreated: Date
  datePublished: Date
  files: {
    contentLength: number
    contentType: string
    index: number
  }[]
  license: string
  name: string
  type: 'dataset' | 'algorithm'
}
