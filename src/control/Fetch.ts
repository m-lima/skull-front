import * as Config from '../model/Config'
import Color from '../model/Color'
import { ISkull, IRValuedSkull as IRQuick, IROccurrence} from '../model/ISkull'
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

const mapToQuick = (raw: any): IRQuick => {
  return {
      skull: raw.skull,
      amount: raw.amount ? raw.amount : 0,
  }
}

const mapToOccurrence = (raw: any): IROccurrence => {
  return {
    id: raw.id,
    skull: raw.skull,
    amount: raw.amount ? raw.amount : 0,
    millis: raw.millis ? raw.millis : 1,
  }
}

export default class Fetch {
  static skulls(): Promise<ISkull[]> {
    let data = Config.Mock.values
      ? Promise.resolve(JSON.parse(Config.Mock.Data.skulls))
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

  static quicks(): Promise<IRQuick[]> {
    let data = Config.Mock.values
      ? Promise.resolve(JSON.parse(Config.Mock.Data.quicks))
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

  static occurrences(): Promise<IROccurrence[]> {
    let data = Config.Mock.values
      ? Promise.resolve(JSON.parse(Config.Mock.Data.occurrences))
      : fetch(Config.Endpoint.occurrence, {
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

    return data.then(v => v.map(mapToOccurrence))
  }
}
