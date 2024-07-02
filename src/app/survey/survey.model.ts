export interface Question {
  options: Option[]
  title: string
  position: number
  required: boolean
  type: string
}

export interface Option {
  value: string
  key: string
}
