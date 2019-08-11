import * as Config from '../model/Config'
import { IQuickValue, IRegisteredValue } from '../model/ISkullValue'
import { ApiException } from '../model/Exception'

const mapToQuickValue = (rawValue: any): IQuickValue => {
  return {
    type: rawValue.type,
    amount: rawValue.amount ? rawValue.amount : 1,
    icon: rawValue.icon,
  }
}

const mapToRegisteredValue = (rawValue: any): IRegisteredValue => {
  return {
    type: rawValue.type,
    amount: rawValue.amount ? rawValue.amount : 0,
    millis: rawValue.millis ? rawValue.millis : 1,
  }
}

export default class Fetch {
  static quickValues(): Promise<IQuickValue[]> {
    let data = Config.Mock.values
      ? Promise.resolve(JSON.parse(Config.Mock.Data.quickValues))
      : fetch(Config.Endpoint.quickValues, {
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

    return data.then(v => v.map(mapToQuickValue))
  }

  static registeredValues(): Promise<IRegisteredValue[]> {
    let data = Config.Mock.values
      ? Promise.resolve(JSON.parse(Config.Mock.Data.registeredValues))
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

    return data.then(v => v.map(mapToRegisteredValue))
  }

}
