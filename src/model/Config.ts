import ISkullValue, { IQuickValue } from "./ISkullValue"

export class Mock {
  static readonly user = true
  static readonly values = true

  static readonly data: IQuickValue[] = [
    {
      type: 'bla',
      icon: 'fas fa-vial',
      amount: 1,
    },
    {
      type: 'ble',
      icon: 'fas fa-beer',
      amount: 1.5,
    },
    {
      type: 'bli',
      icon: 'fas fa-coffee',
      amount: 0.5,
    },
    {
      type: 'blo',
      icon: 'fas fa-receipt',
      amount: 0,
    },
    {
      type: 'blu',
      icon: 'fas fa-baby',
      amount: 2,
    },
  ]
}

export class Endpoint {
  static readonly login = ''
  static readonly skull = ''
  static readonly quickValues = ''
}