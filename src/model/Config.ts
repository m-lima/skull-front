import Environment from './Environment'

export class Mock {
  static readonly user = true
  static readonly values = true

  static readonly Data = {
    skulls: JSON.stringify([
      {
        id: 0,
        name: 'bla',
        color: 'red',
        icon: 'fas fa-vial',
        unitPrice: 1,
      },
      {
        id: 1,
        name: 'ble',
        color: 'blue',
        icon: 'fas fa-vial',
        unitPrice: 2.7,
      },
      {
        id: 2,
        name: 'bli',
        color: 'yellow',
        icon: 'fas fa-vial',
        unitPrice: 3,
        limit: 4,
      },
    ]),
    quicks: JSON.stringify([
      {
        skull: 0,
        amount: 1,
      },
      {
        skull: 1,
        amount: 1.5,
      },
      {
        skull: 2,
        amount: 2.7
      },
      {
        skull: 2,
        amount: 0.1,
      },
      {
        skull: 2,
        amount: 2,
      },
    ]),
    occurrences: JSON.stringify([
      {
        id: 0,
        skull: 0,
        amount: 3,
        millis: new Date().valueOf(),
      },
      {
        id: 1,
        skull: 2,
        amount: 3,
        millis: new Date().valueOf() + 1,
      },
      {
        id: 2,
        skull: 2,
        amount: 3,
        millis: new Date().valueOf() + 2,
      },
      {
        id: 3,
        skull: 2,
        amount: 3,
        millis: new Date().valueOf() + 3,
      },
    ]),
  }
}

export class Endpoint {
  static readonly login = ''
  static readonly logout = ''
  static readonly skull = ''
  static readonly quick = ''
  static readonly occurrence = ''
}

export class Path {
  static readonly grid = '/'
  static readonly summary = '/summary'
  static readonly chart = '/chart'
}

export const environment = Environment.DEVELOPMENT
