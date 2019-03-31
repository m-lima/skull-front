import * as Config from "../model/Config"
import ISkullValue, { IQuickValue } from "../model/ISkullValue"
import { ApiException } from "../model/Exception"

const mapToQuickValue = (rawValue: any): IQuickValue => {
  return {
    type: rawValue.type,
    amount: rawValue.amount ? rawValue.amount : 1,
    icon: rawValue.icon,
  }
}

export default class Fetch {
  static quickValues(): Promise<IQuickValue[]> {
    let data = Config.Mock.values
      ? Promise.resolve(JSON.parse(Config.Mock.data))
      : fetch(Config.Endpoint.quickValues, {
        method: 'GET',
        redirect: "follow",
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
}
