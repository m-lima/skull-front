import Environment from './Environment'
import ISkullValue, { IQuickValue } from './ISkullValue'

export class Mock {
  static readonly user = true
  static readonly values = true

  static readonly Data = {
    quickValues: JSON.stringify([
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
    ]),
    registeredValues: JSON.stringify([
      {
        type:'blo',
        amout:1,
        millis:1553991448013,
      },
      {
        type:'ble',
        amount:18.5,
        millis:1553991451467,
      },
      {
        type:'blo',
        amount:1,
        millis:1554021022579,
      },
      {
        type:'bli',
        amount:1,
        millis:1554023920833,
      },
      {
        type:'blo',
        amount:1,
        millis:1554024801060,
      },
      {
        type:'blo',
        amount:1,
        millis:1554030052772,
      },
      {
        type:'bli',
        amount:1,
        millis:1554030055246}
    ]),
  }
}

export class Endpoint {
  static readonly login = ''
  static readonly logout = ''
  static readonly skull = ''
  static readonly quickValues = ''
}

export class Path {
  static readonly summary = '/summary'
  static readonly chart = '/chart'
}

export const environment = Environment.DEVELOPMENT
