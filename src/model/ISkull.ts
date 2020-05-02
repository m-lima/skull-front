import Color from './Color'

export interface IRegistered {
  id: number
}

export interface ISkull extends IRegistered {
  name: string
  color: Color
  icon: string
  unitPrice: number
}

export interface IRValuedSkull {
  skull: number
  amount: number
}

export interface IROccurrence extends IRegistered, IRValuedSkull {
  millis: number
}

export interface IValuedSkull {
  skull: ISkull
  amount: number
}

export interface IOccurrence extends IRegistered, IValuedSkull {
  millis: number
}
