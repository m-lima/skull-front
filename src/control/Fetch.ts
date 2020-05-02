import * as Config from '../model/Config'
import Color from '../model/Color'
import { ISkull, IQuick, IRegistered} from '../model/ISkull'
import { ApiException } from '../model/Exception'

const mapToSkull = (raw: any): ISkull => {
    return {
        id: raw.id,
        name: raw.name,
        color: new Color(raw.color),
        icon: raw.icon,
        unitPrice: raw.unitPrice,
    }
}

const mapToQuick = (raw: any): IQuick => {
  return {
      skull: raw.skull,
      amount: raw.amount ? raw.amount : 0,
  }
}

const mapToRegistered = (raw: any): IRegistered => {
  return {
    skull: raw.skull,
    amount: raw.amount ? raw.amount : 0,
    millis: raw.millis ? raw.millis : 1,
  }
}

export default class Fetch {
  static skull(): Promise<ISkull[]> {
    let data = Config.Mock.values
      ? Promise.resolve(JSON.parse(Config.Mock.Data.skull))
      : fetch(Config.Endpoint.skull, {
        method: 'GET',
        redirect: 'follow',
        credentials: 'include',
      })
        .then(r => {
          if (r.ok) {
            return r
          } else {
            throw new ApiException(r.status)
          }
        })
        .then(r => r.json())

    return data.then(v => v.map(mapToSkull))
  }

  static quick(): Promise<IQuick[]> {
    let data = Config.Mock.values
      ? Promise.resolve(JSON.parse(Config.Mock.Data.quick))
      : fetch(Config.Endpoint.quick, {
        method: 'GET',
        redirect: 'follow',
        credentials: 'include',
      })
        .then(r => {
          if (r.ok) {
            return r
          } else {
            throw new ApiException(r.status)
          }
        })
        .then(r => r.json())

    return data.then(v => v.map(mapToQuick))
  }

  static registered(): Promise<IRegistered[]> {
    let data = Config.Mock.values
      ? Promise.resolve(JSON.parse(Config.Mock.Data.registered))
      : fetch(Config.Endpoint.registered, {
        method: 'GET',
        redirect: 'follow',
        credentials: 'include',
      })
        .then(r => {
          if (r.ok) {
            return r
          } else {
            throw new ApiException(r.status)
          }
        })
        .then(r => r.json())

    return data.then(v => v.map(mapToRegistered))
  }
}
