import * as Config from '../model/Config'
import { IValuedSkull, IOccurrence } from '../model/ISkull'
import { ApiException } from '../model/Exception'

export default class Push {
  static skull(skull: IValuedSkull): Promise<boolean> {
    if (Config.Mock.values) {
      return Promise.resolve(true)
    }

    return fetch(Config.Endpoint.skull + '?skull=' + skull.skull + '&amount=' + skull.amount, {
      method: 'POST',
      redirect: 'follow',
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

  static deletion(occurrence: IOccurrence): Promise<boolean> {
    if (Config.Mock.values) {
      return Promise.resolve(true)
    }

    return fetch(Config.Endpoint.skull + '?id=' + occurrence.id, {
      method: 'DELETE',
      redirect: 'follow',
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
