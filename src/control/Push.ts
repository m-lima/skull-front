import * as Config from '../model/Config'
import { ProtoOccurrence, Occurrence } from '../model/Skull'
import { ApiException } from '../model/Exception'

export default class Push {
  static async skull(skull: ProtoOccurrence): Promise<boolean> {
    if (Config.Mock.values) {
      return Promise.resolve(true)
    }

    return fetch(`${Config.Endpoint.occurrence}?skull=${skull.skull.id}&amount=${skull.amount}&millis=${skull.date.getTime()}`, {
      method: 'PUT',
      redirect: 'follow',
      credentials: 'include',
      headers: Config.headers,
    })
      .then(r => {
        if (r.ok) {
          return true
        } else {
          throw new ApiException(r.status)
        }
      })
  }

  static async update(skull: Occurrence): Promise<boolean> {
    if (Config.Mock.values) {
      return Promise.resolve(true)
    }

    return fetch(`${Config.Endpoint.occurrence}?id=${skull.id}&skull=${skull.skull.id}&amount=${skull.amount}&millis=${skull.date.getTime()}`, {
      method: 'POST',
      redirect: 'follow',
      credentials: 'include',
      headers: Config.headers,
    })
      .then(r => {
        if (r.ok) {
          return true
        } else {
          throw new ApiException(r.status)
        }
      })
  }

  static async deletion(occurrence: Occurrence): Promise<boolean> {
    if (Config.Mock.values) {
      return Promise.resolve(true)
    }

    return fetch(Config.Endpoint.occurrence + '?id=' + occurrence.id, {
      method: 'DELETE',
      redirect: 'follow',
      credentials: 'include',
      headers: Config.headers,
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
