export interface FilterTerms {
  terms?: {
    [key: string]: string[] | number[]
  }
  term?: { [key: string]: string | number }
}
