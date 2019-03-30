import * as Config from "../model/Config"
import ISkullValue from "../model/ISkullValue"
import { ApiException } from "../model/Exception"

export default class Push {
  static skullValue(value: ISkullValue): Promise<boolean> {
    if (Config.Mock.values) {
      return Promise.resolve(true)
    }

    return fetch(Config.Endpoint.skull + '?type=' + value.type + '&amount=' + value.amount, {
      method: 'POST',
      redirect: "follow",
      credentials: 'include',
    })
      .then(r => {
        if (r.ok) {
          return true
        } else {
          throw new ApiException(r.status)
        }
      })
  }
}
