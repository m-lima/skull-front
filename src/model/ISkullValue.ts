export default interface ISkullValue {
  type: string
  amount: number
}

export interface IQuickValue extends ISkullValue {
  icon: string
}

export interface IRegisteredValue extends ISkullValue {
  millis: number
}
