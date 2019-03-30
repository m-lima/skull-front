import * as Config from "../model/Config"
import * as Exception from "../model/Exception"
import IQuickValue from "../model/IQuickValue"

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
          throw new Exception.FetchException(r.status)
        }
      })
      .then(r => r.json())
  }
}
