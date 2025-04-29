export interface Option {
  farmer: string
  bank: string
  strikePrice: bigint
  premium: bigint
  expiryDate: bigint
  quantity: bigint
  cropType: string
  exercised: boolean
  cancelled: boolean
}

export interface OptionListing {
  optionId: bigint
  seller: string
  price: bigint
  active: boolean
}

export interface CreateOptionParams {
  bank: string
  strikePrice: bigint
  premium: bigint
  expiryDate: bigint
  quantity: bigint
  cropType: string
}
