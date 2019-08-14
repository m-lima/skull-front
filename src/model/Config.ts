import Environment from './Environment'

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
        type: 'dois',
        icon: 'fas fa-beer',
        amount: 1.5,
      },
      {
        type: 'quatro',
        icon: 'fas fa-coffee',
      },
      {
        type: 'tres',
        icon: 'fas fa-receipt',
        amount: 0,
      },
      {
        type: 'cinco',
        icon: 'fas fa-baby',
        amount: 2,
      },
    ]),
    registeredValues: JSON.stringify([
      {
        type:'um',
        amount:10,
        millis:1553991448013,
      },
      {
        type:'dois',
        amount:15.5,
        millis:1553991451467,
      },
      {
        type:'tres',
        amount:2,
        millis:1554021022579,
      },
      {
        type:'quatro',
        amount:3,
        millis:1554024920833,
      },
      {
        type:'tres',
        amount:10,
        millis:1554029801060,
      },
      {
        type:'tres',
        amount:7,
        millis:1554030052772,
      },
      {
        type:'quatro',
        amount:2.5,
        millis:1554030055246,
      },
      {
        type:'um',
        amount:6,
        millis:1554991448013,
      },
      {
        type:'dois',
        amount:18.5,
        millis:1554991451467,
      },
      {
        type:'tres',
        amount:1,
        millis:1555021022579,
      },
      {
        type:'quatro',
        amount:3,
        millis:1555023920833,
      },
      {
        type:'tres',
        amount:1,
        millis:1555024801060,
      },
      {
        type:'tres',
        amount:7,
        millis:1555030052772,
      },
      {
        type:'quatro',
        amount:2.5,
        millis:1555030055246,
      },
      {
        type:'um',
        amount:10,
        millis:1555991448013,
      },
      {
        type:'dois',
        amount:18.5,
        millis:1555991451467,
      },
      {
        type:'tres',
        amount:1,
        millis:1556021022579,
      },
      {
        type:'quatro',
        amount:3,
        millis:1556023920833,
      },
      {
        type:'tres',
        amount:1,
        millis:1556024801060,
      },
      {
        type:'tres',
        amount:7,
        millis:1556030052772,
      },
      {
        type:'quatro',
        amount:2.5,
        millis:1556030055246,
      },
      {
        type:'um',
        amount:10,
        millis:1556991448013,
      },
      {
        type:'dois',
        amount:18.5,
        millis:1556991451467,
      },
      {
        type:'tres',
        amount:1,
        millis:1557021022579,
      },
      {
        type:'quatro',
        amount:3,
        millis:1557023920833,
      },
      {
        type:'tres',
        amount:1,
        millis:1557024801060,
      },
      {
        type:'tres',
        amount:7,
        millis:1557030052772,
      },
      {
        type:'quatro',
        amount:2.5,
        millis:1557030055246,
      },
      {
        type:'um',
        amount:1,
        millis:1557200055246,
      },
      {
        type:'dois',
        amount:2,
        millis:1557210055246,
      },
      {
        type:'tres',
        amount:3,
        millis:1557220055246,
      },
      {
        type:'quatro',
        amount:4,
        millis:1557230055246,
      },
      {
        type:'um',
        amount:1,
        millis:1557200055246 + 86400000,
      },
      {
        type:'dois',
        amount:2,
        millis:1557210055246 + 86400000,
      },
      {
        type:'tres',
        amount:3,
        millis:1557220055246 + 86400000,
      },
      {
        type:'quatro',
        amount:4,
        millis:1557230055246 + 86400000,
      },
      {
        type:'um',
        amount:1,
        millis:1557200055246 + 86400000 * 2,
      },
      {
        type:'dois',
        amount:2,
        millis:1557210055246 + 86400000 * 2,
      },
      {
        type:'tres',
        amount:3,
        millis:1557220055246 + 86400000 * 2,
      },
      {
        type:'quatro',
        amount:4,
        millis:1557230055246 + 86400000 * 2,
      },
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
  static readonly grid = '/'
  static readonly summary = '/summary'
  static readonly chart = '/chart'
}

export const environment = Environment.DEVELOPMENT
