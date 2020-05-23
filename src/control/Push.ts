import * as Config from '../model/Config'
import { ValuedSkull, Occurrence } from '../model/Skull'
import { ApiException } from '../model/Exception'

export default class Push {
  static skull(skull: ValuedSkull): Promise<boolean> {
    if (Config.Mock.values) {
      return Promise.resolve(true)
    }

    return fetch(Config.Endpoint.occurrence + '?skull=' + skull.skull.id + '&amount=' + skull.amount, {
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

  static deletion(occurrence: Occurrence): Promise<boolean> {
    if (Config.Mock.values) {
      return Promise.resolve(true)
    }

    return fetch(Config.Endpoint.occurrence + '?id=' + occurrence.id, {
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
