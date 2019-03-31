export default interface ISkullValue {
  type: string
  amount: number
}

export interface IQuickValue extends ISkullValue {
  icon: string
}
