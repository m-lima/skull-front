import Environment from "./Environment"
import ISkullValue, { IQuickValue } from "./ISkullValue"

export class Mock {
  static readonly user = true
  static readonly values = true

static readonly data: string = JSON.stringify([
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
  ])
}

export class Endpoint {
  static readonly login = ''
  static readonly skull = ''
  static readonly quickValues = ''
}

export const environment = Environment.DEVELOPMENT
