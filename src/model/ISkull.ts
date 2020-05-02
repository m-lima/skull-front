import Color from './Color'

export interface ISkull {
  id: number
  name: string
  color: Color
  icon: string
  unitPrice: number
}

export interface IQuick {
  skull: number
  amount: number
}

export interface IRegistered extends IQuick {
  millis: number
}
