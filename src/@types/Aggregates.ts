export interface Aggregations {
  [name: string]: {
    bg_count: number
    doc_count: number
    buckets?: AggregationBucket[]
  }
}

export interface AggregationBucket {
  bg_count: number
  doc_count: number
  key: string
  score: number
}
