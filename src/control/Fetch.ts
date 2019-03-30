import * as Config from "../model/Config"
import ISkullValue, { IQuickValue } from "../model/ISkullValue"
import { ApiException } from "../model/Exception"

export default class Fetch {
  static quickValues(): Promise<IQuickValue[]> {
    if (Config.Mock.values) {
      return Promise.resolve(Config.Mock.data)
    }

    return fetch(Config.Endpoint.quickValues, {
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
  }
}
